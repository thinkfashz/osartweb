import { Injectable, Inject } from '@nestjs/common';
import { makeSupabaseService, makeSupabaseAnon } from '../../config/supabase.client';
import { StockMovement, StockMovementType } from './models/stock-movement.model';
import { UpdateStockInput, StockMovementFilterInput } from './dto/stock.input';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class StockService {
    private admin = makeSupabaseService();
    private anon = makeSupabaseAnon();

    constructor(
        @Inject('PUB_SUB') private readonly pubSub: PubSub
    ) { }

    async updateStock(input: UpdateStockInput) {
        const { productId, qty, type, reason } = input;

        // 1. Get current stock
        const { data: product, error: fetchErr } = await this.admin
            .from('products')
            .select('stock, name')
            .eq('id', productId)
            .single();

        if (fetchErr || !product) throw new Error('Producto no encontrado');

        let newStock = product.stock;
        if (type === StockMovementType.IN) newStock += qty;
        else if (type === StockMovementType.OUT) newStock -= qty;
        else if (type === StockMovementType.ADJUST) newStock = qty;

        // 2. Update product stock
        const { data: updated, error: updateErr } = await this.admin
            .from('products')
            .update({ stock: newStock })
            .eq('id', productId)
            .select()
            .single();

        if (updateErr) throw updateErr;

        // 3. Log movement
        const { error: moveErr } = await this.admin.from('stock_movements').insert({
            product_id: productId,
            type,
            qty: type === StockMovementType.ADJUST ? qty - product.stock : qty,
            reason: reason || `Ajuste manual de stock (${type})`,
        });

        if (moveErr) console.error('Error logging movement:', moveErr);

        // 4. Notify realtime
        this.pubSub.publish('stockUpdated', {
            stockUpdated: {
                productId,
                stock: newStock,
                updatedAt: new Date().toISOString(),
            },
        });

        return updated;
    }

    async getMovements(filter: StockMovementFilterInput): Promise<StockMovement[]> {
        let q = this.admin.from('stock_movements').select('*').order('created_at', { ascending: false });

        if (filter.productId) q = q.eq('product_id', filter.productId);
        if (filter.startDate) q = q.gte('created_at', filter.startDate);
        if (filter.endDate) q = q.lte('created_at', filter.endDate);

        const { data, error } = await q;
        if (error) throw error;

        return (data || []).map(row => ({
            id: row.id,
            productId: row.product_id,
            type: row.type as StockMovementType,
            qty: row.qty,
            reason: row.reason,
            createdAt: row.created_at,
        }));
    }

    async getLowStockProducts(threshold: number = 3) {
        const { data, error } = await this.admin
            .from('products')
            .select('*')
            .lte('stock', threshold)
            .order('stock', { ascending: true });

        if (error) throw error;
        return data || [];
    }
}

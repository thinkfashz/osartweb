import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { makeSupabaseService } from '../../config/supabase.client';

@Injectable()
export class CartService {
    private supabase = makeSupabaseService();

    async getOrCreateActiveCart(userId: string) {
        const { data: cart } = await this.supabase
            .from('carts')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .maybeSingle();

        if (cart) return cart;

        const { data: created, error } = await this.supabase
            .from('carts')
            .insert({ user_id: userId, status: 'active' })
            .select('*')
            .single();

        if (error) throw error;
        return created;
    }

    async getCart(userId: string) {
        const cart = await this.getOrCreateActiveCart(userId);

        const { data: items, error } = await this.supabase
            .from('cart_items')
            .select('id, quantity, unit_price, product:products(*)')
            .eq('cart_id', cart.id);

        if (error) throw error;

        const subtotal = (items ?? []).reduce(
            (acc: number, it: any) => acc + Number(it.unit_price) * it.quantity,
            0,
        );

        return {
            id: cart.id,
            status: cart.status,
            items: (items ?? [])
                .filter((it: any) => {
                    if (!it.product) {
                        console.warn(`[CartService] Found orphaned item ${it.id} without product`);
                        return false;
                    }
                    if (!it.product.name) {
                        console.error(`[CartService] Product in item ${it.id} has NO NAME:`, JSON.stringify(it.product));
                    }
                    return true;
                })
                .map((it: any) => {
                    const product = it.product || {};
                    return {
                        id: it.id,
                        quantity: it.quantity,
                        unitPrice: Number(it.unit_price),
                        product: {
                            id: product.id || it.product_id,
                            name: product.name || 'Componente Sin Identificar',
                            slug: product.slug || 'unknown',
                            price: Number(product.price || it.unit_price || 0),
                            stock: Number(product.stock || 0),
                            sku: product.sku || 'N/A',
                            isActive: product.is_active ?? true,
                            createdAt: product.created_at || new Date().toISOString(),
                        },
                    };
                }),
            subtotal,
        };
    }

    async addToCart(userId: string, productId: string, quantity: number) {
        const cart = await this.getOrCreateActiveCart(userId);

        const { data: product, error: pErr } = await this.supabase
            .from('products')
            .select('id, price, stock, is_active')
            .eq('id', productId)
            .single();

        if (pErr || !product) throw new NotFoundException('Product not found');
        if (!product.is_active) throw new BadRequestException('Product is currently inactive');

        const currentStock = Number(product.stock);
        console.log(`[CartService] Checking stock for product ${productId}: requested=${quantity}, available=${currentStock}`);

        if (currentStock < quantity) {
            throw new BadRequestException(`Not enough stock available. Requested: ${quantity}, Available: ${currentStock}`);
        }

        const { data: existing } = await this.supabase
            .from('cart_items')
            .select('*')
            .eq('cart_id', cart.id)
            .eq('product_id', productId)
            .maybeSingle();

        if (existing) {
            const newQty = existing.quantity + quantity;

            if (newQty <= 0) {
                const { error } = await this.supabase
                    .from('cart_items')
                    .delete()
                    .eq('id', existing.id);
                if (error) throw error;
                return this.getCart(userId);
            }

            const currentStock = Number(product.stock);
            console.log(`[CartService] Checking stock for existing item update ${productId}: requestedTotal=${newQty}, available=${currentStock}`);

            if (currentStock < newQty) {
                throw new BadRequestException(`Not enough stock available for total quantity. Requested: ${newQty}, Available: ${currentStock}`);
            }

            const { error } = await this.supabase
                .from('cart_items')
                .update({ quantity: newQty })
                .eq('id', existing.id);

            if (error) throw error;
            return this.getCart(userId);
        }

        const { error } = await this.supabase.from('cart_items').insert({
            cart_id: cart.id,
            product_id: productId,
            quantity,
            unit_price: product.price,
        });

        if (error) throw error;
        return this.getCart(userId);
    }

    async updateCartItem(userId: string, itemId: string, quantity: number) {
        const cart = await this.getOrCreateActiveCart(userId);

        const { data: item } = await this.supabase
            .from('cart_items')
            .select('id, product_id')
            .eq('id', itemId)
            .eq('cart_id', cart.id)
            .maybeSingle();

        if (!item) throw new NotFoundException('Cart item not found');

        const { data: product } = await this.supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();

        if (!product) throw new NotFoundException('Product not found');
        if (product.stock < quantity) throw new BadRequestException('Not enough stock available');

        const { error } = await this.supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', itemId);

        if (error) throw error;
        return this.getCart(userId);
    }

    async removeCartItem(userId: string, itemId: string) {
        const cart = await this.getOrCreateActiveCart(userId);

        const { error } = await this.supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId)
            .eq('cart_id', cart.id);

        if (error) throw error;
        return this.getCart(userId);
    }

    async mergeGuestCart(userId: string, guestItems: any[]) {
        for (const item of guestItems) {
            try {
                await this.addToCart(userId, item.productId, item.quantity);
            } catch (e) {
                console.error(`Failed to merge item ${item.productId}:`, e.message);
            }
        }
        return this.getCart(userId);
    }
}

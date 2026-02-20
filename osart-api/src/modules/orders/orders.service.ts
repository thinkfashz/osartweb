import { Injectable, NotFoundException } from '@nestjs/common';
import { makeSupabaseAnon, makeSupabaseService } from '../../config/supabase.client';
import { SalesSummary } from './models/sales-summary.model';

@Injectable()
export class OrdersService {
    private supabase = makeSupabaseAnon();
    private admin = makeSupabaseService();

    async createFromCart(userId: string, shippingAddress: any, couponCode?: string) {
        const { data, error } = await this.supabase.rpc('create_order_from_cart_v2', {
            p_user_id: userId,
            p_shipping_address: shippingAddress,
            p_coupon_code: couponCode,
        });

        if (error) throw error;
        const orderId = data as string;

        return this.getOrder(userId, orderId);
    }

    async listOrders(userId: string) {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const orders = data ?? [];
        const results = [];
        for (const o of orders) {
            results.push(await this.getOrder(userId, o.id));
        }
        return results;
    }

    async getOrder(userId: string, orderId: string) {
        const { data: order, error } = await this.supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('user_id', userId)
            .single();

        if (error || !order) throw new NotFoundException('Order not found');

        const { data: items, error: iErr } = await this.supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

        if (iErr) throw iErr;

        return {
            id: order.id,
            status: order.status,
            paymentStatus: order.payment_status,
            subtotal: Number(order.subtotal),
            shipping: Number(order.shipping),
            total: Number(order.total),
            shippingAddress: order.shipping_address,
            items: (items ?? []).map((it: any) => ({
                id: it.id,
                productId: it.product_id,
                quantity: it.quantity,
                unitPrice: Number(it.unit_price),
            })),
            createdAt: order.created_at,
        };
    }

    async listAdminOrders(filter: any = {}) {
        let q = this.admin
            .from('orders')
            .select('*, profiles(full_name, email)')
            .order('created_at', { ascending: false });

        if (filter.status) q = q.eq('status', filter.status);
        if (filter.userId) q = q.eq('user_id', filter.userId);

        // Advanced Filters
        if (filter.search) {
            // Simple search by ID or customer email if joined properly
            // Or use ilike on profiles.email if Supabase supports it in this join
            q = q.or(`id.ilike.%${filter.search}%`);
        }

        if (filter.startDate) q = q.gte('created_at', filter.startDate);
        if (filter.endDate) q = q.lte('created_at', filter.endDate);
        if (filter.minTotal) q = q.gte('total', filter.minTotal);
        if (filter.maxTotal) q = q.lte('total', filter.maxTotal);

        const { data, error } = await q;
        if (error) throw error;

        return (data || []).map(o => ({
            ...o,
            customerName: o.profiles?.full_name || 'Guest',
            customerEmail: o.profiles?.email || 'N/A',
            createdAt: o.created_at,
        }));
    }

    async getSalesSummary(dateRange: string): Promise<SalesSummary> {
        const now = new Date();
        let startDate: Date;

        switch (dateRange) {
            case '7d': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
            case '30d': startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
            case '90d': startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
            case 'all': startDate = new Date(0); break;
            default: startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const isoStart = startDate.toISOString();

        // 1. Fetch Orders in range
        const { data: totals, error: tErr } = await this.admin
            .from('orders')
            .select('id, total, created_at')
            .eq('payment_status', 'paid')
            .gte('created_at', isoStart);

        if (tErr) throw tErr;

        const totalRevenue = totals.reduce((acc, o) => acc + Number(o.total), 0);
        const totalOrders = totals.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // 2. Revenue By Day
        const days: Record<string, { revenue: number, orders: number }> = {};
        totals.forEach(o => {
            const date = o.created_at.split('T')[0];
            if (!days[date]) days[date] = { revenue: 0, orders: 0 };
            days[date].revenue += Number(o.total);
            days[date].orders += 1;
        });

        const revenueByDay = Object.entries(days).map(([date, val]) => ({
            date,
            revenue: val.revenue,
            orders: val.orders,
        })).sort((a, b) => a.date.localeCompare(b.date));

        // 3. Top Products Aggregation
        // We fetch order_items for the orders in this range
        const orderIds = totals.map(o => o.id);
        if (orderIds.length === 0) {
            return { totalRevenue, totalOrders, avgOrderValue, revenueByDay, topProducts: [] };
        }

        const { data: items, error: iErr } = await this.admin
            .from('order_items')
            .select('product_id, quantity, unit_price, products(name)')
            .in('order_id', orderIds);

        if (iErr) throw iErr;

        const productStats: Record<string, { name: string, unitsSold: number, revenue: number }> = {};
        items?.[0] && (items as any[]).forEach(it => {
            const pid = it.product_id;
            if (!productStats[pid]) {
                productStats[pid] = { name: it.products?.name || 'Unknown', unitsSold: 0, revenue: 0 };
            }
            productStats[pid].unitsSold += it.quantity;
            productStats[pid].revenue += Number(it.unit_price) * it.quantity;
        });

        const topProducts = Object.entries(productStats)
            .map(([productId, val]) => ({
                productId,
                ...val
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        return {
            totalRevenue,
            totalOrders,
            avgOrderValue,
            revenueByDay,
            topProducts,
        };
    }
}

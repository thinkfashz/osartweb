import { Injectable } from '@nestjs/common';
import { makeSupabaseService } from '../../config/supabase.client';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
    private admin = makeSupabaseService();

    async listAdminCustomers(search?: string): Promise<User[]> {
        // Query profiles and join with order stats (simple aggregation for now)
        let q = this.admin.from('profiles').select('*, orders(total)');

        if (search) {
            q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
        }

        const { data, error } = await q;
        if (error) throw error;

        return (data || []).map(row => {
            const orders = row.orders || [];
            return {
                id: row.id,
                fullName: row.full_name,
                email: row.email,
                phone: row.phone,
                createdAt: row.created_at,
                totalOrders: orders.length,
                totalSpent: orders.reduce((acc: number, o: any) => acc + Number(o.total || 0), 0),
            };
        });
    }

    async getCustomerDetail(id: string) {
        const { data: profile, error } = await this.admin
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !profile) throw new Error('Customer not found');

        // Fetch last 5 orders
        const { data: orders } = await this.admin
            .from('orders')
            .select('*')
            .eq('user_id', id)
            .order('created_at', { ascending: false })
            .limit(5);

        return {
            ...profile,
            id: profile.id,
            fullName: profile.full_name,
            lastOrders: orders || [],
        };
    }
}

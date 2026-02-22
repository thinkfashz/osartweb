import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const id = searchParams.get('id');

    if (id) {
        // Detail view
        const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !profile) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        const { data: orders } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('user_id', id)
            .order('created_at', { ascending: false })
            .limit(5);

        return NextResponse.json({
            ...profile,
            fullName: profile.full_name,
            lastOrders: orders || [],
        });
    }

    // List view for admin
    let q = supabaseAdmin.from('profiles').select('*, orders(total)');

    if (search) {
        q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await q;
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = (data || []).map(row => {
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

    return NextResponse.json(formatted);
}

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Admin client not configured' }, { status: 501 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query = supabaseAdmin
        .from('orders')
        .select('*, order_items(*)');

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Admin client not configured' }, { status: 501 });
    }

    try {
        const body = await request.json();

        // Porting the 'create_order_from_cart_v2' RPC logic
        const { data, error } = await supabaseAdmin.rpc('create_order_from_cart_v2', {
            p_user_id: body.userId,
            p_shipping_address: body.shippingAddress,
            p_coupon_code: body.couponCode,
        });

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        return NextResponse.json({ orderId: data }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

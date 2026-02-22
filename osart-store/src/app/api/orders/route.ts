```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Admin client not configured' }, { status: 501 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const summary = searchParams.get('summary');

  if (summary === 'true') {
    // Handle Sales Summary logic similar to NestJS
    const startObj = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const { data: totals, error: tErr } = await supabaseAdmin
        .from('orders')
        .select('id, total, created_at')
        .eq('payment_status', 'paid')
        .gte('created_at', startObj.toISOString());

    if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 });

    const totalRevenue = (totals || []).reduce((acc, o) => acc + Number(o.total), 0);
    const totalOrders = (totals || []).length;
    
    // Revenue by day aggregation
    const days: Record<string, { revenue: number, orders: number }> = {};
    (totals || []).forEach(o => {
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

    return NextResponse.json({ 
        totalRevenue, 
        totalOrders, 
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        revenueByDay 
    });
  }

  let query = supabaseAdmin
    .from('orders')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false });

  if (userId) query = query.eq('user_id', userId);
  if (status) query = query.eq('status', status);
  if (search) query = query.or(`id.ilike.% ${ search }% `);
  if (startDate) query = query.gte('created_at', startDate);
  if (endDate) query = query.lte('created_at', endDate);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data || []).map(o => ({
    ...o,
    customerName: o.profiles?.full_name || 'Guest',
    customerEmail: o.profiles?.email || 'N/A',
    total: Number(o.total || 0),
    subtotal: Number(o.subtotal || 0),
    shipping: Number(o.shipping || 0)
  })));
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

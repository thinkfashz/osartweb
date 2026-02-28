import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Admin client not configured' }, { status: 501 });
    }

    try {
        const body = await request.json();
        const { qty, type, reason } = body;
        const productId = params.id;

        if (!productId || qty === undefined || !type) {
            return NextResponse.json({ error: 'Missing required fields: qty, type' }, { status: 400 });
        }

        // Fetch current stock
        const { data: product, error: fetchErr } = await supabaseAdmin
            .from('products')
            .select('id, name, stock')
            .eq('id', productId)
            .single();

        if (fetchErr || !product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        let newStock: number;
        if (type === 'in') {
            newStock = product.stock + qty;
        } else if (type === 'out') {
            newStock = Math.max(0, product.stock - qty);
        } else {
            // type === 'adjust': set absolute value
            newStock = Math.max(0, qty);
        }

        const { data: updated, error: updateErr } = await supabaseAdmin
            .from('products')
            .update({ stock: newStock })
            .eq('id', productId)
            .select('id, stock')
            .single();

        if (updateErr) {
            return NextResponse.json({ error: updateErr.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            productId,
            previousStock: product.stock,
            newStock: updated.stock,
            adjustment: qty,
            type,
            reason: reason || `Manual ${type} adjustment`
        });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

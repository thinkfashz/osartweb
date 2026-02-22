import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from('wishlists')
        .select('id, user_id, product_id, created_at, product:products(*)')
        .eq('user_id', userId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.map(row => ({
        id: row.id,
        userId: row.user_id,
        productId: row.product_id,
        product: row.product,
        createdAt: row.created_at,
    })) || []);
}

export async function POST(request: NextRequest) {
    try {
        const { userId, productId } = await request.json();

        if (!userId || !productId) {
            return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 });
        }

        const { data: existing } = await supabaseAdmin
            .from('wishlists')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .maybeSingle();

        if (existing) {
            await supabaseAdmin.from('wishlists').delete().eq('id', existing.id);
        } else {
            await supabaseAdmin.from('wishlists').insert({ user_id: userId, product_id: productId });
        }

        // Return updated wishlist
        const { data: updated } = await supabaseAdmin
            .from('wishlists')
            .select('id, user_id, product_id, created_at, product:products(*)')
            .eq('user_id', userId);

        return NextResponse.json(updated?.map(row => ({
            id: row.id,
            userId: row.user_id,
            productId: row.product_id,
            product: row.product,
            createdAt: row.created_at,
        })) || []);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

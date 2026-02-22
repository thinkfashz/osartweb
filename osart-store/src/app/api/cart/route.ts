import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper to get or create active cart
async function getOrCreateActiveCart(userId: string) {
    const { data: cart } = await supabaseAdmin
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

    if (cart) return cart;

    const { data: created, error } = await supabaseAdmin
        .from('carts')
        .insert({ user_id: userId, status: 'active' })
        .select('*')
        .single();

    if (error) throw error;
    return created;
}

// Helper to get formatted cart
async function getCart(userId: string) {
    const cart = await getOrCreateActiveCart(userId);

    const { data: items, error } = await supabaseAdmin
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
        items: (items ?? []).map((it: any) => ({
            id: it.id,
            quantity: it.quantity,
            unitPrice: Number(it.unit_price),
            product: {
                id: it.product?.id,
                name: it.product?.name,
                price: Number(it.product?.price || 0),
                stock: Number(it.product?.stock || 0),
            },
        })),
        subtotal,
    };
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const cart = await getCart(userId);
        return NextResponse.json(cart);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, productId, quantity, action, items } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        if (action === 'merge' && items) {
            // Handle guest cart merge
            for (const item of items) {
                try {
                    const cart = await getOrCreateActiveCart(userId);
                    const { data: product } = await supabaseAdmin.from('products').select('price').eq('id', item.productId).single();
                    if (product) {
                        // Simple upsert logic
                        const { data: existing } = await supabaseAdmin.from('cart_items').select('id, quantity').eq('cart_id', cart.id).eq('product_id', item.productId).maybeSingle();
                        if (existing) {
                            await supabaseAdmin.from('cart_items').update({ quantity: existing.quantity + item.quantity }).eq('id', existing.id);
                        } else {
                            await supabaseAdmin.from('cart_items').insert({
                                cart_id: cart.id,
                                product_id: item.productId,
                                quantity: item.quantity,
                                unit_price: product.price
                            });
                        }
                    }
                } catch (e) {
                    console.error('Merge error:', e);
                }
            }
            return NextResponse.json(await getCart(userId));
        }

        // Default: Add to cart
        if (!productId || !quantity) {
            return NextResponse.json({ error: 'Product ID and quantity are required' }, { status: 400 });
        }

        const cart = await getOrCreateActiveCart(userId);
        const { data: product } = await supabaseAdmin.from('products').select('price, stock').eq('id', productId).single();

        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        const { data: existing } = await supabaseAdmin
            .from('cart_items')
            .select('id, quantity')
            .eq('cart_id', cart.id)
            .eq('product_id', productId)
            .maybeSingle();

        if (existing) {
            await supabaseAdmin.from('cart_items').update({ quantity: existing.quantity + quantity }).eq('id', existing.id);
        } else {
            await supabaseAdmin.from('cart_items').insert({
                cart_id: cart.id,
                product_id: productId,
                quantity,
                unit_price: product.price
            });
        }

        return NextResponse.json(await getCart(userId));
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const isAdmin = searchParams.get('admin') === 'true';

    let query = supabase.from('products').select('*, category:categories(name)');

    if (categoryId) query = query.eq('category_id', categoryId);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, error, count } = await query
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const formatted = (data || []).map(p => ({
        ...p,
        outOfStock: p.stock <= 0,
        isLowStock: p.stock > 0 && p.stock < 10,
        categoryName: p.category?.name || 'N/A'
    }));

    return NextResponse.json({ products: formatted, total: count });
}

export async function POST(request: NextRequest) {
    // Simple check for service role based operations might need actual auth in a real app
    // For now, we port the logic. Admin auth should be handled via middleware or sessions.
    try {
        const body = await request.json();

        // In a unified Next.js app, we typically use the admin client for POST if bypassing RLS
        // but here we follow the basic structure.
        const { data, error } = await supabase
            .from('products')
            .insert([body])
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

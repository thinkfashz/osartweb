import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

    if (category) {
        query = query.eq('category_id', category);
    }

    if (search) {
        query = query.ilike('name', `%${search}%`);
    }

    const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        products: data,
        total: count
    });
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

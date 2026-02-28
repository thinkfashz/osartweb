import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

// GET — list all categories with product count
export async function GET() {
    const { data, error } = await supabase
        .from('categories')
        .select('*, products(count)')
        .order('name');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const formatted = (data || []).map((c: any) => ({
        ...c,
        productCount: c.products?.[0]?.count ?? 0,
    }));

    return NextResponse.json(formatted);
}

// POST — create a new category
export async function POST(request: NextRequest) {
    if (!supabaseAdmin) return NextResponse.json({ error: 'Admin client not configured' }, { status: 501 });
    try {
        const body = await request.json();
        const { name, description, image_url, parent_id } = body;

        if (!name?.trim()) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });

        // Auto-generate slug from name
        const slug = name.trim().toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // remove accents
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');

        const { data, error } = await supabaseAdmin
            .from('categories')
            .insert([{ name: name.trim(), slug, description: description || null, image_url: image_url || null, parent_id: parent_id || null }])
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json(data, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

// PATCH — update a category
export async function PATCH(request: NextRequest) {
    if (!supabaseAdmin) return NextResponse.json({ error: 'Admin client not configured' }, { status: 501 });
    try {
        const body = await request.json();
        const { id, name, description, image_url, parent_id } = body;

        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

        const updates: any = {};
        if (name !== undefined) {
            updates.name = name.trim();
            updates.slug = name.trim().toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-');
        }
        if (description !== undefined) updates.description = description || null;
        if (image_url !== undefined) updates.image_url = image_url || null;
        if (parent_id !== undefined) updates.parent_id = parent_id || null;

        const { data, error } = await supabaseAdmin
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

// DELETE — delete a category by id
export async function DELETE(request: NextRequest) {
    if (!supabaseAdmin) return NextResponse.json({ error: 'Admin client not configured' }, { status: 501 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
}

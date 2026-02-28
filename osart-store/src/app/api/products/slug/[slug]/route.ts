import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    // Fetch product with joined category and images
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*),
            images:product_images(*),
            variants:product_variants(*)
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Format to match the frontend expectations
    const formatted = {
        ...data,
        images: (data.images || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0)),
        variants: data.variants || [],
        categoryName: data.category?.name || 'N/A'
    };

    return NextResponse.json(formatted);
}

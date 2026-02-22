import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const { data: tables, error } = await supabaseAdmin.rpc('get_table_counts');

        // Fallback if RPC doesn't exist (query information_schema)
        let tableData = tables;
        if (error) {
            // Manual count for key tables if RPC fails
            const tablesToCount = ['products', 'orders', 'profiles', 'order_items', 'cart_items'];
            tableData = await Promise.all(tablesToCount.map(async (name) => {
                const { count } = await supabaseAdmin.from(name).select('*', { count: 'exact', head: true });
                return { name, rowCount: count || 0, lastUpdate: new Date().toISOString() };
            }));
        }

        return NextResponse.json({
            connected: true,
            databaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            version: 'PostgreSQL (Supabase)',
            tables: tableData
        });
    } catch (error: any) {
        return NextResponse.json({ connected: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { action } = await request.json();

    if (action === 'seed') {
        // Ported from NestJS Seed Service logic
        try {
            // 1. Create categories
            const categories = [
                { name: 'Hardware', slug: 'hardware' },
                { name: 'Apparel', slug: 'apparel' },
                { name: 'Navigation', slug: 'navigation' }
            ];
            await supabaseAdmin.from('categories').upsert(categories, { onConflict: 'slug' });

            // 2. Create products
            const products = [
                { name: 'OSART Alpha-1', slug: 'alpha-1', price: 1200, description: 'High precision industrial sensor', stock: 50 },
                { name: 'OSART Tactical Hoodie', slug: 'tactical-hoodie', price: 85, description: 'Premium technical apparel', stock: 100 }
            ];
            await supabaseAdmin.from('products').upsert(products, { onConflict: 'slug' });

            return NextResponse.json({ message: 'Seeding successful' });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

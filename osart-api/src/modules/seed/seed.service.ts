import { Injectable } from '@nestjs/common';
import { makeSupabaseService } from '../../config/supabase.client';

@Injectable()
export class SeedService {
    private admin = makeSupabaseService();

    async seedDemoData() {
        console.log('Starting seed process...');

        // 1. Seed Categories (if empty)
        const { data: existingCats } = await this.admin.from('categories').select('id').limit(1);
        if (!existingCats || existingCats.length === 0) {
            await this.admin.from('categories').insert([
                { name: 'Pantallas', slug: 'pantallas' },
                { name: 'Sensores', slug: 'sensores' },
                { name: 'Cableado', slug: 'cableado' },
            ]);
        }
        const { data: cats } = await this.admin.from('categories').select('id');
        const catId = cats?.[0]?.id;

        // 2. Seed Products (20)
        const products = [];
        for (let i = 1; i <= 20; i++) {
            products.push({
                name: `Producto Demo ${i}`,
                slug: `producto-demo-${i}`,
                price: Math.floor(Math.random() * 500000) + 10000,
                stock: Math.floor(Math.random() * 50),
                sku: `SKU-${Date.now()}-${i}`,
                brand: 'Osart Pro',
                model: 'X-2026',
                is_active: true,
                is_featured: i <= 5,
                category_id: catId,
                description: 'Descripción de alta precisión para hardware crítico.'
            });
        }
        const { data: seededProducts, error: pErr } = await this.admin.from('products').upsert(products, { onConflict: 'slug' }).select();
        if (pErr) console.error('Product seed error:', pErr);

        // 3. Seed Profiles (50)
        const profiles = [];
        for (let i = 1; i <= 50; i++) {
            profiles.push({
                id: crypto.randomUUID(), // Mock IDs
                full_name: `Cliente Demo ${i}`,
                email: `cliente${i}@osart.demo`,
                phone: `+569${Math.floor(Math.random() * 100000000)}`,
            });
        }
        // Note: Actual profiles usually tied to auth, but for demo analytics this works if orders reference them
        const { data: seededProfiles, error: prErr } = await this.admin.from('profiles').upsert(profiles, { onConflict: 'id' }).select();
        if (prErr) console.error('Profile seed error:', prErr);

        // 4. Seed Orders (200) - Spread over last 30 days
        if (seededProfiles && seededProducts) {
            console.log('Seeding orders and items...');
            const now = new Date();
            for (let i = 1; i <= 200; i++) {
                const profile = seededProfiles[Math.floor(Math.random() * seededProfiles.length)];
                const orderDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);

                // Random items for this order
                const numItems = Math.floor(Math.random() * 3) + 1;
                const orderItems = [];
                let subtotal = 0;

                for (let j = 0; j < numItems; j++) {
                    const product = seededProducts[Math.floor(Math.random() * seededProducts.length)];
                    const quantity = Math.floor(Math.random() * 3) + 1;
                    const price = Number(product.price);
                    subtotal += price * quantity;

                    orderItems.push({
                        product_id: product.id,
                        quantity,
                        unit_price: price
                    });
                }

                const { data: order, error: oErr } = await this.admin.from('orders').insert({
                    user_id: profile.id,
                    subtotal,
                    shipping: 5000,
                    total: subtotal + 5000,
                    status: 'completed',
                    payment_status: 'paid',
                    created_at: orderDate.toISOString(),
                }).select().single();

                if (oErr) {
                    console.error('Order seed error:', oErr);
                    continue;
                }

                if (order) {
                    const finalItems = orderItems.map(item => ({ ...item, order_id: order.id }));
                    const { error: iErr } = await this.admin.from('order_items').insert(finalItems);
                    if (iErr) console.error('Order items seed error:', iErr);
                }
            }
        }

        return { success: true, message: 'Demo data seeded successfully (20 products, 50 customers, 200 orders + items)' };
    }
}

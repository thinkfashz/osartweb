const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bplifywjbhtwzcplxksg.supabase.co';
// Using the service role key from the API .env for full RLS bypass
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbGlmeXdqYmh0d3pjcGx4a3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NzI0MDIsImV4cCI6MjA4NTE0ODQwMn0.iY7VkufS9XCE9Zwc71HGpnyArxo5mRZ13FQLxH45H5c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🚀 Starting SaaS Data Seeding...');

    // 1. Categories
    const categories = [
        { name: 'Electrónica', slug: 'electronica' },
        { name: 'Hogar', slug: 'hogar' },
        { name: 'Ropa', slug: 'ropa' }
    ];

    const { data: catData, error: catError } = await supabase
        .from('categories')
        .upsert(categories, { onConflict: 'slug' })
        .select();

    if (catError) {
        console.error('❌ Error seeding categories:', catError);
        return;
    }

    const catMap = {};
    catData.forEach(c => catMap[c.slug] = c.id);

    // 2. Products
    const products = [
        // Electronica
        {
            name: 'Laptop Pro X',
            slug: 'laptop-pro-x',
            description: 'Potencia industrial para desarrollo y diseño.',
            price: 1500000,
            stock: 12,
            category_id: catMap['electronica'],
            is_active: true,
            sku: 'SAAS-ELC-LPX'
        },
        {
            name: 'Smartphone Nova 15',
            slug: 'smartphone-nova-15',
            description: 'Conectividad absoluta y cámara de alta resolución.',
            price: 850000,
            stock: 25,
            category_id: catMap['electronica'],
            is_active: true,
            sku: 'SAAS-ELC-N15'
        },
        {
            name: 'Auriculares AirSound',
            slug: 'auriculares-airsound',
            description: 'Cancelación de ruido activa y sonido cristalino.',
            price: 120000,
            stock: 40,
            category_id: catMap['electronica'],
            is_active: true,
            sku: 'SAAS-ELC-ASR'
        },
        // Hogar
        {
            name: 'Aspiradora SmartClean',
            slug: 'aspiradora-smartclean',
            description: 'Limpieza automática inteligente con mapeo láser.',
            price: 350000,
            stock: 15,
            category_id: catMap['hogar'],
            is_active: true,
            sku: 'SAAS-HOG-SMC'
        },
        {
            name: 'Lámpara LED Minimal',
            slug: 'lampara-led-minimal',
            description: 'Iluminación regulable con diseño nórdico.',
            price: 45000,
            stock: 60,
            category_id: catMap['hogar'],
            is_active: true,
            sku: 'SAAS-HOG-LLM'
        },
        {
            name: 'Silla Ergonómica Pro',
            slug: 'silla-ergonomica-pro',
            description: 'Máximo confort para largas jornadas de trabajo.',
            price: 280000,
            stock: 10,
            category_id: catMap['hogar'],
            is_active: true,
            sku: 'SAAS-HOG-SEP'
        },
        // Ropa
        {
            name: 'Camiseta Premium',
            slug: 'camiseta-premium',
            description: 'Algodón orgánico de alta calidad.',
            price: 25000,
            stock: 100,
            category_id: catMap['ropa'],
            is_active: true,
            sku: 'SAAS-ROP-CMP'
        },
        {
            name: 'Zapatillas Urban Run',
            slug: 'zapatillas-urban-run',
            description: 'Diseño moderno y comodidad para la ciudad.',
            price: 75000,
            stock: 45,
            category_id: catMap['ropa'],
            is_active: true,
            sku: 'SAAS-ROP-ZUR'
        },
        {
            name: 'Chaqueta Outdoor Max',
            slug: 'chaqueta-outdoor-max',
            description: 'Impermeable y térmica para condiciones extremas.',
            price: 150000,
            stock: 20,
            category_id: catMap['ropa'],
            is_active: true,
            sku: 'SAAS-ROP-COM'
        }
    ];

    const { error: prodError } = await supabase
        .from('products')
        .upsert(products, { onConflict: 'slug' });

    if (prodError) {
        console.error('❌ Error seeding products:', prodError);
        return;
    }
    console.log('✅ SaaS Products and Categories seeded successfully!');
}

seed();

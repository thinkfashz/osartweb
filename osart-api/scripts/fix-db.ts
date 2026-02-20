import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDb() {
    console.log('Applying Database Fixes...');

    const sql = `
    -- Carts
    create table if not exists public.carts (
        id uuid default uuid_generate_v4() primary key,
        user_id uuid references public.profiles(id) on delete cascade,
        status text default 'active' check (status in ('active', 'checked_out', 'abandoned')),
        created_at timestamptz default now()
    );

    -- Cart Items
    create table if not exists public.cart_items (
        id uuid default uuid_generate_v4() primary key,
        cart_id uuid references public.carts(id) on delete cascade,
        product_id uuid references public.products(id) on delete cascade,
        quantity int not null check (quantity > 0),
        unit_price numeric not null,
        created_at timestamptz default now()
    );

    -- Wishlists
    create table if not exists public.wishlists (
        id uuid default uuid_generate_v4() primary key,
        user_id uuid references public.profiles(id) on delete cascade,
        product_id uuid references public.products(id) on delete cascade,
        created_at timestamptz default now(),
        unique(user_id, product_id)
    );

    -- Enable RLS
    alter table public.carts enable row level security;
    alter table public.cart_items enable row level security;
    alter table public.wishlists enable row level security;

    -- Profiles RLS (Basic)
    create or replace function public.role() returns text as $$
      select role from public.profiles where id = auth.uid();
    $$ language sql stable;

    -- Drop existing policies to avoid conflicts
    drop policy if exists "Carts: view own or admin" on public.carts;
    drop policy if exists "Carts: create own" on public.carts;
    drop policy if exists "Carts: update own or admin" on public.carts;
    drop policy if exists "Items: view own or admin" on public.cart_items;
    drop policy if exists "Items: insert own or admin" on public.cart_items;
    drop policy if exists "Items: update own or admin" on public.cart_items;
    drop policy if exists "Items: delete own or admin" on public.cart_items;
    drop policy if exists "Wishlist: view own" on public.wishlists;
    drop policy if exists "Wishlist: toggle own" on public.wishlists;

    -- Create Policies
    create policy "Carts: view own or admin" on public.carts for select using (user_id = auth.uid() or public.role() = 'admin');
    create policy "Carts: create own" on public.carts for insert with check (user_id = auth.uid() or public.role() = 'admin');
    create policy "Carts: update own or admin" on public.carts for update using (user_id = auth.uid() or public.role() = 'admin');

    create policy "Items: view own or admin" on public.cart_items for select using (exists (select 1 from public.carts c where c.id = cart_items.cart_id and (c.user_id = auth.uid() or public.role() = 'admin')));
    create policy "Items: insert own or admin" on public.cart_items for insert with check (exists (select 1 from public.carts c where c.id = cart_items.cart_id and (c.user_id = auth.uid() or public.role() = 'admin')));
    create policy "Items: update own or admin" on public.cart_items for update using (exists (select 1 from public.carts c where c.id = cart_items.cart_id and (c.user_id = auth.uid() or public.role() = 'admin')));
    create policy "Items: delete own or admin" on public.cart_items for delete using (exists (select 1 from public.carts c where c.id = cart_items.cart_id and (c.user_id = auth.uid() or public.role() = 'admin')));

    create policy "Wishlist: view own" on public.wishlists for select using (user_id = auth.uid());
    create policy "Wishlist: toggle own" on public.wishlists for all using (user_id = auth.uid());

    -- Reload Schema Cache (PostgREST)
    NOTIFY pgrst, 'reload schema';

    -- 1. Tablas de Cupones
    create table if not exists public.coupons (
        id uuid default gen_random_uuid() primary key,
        code text unique not null,
        type text not null check (type in ('percent', 'fixed')),
        value numeric not null,
        min_total numeric default 0,
        active boolean default true,
        start_date timestamptz default now(),
        end_date timestamptz,
        created_at timestamptz default now()
    );

    -- 2. Tablas de Pagos
    create table if not exists public.payments (
        id uuid default gen_random_uuid() primary key,
        order_id uuid references public.orders(id) on delete cascade,
        provider text not null,
        status text not null check (status in ('pending', 'success', 'failed')),
        external_id text,
        amount numeric not null,
        created_at timestamptz default now()
    );

    -- 3. Actualizar tabla Orders para soportar cupones
    do $$ 
    begin 
        if not exists (select 1 from INFORMATION_SCHEMA.COLUMNS where table_name='orders' and column_name='coupon_id') then
            alter table public.orders add column coupon_id uuid references public.coupons(id);
            alter table public.orders add column discount_amount numeric default 0;
            alter table public.orders add column shipping_address jsonb;
        end if;
    end $$;

    -- 4. RPC Atómico: create_order_from_cart_v2
    create or replace function create_order_from_cart_v2(
        p_user_id uuid, 
        p_shipping_address jsonb, 
        p_coupon_code text default null
    ) returns uuid language plpgsql security definer as $$
    declare 
        v_cart_id uuid;
        v_order_id uuid;
        v_subtotal numeric := 0;
        v_discount numeric := 0;
        v_coupon_id uuid;
        v_total numeric := 0;
        v_item record;
    begin
        -- 1. Obtener carrito activo
        select id into v_cart_id from public.carts 
        where user_id = p_user_id and status = 'active' 
        limit 1;
        
        if v_cart_id is null then raise exception 'No active cart found'; end if;

        -- 2. Calcular subtotal y validar stock (bloqueo de filas)
        for v_item in (
            select ci.product_id, ci.quantity, p.price, p.stock, p.name
            from public.cart_items ci
            join public.products p on p.id = ci.product_id
            where ci.cart_id = v_cart_id
            for update of p
        ) loop
            if v_item.stock < v_item.quantity then
                raise exception 'Insufficient stock for product: %', v_item.name;
            end if;
            v_subtotal := v_subtotal + (v_item.price * v_item.quantity);
        end loop;

        if v_subtotal = 0 then raise exception 'Cart is empty'; end if;

        -- 3. Validar Cupón si aplica
        if p_coupon_code is not null then
            select id, type, value, min_total into v_coupon_id, v_item.type, v_item.value, v_item.min_total
            from public.coupons 
            where code = p_coupon_code and active = true 
            and (start_date <= now() and (end_date is null or end_date >= now()));
            
            if v_coupon_id is not null then
                if v_subtotal >= v_item.min_total then
                    if v_item.type = 'percent' then
                        v_discount := v_subtotal * (v_item.value / 100);
                    else
                        v_discount := v_item.value;
                    end if;
                end if;
            end if;
        end if;

        v_total := v_subtotal - v_discount;

        -- 4. Crear la Orden
        insert into public.orders (
            user_id, 
            status, 
            payment_status, 
            subtotal, 
            total, 
            discount_amount, 
            coupon_id, 
            shipping_address
        ) values (
            p_user_id, 
            'pending', 
            'unpaid', 
            v_subtotal, 
            v_total, 
            v_discount, 
            v_coupon_id, 
            p_shipping_address
        ) returning id into v_order_id;

        -- 5. Mover items y descontar stock
        insert into public.order_items (order_id, product_id, quantity, unit_price)
        select v_order_id, product_id, quantity, unit_price
        from public.cart_items
        where cart_id = v_cart_id;

        update public.products p
        set stock = p.stock - ci.quantity
        from public.cart_items ci
        where ci.cart_id = v_cart_id and p.id = ci.product_id;

        -- 6. Finalizar carrito
        update public.carts set status = 'checked_out' where id = v_cart_id;

        return v_order_id;
    end;
    $$;

    -- 5. RLS
    alter table public.coupons enable row level security;
    alter table public.payments enable row level security;

    create policy "Coupons: public view active" on public.coupons for select using (active = true);
    create policy "Payments: view own" on public.payments for select using (
        exists (select 1 from public.orders o where o.id = payments.order_id and o.user_id = auth.uid())
    );
  `;

    // Supabase JS doesn't have a direct "execute SQL" method for DDL in the client
    // but we can use RPC if we have one, or use a fetch directly to the PostgREST /rpc/
    // However, the best way here is to use the RPC if it exists, or typically we'd use a postgres driver.
    // Since I don't want to install extra deps, I'll try to use the MCP one last time or assume the user can run this.

    // Wait, I can use 'run_command' to run 'psql' if installed, but probably not.
    // I'll try to use a fetch to the Supabase SQL API if possible.

    console.log('Script created. Please run this SQL in your Supabase Dashboard SQL Editor.');
    console.log(sql);
}

fixDb();

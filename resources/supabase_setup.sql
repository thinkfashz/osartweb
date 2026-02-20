-- OSART REPUESTOS ELECTRÓNICOS - DATABASE SETUP
-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
-- 2. TABLES
-- Profiles
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    phone text,
    role text default 'customer' check (role in ('customer', 'admin')),
    created_at timestamptz default now()
);
-- Categories
create table if not exists public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text unique not null,
    created_at timestamptz default now()
);
-- Products
create table if not exists public.products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text unique not null,
    description text,
    brand text,
    model text,
    category_id uuid references public.categories(id),
    price numeric not null,
    compare_at_price numeric,
    stock int default 0,
    sku text unique,
    is_active boolean default true,
    created_at timestamptz default now()
);
-- Product Images
create table if not exists public.product_images (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid references public.products(id) on delete cascade,
    url text not null,
    position int default 0,
    created_at timestamptz default now()
);
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
-- Orders
create table if not exists public.orders (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id),
    status text default 'pending' check (
        status in (
            'pending',
            'paid',
            'shipped',
            'delivered',
            'cancelled'
        )
    ),
    payment_status text default 'unpaid' check (payment_status in ('unpaid', 'paid', 'failed')),
    subtotal numeric not null,
    shipping numeric default 0,
    total numeric not null,
    shipping_address jsonb not null,
    created_at timestamptz default now()
);
-- Order Items
create table if not exists public.order_items (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders(id) on delete cascade,
    product_id uuid references public.products(id),
    quantity int not null,
    unit_price numeric not null,
    created_at timestamptz default now()
);
-- 3. FUNCTIONS & TRIGGERS
-- Create profile on signup
create or replace function public.handle_new_user() returns trigger as $$ begin
insert into public.profiles (id, full_name, role)
values (
        new.id,
        new.raw_user_meta_data->>'full_name',
        'customer'
    );
return new;
end;
$$ language plpgsql security definer;
create or replace trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();
-- Helper: is_admin
create or replace function public.is_admin() returns boolean language sql stable as $$
select exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
            and p.role = 'admin'
    );
$$;
-- RPC: create_order_from_cart
create or replace function create_order_from_cart(p_user_id uuid, p_shipping jsonb) returns uuid language plpgsql as $$
declare v_cart_id uuid;
v_order_id uuid;
v_subtotal numeric := 0;
v_shipping numeric := 0;
v_total numeric := 0;
begin
select id into v_cart_id
from carts
where user_id = p_user_id
    and status = 'active'
limit 1;
if v_cart_id is null then raise exception 'No active cart';
end if;
select coalesce(sum(ci.unit_price * ci.quantity), 0) into v_subtotal
from cart_items ci
where ci.cart_id = v_cart_id;
if v_subtotal = 0 then raise exception 'Cart is empty';
end if;
if exists (
    select 1
    from cart_items ci
        join products p on p.id = ci.product_id
    where ci.cart_id = v_cart_id
        and p.stock < ci.quantity
) then raise exception 'Insufficient stock';
end if;
update products p
set stock = p.stock - ci.quantity
from cart_items ci
where ci.cart_id = v_cart_id
    and p.id = ci.product_id;
v_shipping := 0;
v_total := v_subtotal + v_shipping;
insert into orders(
        user_id,
        status,
        payment_status,
        subtotal,
        shipping,
        total,
        shipping_address
    )
values (
        p_user_id,
        'pending',
        'unpaid',
        v_subtotal,
        v_shipping,
        v_total,
        p_shipping
    )
returning id into v_order_id;
insert into order_items(order_id, product_id, quantity, unit_price)
select v_order_id,
    ci.product_id,
    ci.quantity,
    ci.unit_price
from cart_items ci
where ci.cart_id = v_cart_id;
update carts
set status = 'checked_out'
where id = v_cart_id;
return v_order_id;
end;
$$;
-- 4. RLS POLICIES
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
-- Profiles: own or admin
create policy "Profiles: view own or admin" on public.profiles for
select using (
        id = auth.uid()
        or public.is_admin()
    );
create policy "Profiles: update own or admin" on public.profiles for
update using (
        id = auth.uid()
        or public.is_admin()
    );
-- Categories: public read, admin write
create policy "Categories: public read" on public.categories for
select using (true);
create policy "Categories: admin write" on public.categories for all using (public.is_admin());
-- Products: public read, admin write
create policy "Products: public read" on public.products for
select using (true);
create policy "Products: admin write" on public.products for all using (public.is_admin());
-- Product Images: public read, admin write
create policy "Images: public read" on public.product_images for
select using (true);
create policy "Images: admin write" on public.product_images for all using (public.is_admin());
-- Carts: own or admin
create policy "Carts: view own or admin" on public.carts for
select using (
        user_id = auth.uid()
        or public.is_admin()
    );
create policy "Carts: create own" on public.carts for
insert with check (
        user_id = auth.uid()
        or public.is_admin()
    );
create policy "Carts: update own or admin" on public.carts for
update using (
        user_id = auth.uid()
        or public.is_admin()
    );
-- Cart Items: own (via cart) or admin
create policy "Items: view own or admin" on public.cart_items for
select using (
        public.is_admin()
        or exists (
            select 1
            from public.carts c
            where c.id = cart_items.cart_id
                and c.user_id = auth.uid()
        )
    );
create policy "Items: insert own or admin" on public.cart_items for
insert with check (
        public.is_admin()
        or exists (
            select 1
            from public.carts c
            where c.id = cart_items.cart_id
                and c.user_id = auth.uid()
        )
    );
create policy "Items: update own or admin" on public.cart_items for
update using (
        public.is_admin()
        or exists (
            select 1
            from public.carts c
            where c.id = cart_items.cart_id
                and c.user_id = auth.uid()
        )
    );
create policy "Items: delete own or admin" on public.cart_items for delete using (
    public.is_admin()
    or exists (
        select 1
        from public.carts c
        where c.id = cart_items.cart_id
            and c.user_id = auth.uid()
    )
);
-- Orders: own or admin
create policy "Orders: view own or admin" on public.orders for
select using (
        user_id = auth.uid()
        or public.is_admin()
    );
create policy "Orders: insert own or admin" on public.orders for
insert with check (
        user_id = auth.uid()
        or public.is_admin()
    );
create policy "Orders: admin update" on public.orders for
update using (public.is_admin());
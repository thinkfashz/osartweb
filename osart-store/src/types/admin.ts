export type NavKey =
    | "overview"
    | "products"
    | "orders"
    | "customers"
    | "inventory"
    | "analytics"
    | "backend"
    | "academy"
    | "scripts"
    | "settings";

export interface AdminCategory {
    id: string;
    name: string;
    slug?: string;
    description?: string | null;
    image_url?: string | null;
    parent_id?: string | null;
    productCount?: number;
    created_at?: string;
}

export interface AdminProduct {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    price?: number;
    stock: number;
    category?: AdminCategory;
    category_id?: string;
    image_url?: string;
    is_active?: boolean;
    metadata?: Record<string, any>;
    images?: { id?: string; url: string; position?: number }[];
    sku: string;
    outOfStock?: boolean;
    isLowStock?: boolean;
}
export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    product?: AdminProduct;
}

export interface Order {
    id: string;
    user_id: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    total: number;
    subtotal: number;
    shipping: number;
    shipping_address?: string;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
    customerName?: string;
    customerEmail?: string;
}

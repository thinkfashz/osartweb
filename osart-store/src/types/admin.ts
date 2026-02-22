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
}

export interface AdminProduct {
    id: string;
    name: string;
    description?: string;
    price?: number;
    stock: number;
    category?: AdminCategory;
    category_id?: string;
    image_url?: string;
    is_active?: boolean;
    metadata?: Record<string, any>;
    sku: string;
    outOfStock?: boolean;
    isLowStock?: boolean;
}

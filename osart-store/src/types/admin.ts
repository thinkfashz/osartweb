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

export interface AdminProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category?: any;
    category_id?: string;
    image_url?: string;
    is_active?: boolean;
    metadata?: any;
    sku?: string;
}

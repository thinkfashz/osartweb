export interface ProductImage {
    id: string;
    url: string;
    position: number;
}

export interface ProductVariant {
    id: string;
    name: string;
    value: string;
    price?: number | null;
    stock?: number | null;
}

export type ProductSpecs = Record<string, any>;

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    sku: string;
    brand: string;
    model: string;
    isActive: boolean;
    images: ProductImage[];
    variants: ProductVariant[];
    specs: ProductSpecs;
    category?: string | {
        name: string;
    };
    categoryData?: {
        name: string;
        slug: string;
    };
}

export interface CartItem {
    id: string;
    quantity: number;
    unitPrice: number;
    product: Product;
}

export interface Cart {
    id: string;
    items: CartItem[];
    subtotal: number;
}

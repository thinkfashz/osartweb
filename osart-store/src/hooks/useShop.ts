import { useState, useEffect } from 'react';
import { AdminProduct, AdminCategory } from '@/types/admin';

const MOCK_OFFLINE_PRODUCTS: AdminProduct[] = [
  {
    id: 'mock-1',
    name: 'Taladro Percutor Industrial (OFFLINE MOCK)',
    slug: 'taladro-percutor',
    description: 'Taladro de alta potencia para trabajo pesado. Versión cacheada.',
    brand: 'OSART Tools',
    model: 'TP-500',
    price: 125000,
    sku: 'MOT-001',
    stock: 5,
    isLowStock: true,
    outOfStock: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    images: [{ id: 'mock1', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800', position: 0 }],
    variants: []
  },
  {
    id: 'mock-2',
    name: 'Generador Eléctrico 5000W (OFFLINE MOCK)',
    slug: 'generador-5000w',
    description: 'Generador a gasolina de alta capacidad. Versión cacheada.',
    brand: 'PowerSys',
    model: 'GX-5000',
    price: 850000,
    sku: 'MOT-002',
    stock: 2,
    isLowStock: true,
    outOfStock: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    images: [{ id: 'mock2', url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800', position: 0 }],
    variants: []
  }
] as unknown as AdminProduct[];

export const useProducts = (filter?: { name?: string; categoryId?: string }) => {
  const [data, setData] = useState<{ products: AdminProduct[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter?.name) params.append('search', filter.name);
        if (filter?.categoryId) params.append('category', filter.categoryId);

        // Append timestamp to bypass SW cache if online and forcing fresh fetch (optional)
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');

        const json = await res.json();

        // Format for UI compatibility (ProductCard expects images array)
        const formatted = (json.products || []).map((p: any) => {
          // Flatten images from multiple sources if they exist
          const images = [
            ...(p.image_url ? [{ url: p.image_url, position: 0 }] : []),
            ...(p.product_images || [])
          ].sort((a, b) => (a.position || 0) - (b.position || 0));

          return {
            ...p,
            images: images.length > 0 ? images : []
          } as AdminProduct & { images: any[] };
        });

        const formattedProducts = formatted as AdminProduct[];

        // Cache to local storage for offline use
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('osart_offline_products', JSON.stringify(formattedProducts));
          }
        } catch (e) {
          console.warn('Could not save to local storage', e);
        }

        setData({ products: formattedProducts });
        setError(null);
      } catch (err: any) {
        console.error('Error fetching products from network, attempting offline fallback:', err);

        // Fallback Strategy
        let offlineProducts = null;
        try {
          if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('osart_offline_products');
            if (cached) {
              offlineProducts = JSON.parse(cached);
              console.log('Serving products from LocalStorage cache');
            }
          }
        } catch (e) {
          console.warn('Failed to parse cached products', e);
        }

        if (offlineProducts && offlineProducts.length > 0) {
          setData({ products: offlineProducts });
          // Don't set error if we successfully served stale/cached cache to prevent UI breaking
        } else {
          console.log('No cache found. Serving mock offline products.');
          setData({ products: MOCK_OFFLINE_PRODUCTS });
        }

        // We still log the error for debugging, but don't strictly show it if we have fallback data
        if (!offlineProducts && (!MOCK_OFFLINE_PRODUCTS || MOCK_OFFLINE_PRODUCTS.length === 0)) {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter?.name, filter?.categoryId]);

  return { data, loading, error };
};

export const useCategories = () => {
  const [data, setData] = useState<{ categories: AdminCategory[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');

        const json = await res.json();
        setData({ categories: (json || []) as AdminCategory[] });
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { data, loading, error };
};

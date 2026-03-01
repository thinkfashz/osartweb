import { useState, useEffect } from 'react';
import { AdminProduct, AdminCategory } from '@/types/admin';
import { getCache, setCache } from '@/lib/storage';

const MOCK_OFFLINE_PRODUCTS: AdminProduct[] = [
  // ... mock data remains in case IDB is empty and network fails entirely
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
  }
] as unknown as AdminProduct[];

const CACHE_KEY_PRODUCTS = 'osart_products_cache';
const CACHE_KEY_CATEGORIES = 'osart_categories_cache';

export const useProducts = (filter?: { name?: string; categoryId?: string }) => {
  const [data, setData] = useState<{ products: AdminProduct[] } | null>(null);
  const [loading, setLoading] = useState(true);          // Initial load
  const [isValidating, setIsValidating] = useState(false); // Background revalidation
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<'loading' | 'cache' | 'network' | 'mock'>('loading');

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      // 1. STALE: Try to fetch from IndexedDB first for instant UI
      try {
        const cachedProducts = await getCache<AdminProduct[]>(CACHE_KEY_PRODUCTS);
        // If we have filters, apply them locally to the cached data to keep it snappy
        if (cachedProducts && cachedProducts.length > 0 && isMounted) {
          let filtered = cachedProducts;
          if (filter?.name) {
            const searchLower = filter.name.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchLower) || p.sku?.toLowerCase().includes(searchLower));
          }
          if (filter?.categoryId) {
            filtered = filtered.filter(p => p.category?.id === filter.categoryId);
          }
          setData({ products: filtered });
          setDataSource('cache');
          setLoading(false); // UI renders instantly
        }
      } catch (err) {
        console.warn('Failed to read from IDB cache', err);
      }

      // 2. REVALIDATE: Fetch fresh data from network in the background
      setIsValidating(true);
      if (!data) setLoading(true); // Only show strict loading if no cache was found

      try {
        const params = new URLSearchParams();
        if (filter?.name) params.append('search', filter.name);
        if (filter?.categoryId) params.append('category', filter.categoryId);

        // Append timestamp to bypass caching layers if necessary, though fetch handles it well
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');

        const json = await res.json();
        const formatted = (json.products || []).map((p: any) => {
          const images = [
            ...(p.image_url ? [{ url: p.image_url, position: 0 }] : []),
            ...(p.product_images || [])
          ].sort((a, b) => (a.position || 0) - (b.position || 0));

          return { ...p, images: images.length > 0 ? images : [] } as AdminProduct & { images: any[] };
        });

        if (!isMounted) return;

        // 3. Update State & Cache with fresh data
        setData({ products: formatted });
        setDataSource('network');
        setError(null);
        await setCache(CACHE_KEY_PRODUCTS, formatted);

      } catch (err: any) {
        console.error('Network fetch failed:', err);
        if (!isMounted) return;

        // If network failed and we had NO cache, fallback to mock
        if (!data) {
          setData({ products: MOCK_OFFLINE_PRODUCTS });
          setDataSource('mock');
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsValidating(false);
        }
      }
    };

    fetchProducts();

    return () => { isMounted = false; };
  }, [filter?.name, filter?.categoryId]);

  // Provide a mutate function to manually re-trigger the network fetch
  const mutate = async () => {
    setIsValidating(true);
    try {
      const params = new URLSearchParams();
      if (filter?.name) params.append('search', filter.name);
      if (filter?.categoryId) params.append('category', filter.categoryId);
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const json = await res.json();
      const formatted = (json.products || []).map((p: any) => {
        const images = [...(p.image_url ? [{ url: p.image_url, position: 0 }] : []), ...(p.product_images || [])].sort((a, b) => (a.position || 0) - (b.position || 0));
        return { ...p, images: images.length > 0 ? images : [] } as AdminProduct & { images: any[] };
      });
      setData({ products: formatted });
      setDataSource('network');
      setError(null);
      await setCache(CACHE_KEY_PRODUCTS, formatted);
    } catch (err: any) {
      console.error('Manual validation failed', err);
    } finally {
      setIsValidating(false);
    }
  };

  return { data, loading, isValidating, error, dataSource, mutate };
};

export const useCategories = () => {
  const [data, setData] = useState<{ categories: AdminCategory[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<'loading' | 'cache' | 'network' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      // 1. Stale
      try {
        const cached = await getCache<AdminCategory[]>(CACHE_KEY_CATEGORIES);
        if (cached && cached.length > 0 && isMounted) {
          setData({ categories: cached });
          setDataSource('cache');
          setLoading(false);
        }
      } catch (e) { }

      // 2. Revalidate
      setIsValidating(true);
      if (!data) setLoading(true);

      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');

        const json = await res.json();
        if (!isMounted) return;

        setData({ categories: (json || []) });
        setDataSource('network');
        setError(null);
        await setCache(CACHE_KEY_CATEGORIES, json || []);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        if (!isMounted) return;
        if (!data) {
          setDataSource('error');
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsValidating(false);
        }
      }
    };

    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  const mutate = async () => {
    setIsValidating(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const json = await res.json();
      setData({ categories: (json || []) });
      setDataSource('network');
      setError(null);
      await setCache(CACHE_KEY_CATEGORIES, json || []);
    } catch (err: any) {
      console.error('Manual category validation failed', err);
    } finally {
      setIsValidating(false);
    }
  };

  return { data, loading, isValidating, error, dataSource, mutate };
};

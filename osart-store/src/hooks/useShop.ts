import { useState, useEffect, useCallback } from 'react';
import { AdminProduct, AdminCategory } from '@/types/admin';
import { getCache, setCache } from '@/lib/storage';
import { MOCK_LOCAL_PRODUCTS, MOCK_CATEGORIES, MOCK_ORDERS } from '@/lib/mockData';

const CACHE_KEY_PRODUCTS = 'osart_products_cache';
const CACHE_KEY_CATEGORIES = 'osart_categories_cache';

const getAppModeSettings = () => {
  if (typeof window === 'undefined') return { mode: 'local', url: '', key: '' };
  try {
    const saved = localStorage.getItem('osart_admin_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        mode: parsed.osart_data_mode || 'local',
        url: parsed.osart_custom_db_url || '',
        key: parsed.osart_custom_db_key || ''
      };
    }
  } catch { /* ignore */ }
  return { mode: 'local', url: '', key: '' };
};

export const useProducts = (filter?: { name?: string; categoryId?: string }) => {
  const [data, setData] = useState<{ products: AdminProduct[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<'loading' | 'cache' | 'network' | 'mock' | 'custom_db'>('loading');

  const fetchProducts = useCallback(async (isMounted: boolean = true) => {
    const settings = getAppModeSettings();

    // -- 1. DEMO MODE (Local Mock Data) --
    if (settings.mode === 'local') {
      let filtered = MOCK_LOCAL_PRODUCTS;
      if (filter?.name) {
        const searchLower = filter.name.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchLower) || p.sku?.toLowerCase().includes(searchLower));
      }
      if (filter?.categoryId) {
        filtered = filtered.filter(p => p.category?.id === filter.categoryId || p.category_id === filter.categoryId);
      }
      if (isMounted) {
        setData({ products: filtered });
        setDataSource('mock');
        setLoading(false);
        setIsValidating(false);
        setError(null);
      }
      return;
    }

    // -- 2. STALE: Try IndexedDB cache --
    let hasLoadedInitialData = false;
    try {
      const cachedProducts = await getCache<AdminProduct[]>(CACHE_KEY_PRODUCTS);
      if (cachedProducts && cachedProducts.length > 0 && isMounted) {
        let filtered = cachedProducts;
        if (filter?.name) {
          const searchLower = filter.name.toLowerCase();
          filtered = filtered.filter(p => p.name.toLowerCase().includes(searchLower) || p.sku?.toLowerCase().includes(searchLower));
        }
        if (filter?.categoryId) {
          filtered = filtered.filter(p => p.category?.id === filter.categoryId || p.category_id === filter.categoryId);
        }
        setData({ products: filtered });
        setDataSource('cache');
        setLoading(false);
        hasLoadedInitialData = true;
      }
    } catch (err) { }

    // If no cache, load mock data immediately to prevent LCP blocking (first visit)
    if (!hasLoadedInitialData && isMounted) {
      let filtered = MOCK_LOCAL_PRODUCTS;
      if (filter?.name) {
        const searchLower = filter.name.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchLower) || p.sku?.toLowerCase().includes(searchLower));
      }
      if (filter?.categoryId) {
        filtered = filtered.filter(p => p.category?.id === filter.categoryId || p.category_id === filter.categoryId);
      }
      setData({ products: filtered });
      setDataSource('mock');
      setLoading(false);
    }

    // -- 3. REVALIDATE: From Custom DB or Default API --
    setIsValidating(true);
    // Remove setLoading(true) because we already showed mock/cache data

    try {
      let formatted: AdminProduct[] = [];
      let source: 'network' | 'custom_db' = 'network';

      if (settings.url && settings.key) {
        // Custom Supabase Database Query
        const queryUrl = new URL(`${settings.url}/rest/v1/products`);
        queryUrl.searchParams.append('select', '*,category:categories(id,name),product_images(id,url,position)');
        if (filter?.name) queryUrl.searchParams.append('name', `ilike.%${filter.name}%`);
        if (filter?.categoryId) queryUrl.searchParams.append('category_id', `eq.${filter.categoryId}`);

        const res = await fetch(queryUrl.toString(), {
          headers: { 'apikey': settings.key, 'Authorization': `Bearer ${settings.key}` }
        });
        if (!res.ok) throw new Error('Custom Database connection failed');
        const json = await res.json();

        formatted = (json || []).map((p: any) => {
          const images = [...(p.image_url ? [{ url: p.image_url, position: 0 }] : []), ...(p.product_images || [])].sort((a, b) => (a.position || 0) - (b.position || 0));
          return { ...p, images: images.length > 0 ? images : [] } as AdminProduct & { images: any[] };
        });
        source = 'custom_db';
      } else {
        // Default API Query
        const params = new URLSearchParams();
        if (filter?.name) params.append('search', filter.name);
        if (filter?.categoryId) params.append('category', filter.categoryId);

        // Add timeout flag to fetch API using an AbortController matching the 8 second threshold
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('Failed to fetch products');
        const json = await res.json();
        formatted = (json.products || []).map((p: any) => {
          const images = [...(p.image_url ? [{ url: p.image_url, position: 0 }] : []), ...(p.product_images || [])].sort((a, b) => (a.position || 0) - (b.position || 0));
          return { ...p, images: images.length > 0 ? images : [] } as AdminProduct & { images: any[] };
        });
      }

      if (!isMounted) return;
      setData({ products: formatted });
      setDataSource(source);
      setError(null);
      await setCache(CACHE_KEY_PRODUCTS, formatted);

    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Network fetch failed:', err);
      if (!isMounted) return;
      if (!data) {
        setData({ products: MOCK_LOCAL_PRODUCTS }); // Ultimate fallback
        setDataSource('mock');
        setError(err);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
        setIsValidating(false);
      }
    }
  }, [filter?.name, filter?.categoryId]);

  useEffect(() => {
    let isMounted = true;
    fetchProducts(isMounted);
    return () => { isMounted = false; };
  }, [fetchProducts]);

  const mutate = useCallback(async () => {
    await fetchProducts(true);
  }, [fetchProducts]);

  return { data, loading, isValidating, error, dataSource, mutate };
};

export const useCategories = () => {
  const [data, setData] = useState<{ categories: AdminCategory[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<'loading' | 'cache' | 'network' | 'mock' | 'custom_db' | 'error'>('loading');

  const fetchCategories = useCallback(async (isMounted: boolean = true) => {
    const settings = getAppModeSettings();

    // -- 1. DEMO MODE --
    if (settings.mode === 'local') {
      if (isMounted) {
        setData({ categories: MOCK_CATEGORIES });
        setDataSource('mock');
        setLoading(false);
        setIsValidating(false);
        setError(null);
      }
      return;
    }

    // -- 2. STALE: Cache --
    let hasLoadedInitialData = false;
    try {
      const cached = await getCache<AdminCategory[]>(CACHE_KEY_CATEGORIES);
      if (cached && cached.length > 0 && isMounted) {
        setData({ categories: cached });
        setDataSource('cache');
        setLoading(false);
        hasLoadedInitialData = true;
      }
    } catch (e) { }

    // If no cache, load mock data immediately to prevent rendering delays (first visit)
    if (!hasLoadedInitialData && isMounted) {
      setData({ categories: MOCK_CATEGORIES });
      setDataSource('mock');
      setLoading(false);
    }

    // -- 3. REVALIDATE --
    setIsValidating(true);

    try {
      let formatted: AdminCategory[] = [];
      let source: 'network' | 'custom_db' = 'network';

      if (settings.url && settings.key) {
        const res = await fetch(`${settings.url}/rest/v1/categories?select=*`, {
          headers: { 'apikey': settings.key, 'Authorization': `Bearer ${settings.key}` }
        });
        if (!res.ok) throw new Error('Custom Database connection failed');
        formatted = await res.json();
        source = 'custom_db';
      } else {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch('/api/categories', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('Failed to fetch categories');
        formatted = await res.json();
      }

      if (!isMounted) return;
      setData({ categories: formatted });
      setDataSource(source);
      setError(null);
      await setCache(CACHE_KEY_CATEGORIES, formatted);

    } catch (err: any) {
      if (err.name === 'AbortError') return;
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
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchCategories(isMounted);
    return () => { isMounted = false; };
  }, [fetchCategories]);

  const mutate = useCallback(async () => {
    await fetchCategories(true);
  }, [fetchCategories]);

  return { data, loading, isValidating, error, dataSource, mutate };
};
export const useOrders = (userId?: string) => {
  const [data, setData] = useState<{ orders: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<'loading' | 'cache' | 'network' | 'mock' | 'custom_db'>('loading');

  const fetchOrders = useCallback(async (isMounted: boolean = true) => {
    const settings = getAppModeSettings();

    // -- 1. DEMO MODE --
    if (settings.mode === 'local') {
      if (isMounted) {
        setData({ orders: MOCK_ORDERS });
        setDataSource('mock');
        setLoading(false);
        setIsValidating(false);
        setError(null);
      }
      return;
    }

    // -- 2. REVALIDATE --
    setIsValidating(true);
    try {
      if (!userId && !settings.url) {
        setData({ orders: [] });
        setDataSource('network');
        return;
      }

      let orders: any[] = [];
      let source: 'network' | 'custom_db' = 'network';

      if (settings.url && settings.key) {
        const queryUrl = new URL(`${settings.url}/rest/v1/orders`);
        queryUrl.searchParams.append('select', '*,order_items(*,product:products(*))');
        queryUrl.searchParams.append('order', 'created_at.desc');
        if (userId) queryUrl.searchParams.append('user_id', `eq.${userId}`);

        const res = await fetch(queryUrl.toString(), {
          headers: { 'apikey': settings.key, 'Authorization': `Bearer ${settings.key}` }
        });
        if (!res.ok) throw new Error('Custom Database connection failed');
        orders = await res.json();
        source = 'custom_db';
      } else {
        const res = await fetch(`/api/orders?userId=${userId || ''}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        orders = await res.json();
      }

      if (!isMounted) return;
      setData({ orders });
      setDataSource(source);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      if (isMounted && !data) {
        setData({ orders: MOCK_ORDERS });
        setDataSource('mock');
        setError(err);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
        setIsValidating(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    let isMounted = true;
    fetchOrders(isMounted);
    return () => { isMounted = false; };
  }, [fetchOrders]);

  const mutate = useCallback(async () => {
    await fetchOrders(true);
  }, [fetchOrders]);

  return { data, loading, isValidating, error, dataSource, mutate };
};

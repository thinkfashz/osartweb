import { useState, useEffect } from 'react';
import { AdminProduct, AdminCategory } from '@/types/admin';

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

        setData({ products: formatted as AdminProduct[] });
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err);
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

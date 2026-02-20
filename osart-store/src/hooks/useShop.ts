import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-auth';

export const useProducts = (filter?: { name?: string; categoryId?: string }) => {
  const [data, setData] = useState<{ products: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*, categoryData:categories(name, slug)')
          .eq('is_active', true);

        if (filter?.name) {
          query = query.ilike('name', `%${filter.name}%`);
        }
        if (filter?.categoryId) {
          query = query.eq('category_id', filter.categoryId);
        }

        const { data: products, error: prodError } = await query.order('created_at', { ascending: false });

        if (prodError) throw prodError;

        // Format for UI compatibility (ProductCard expects images array)
        const formatted = (products || []).map((p: any) => ({
          ...p,
          images: p.image_url ? [{ url: p.image_url, position: 0 }] : []
        }));

        setData({ products: formatted });
      } catch (err) {
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
  const [data, setData] = useState<{ categories: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data: categories, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (catError) throw catError;
        setData({ categories: categories || [] });
      } catch (err) {
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

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-auth';
import { AdminProduct, AdminCategory } from '@/types/admin';

export const useProducts = (filter?: { name?: string; categoryId?: string }) => {
  const [data, setData] = useState<{ products: AdminProduct[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            categoryData:categories(name, slug),
            product_images(id, url, position)
          `)
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
        const formatted = (products || []).map((p: any) => {
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
        const { data: categories, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (catError) throw catError;
        setData({ categories: (categories || []) as AdminCategory[] });
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

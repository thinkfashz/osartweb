'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/wishlist?userId=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      const data = await res.json();
      setWishlist(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return { wishlist, loading, error, refetch: fetchWishlist };
};

export const useToggleWishlist = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const toggle = async (variables: { input: { productId: string } }) => {
    if (!user) throw new Error('Auth required');
    setLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: variables.input.productId,
        }),
      });
      if (!res.ok) throw new Error('Failed to toggle wishlist');
      const data = await res.json();
      return { data: { toggleWishlist: data } };
    } finally {
      setLoading(false);
    }
  };

  return [toggle, { loading }] as const;
};

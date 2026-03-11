'use client';

import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-auth';
import { useCartStore } from '@/store/cartStore';

export function useCart() {
  const store = useCartStore();
  
  // Use a stable reference for totals to avoid re-renders
  const { subtotal, discount, total, itemCount } = store.getTotals();

  const fetchDbCart = useCallback(async (userId: string) => {
    try {
      store.setLoading(true);
      const res = await fetch(`/api/cart?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        store.setItems(data.items);
      }
    } catch (e) {
      console.error('Error fetching cart:', e);
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  useEffect(() => {
    let currentUser: any = null;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      currentUser = session?.user ?? null;

      if (currentUser) {
        await fetchDbCart(currentUser.id);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      if (nextUser && nextUser.id !== currentUser?.id) {
        currentUser = nextUser;
        await fetchDbCart(nextUser.id);
      } else if (!nextUser) {
        currentUser = null;
        // Don't clear cart immediately on logout, let persist handle guest mode
        // Or we could clear if we want a fresh guest cart
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchDbCart]);

  // Wrapper actions that pass the current user
  const addToCart = useCallback(async (product: any, quantity: number = 1) => {
    const { data: { session } } = await supabase.auth.getSession();
    await store.addToCart(product, quantity, session?.user);
  }, [store]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    await store.updateQuantity(productId, quantity, session?.user);
  }, [store]);

  const removeFromCart = useCallback(async (productId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    await store.removeFromCart(productId, session?.user);
  }, [store]);

  return {
    items: store.items,
    subtotal,
    discount,
    total,
    itemCount,
    loading: store.loading,
    updatingId: store.updatingId,
    coupon: store.coupon,
    addToCart,
    updateQuantity,
    removeFromCart,
    applyCoupon: store.applyCoupon,
    refetch: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) await fetchDbCart(session.user.id);
    },
  };
}

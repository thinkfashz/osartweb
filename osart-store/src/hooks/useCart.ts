'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-auth';

export function useCart() {
  const [user, setUser] = useState<any>(null);
  const [guestCart, setGuestCart] = useState<any[]>([]);
  const [dbCart, setDbCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchDbCart = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/cart?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setDbCart(data);
      }
    } catch (e) {
      console.error('Error fetching cart:', e);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      const saved = localStorage.getItem('osart_guest_cart');
      if (saved) setGuestCart(JSON.parse(saved));

      if (currentUser) {
        await fetchDbCart(currentUser.id);
      }

      setIsLoaded(true);
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchDbCart(currentUser.id);
      } else {
        setDbCart(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchDbCart]);

  // Sync Guest Cart to DB when user signs in
  useEffect(() => {
    if (user && guestCart.length > 0) {
      const merge = async () => {
        try {
          const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              action: 'merge',
              items: guestCart.map(it => ({ productId: it.productId, quantity: it.quantity }))
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setDbCart(data);
            localStorage.removeItem('osart_guest_cart');
            setGuestCart([]);
          }
        } catch (e) {
          console.error('Merge error:', e);
        }
      };
      merge();
    }
  }, [user, guestCart]);

  const addToCart = useCallback(async (product: any, quantity: number = 1) => {
    if (user) {
      setLoading(true);
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            productId: product.id,
            quantity
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setDbCart(data);
        }
      } catch (e) {
        console.error('Add to cart error:', e);
      } finally {
        setLoading(false);
      }
    } else {
      const updated = [...guestCart];
      const idx = updated.findIndex(it => it.productId === (product.id || product.productId));
      if (idx > -1) {
        updated[idx].quantity += quantity;
      } else {
        updated.push({ productId: product.id, product, quantity });
      }
      setGuestCart(updated);
      localStorage.setItem('osart_guest_cart', JSON.stringify(updated));
    }
  }, [user, guestCart]);

  const items = user ? dbCart?.items ?? [] : guestCart;
  const subtotal = items.reduce((acc: number, it: any) => acc + (it.product.price * it.quantity), 0);
  const itemCount = items.reduce((acc: number, it: any) => acc + it.quantity, 0);

  return {
    items,
    subtotal,
    itemCount,
    loading: loading || !isLoaded,
    addToCart,
    refetch: () => user && fetchDbCart(user.id),
  };
}

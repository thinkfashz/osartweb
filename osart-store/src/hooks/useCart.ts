'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase-auth';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    slug: string;
    images?: string[];
    stock?: number;
  };
}

export function useCart() {
  const [user, setUser] = useState<any>(null);
  const [guestCart, setGuestCart] = useState<CartItem[]>([]);
  const [dbCart, setDbCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);

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

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      try {
        const saved = localStorage.getItem('osart_guest_cart');
        if (saved) setGuestCart(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse guest cart:', e);
        localStorage.removeItem('osart_guest_cart');
      }

      if (currentUser) {
        await fetchDbCart(currentUser.id);
      }
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
    setLoading(true);
    if (user) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            productId: product.id || product.productId,
            quantity
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setDbCart(data);
          toast.success('Producto añadido al carrito');
        }
      } catch (e) {
        toast.error('Error al añadir al carrito');
      } finally {
        setLoading(false);
      }
    } else {
      const updated = [...guestCart];
      const prodId = product.id || product.productId;
      const idx = updated.findIndex(it => it.productId === prodId);
      if (idx > -1) {
        updated[idx].quantity += quantity;
      } else {
        updated.push({
          id: `guest_${Date.now()}`,
          productId: prodId,
          product: {
            id: prodId,
            name: product.name,
            price: product.price,
            slug: product.slug,
            imageUrl: product.imageUrl || (product.images?.[0]?.url) || (product.images?.[0]) || null
          },
          quantity
        } as any);
      }
      setGuestCart(updated);
      localStorage.setItem('osart_guest_cart', JSON.stringify(updated));
      toast.success('Producto añadido al carrito (invitado)');
      setLoading(false);
    }
  }, [user, guestCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setUpdatingId(productId);

    if (user) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            productId,
            quantity: quantity,
            action: 'update'
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setDbCart(data);
        }
      } catch (e) {
        toast.error('Error al actualizar cantidad');
      } finally {
        setUpdatingId(null);
      }
    } else {
      const updated = guestCart.map(it =>
        it.productId === productId ? { ...it, quantity } : it
      );
      setGuestCart(updated);
      localStorage.setItem('osart_guest_cart', JSON.stringify(updated));
      setUpdatingId(null);
    }
  }, [user, guestCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    setUpdatingId(productId);
    if (user) {
      try {
        const res = await fetch(`/api/cart?userId=${user.id}&productId=${productId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          const data = await res.json();
          setDbCart(data);
          toast.success('Producto eliminado');
        }
      } catch (e) {
        toast.error('Error al eliminar producto');
      } finally {
        setUpdatingId(null);
      }
    } else {
      const updated = guestCart.filter(it => it.productId !== productId);
      setGuestCart(updated);
      localStorage.setItem('osart_guest_cart', JSON.stringify(updated));
      toast.success('Producto eliminado');
      setUpdatingId(null);
    }
  }, [user, guestCart]);

  const applyCoupon = useCallback((code: string) => {
    const validCoupons: Record<string, number> = {
      'OSART10': 0.1,
      'INDUSTRIAL': 0.15,
      'POWER': 0.05
    };

    const upperCode = code.toUpperCase();
    if (validCoupons[upperCode]) {
      setCoupon({ code: upperCode, discount: validCoupons[upperCode] });
      toast.success(`Cupón ${upperCode} aplicado exitosamente`);
      return true;
    } else {
      toast.error('Cupón inválido');
      return false;
    }
  }, []);

  const items = useMemo(() => user ? dbCart?.items ?? [] : guestCart, [user, dbCart, guestCart]);
  const subtotal = useMemo(() => items.reduce((acc: number, it: any) => acc + ((it.product?.price || 0) * (it.quantity || 0)), 0), [items]);
  const discount = useMemo(() => coupon ? subtotal * coupon.discount : 0, [subtotal, coupon]);
  const total = subtotal - discount;
  const itemCount = useMemo(() => items.reduce((acc: number, it: any) => acc + it.quantity, 0), [items]);

  return {
    items,
    subtotal,
    discount,
    total,
    itemCount,
    loading,
    updatingId,
    coupon,
    addToCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    refetch: () => user && fetchDbCart(user.id),
  };
}

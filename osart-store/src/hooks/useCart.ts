'use client';

import { useState, useEffect, useCallback } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { supabase } from '@/lib/supabase-auth';

// GraphQL Queries/Mutations
const GET_CART = gql`
  query GetCart {
    cart {
      id
      items {
        id
        quantity
        unitPrice
        product {
          id
          name
          price
          stock
        }
      }
      subtotal
    }
  }
`;

const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      id
      items {
        id
        quantity
        product {
          id
          name
          price
          stock
        }
      }
      subtotal
    }
  }
`;

const MERGE_CART = gql`
  mutation MergeCart($items: [GuestCartItemInput!]!) {
    mergeCart(input: { items: $items }) {
      id
    }
  }
`;

export function useCart() {
  const [user, setUser] = useState<any>(null);
  const [guestCart, setGuestCart] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { data, loading, refetch } = useQuery<any>(GET_CART, {
    skip: !user,
  });

  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const [mergeCartMutation] = useMutation(MERGE_CART);

  // Initial Load
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      const saved = localStorage.getItem('osart_guest_cart');
      if (saved) setGuestCart(JSON.parse(saved));
      setIsLoaded(true);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync Guest Cart to DB when user signs in
  useEffect(() => {
    if (user && guestCart.length > 0) {
      const merge = async () => {
        const items = guestCart.map(it => ({ productId: it.productId, quantity: it.quantity }));
        await mergeCartMutation({ variables: { items } });
        localStorage.removeItem('osart_guest_cart');
        setGuestCart([]);
        refetch();
      };
      merge();
    }
  }, [user, guestCart, mergeCartMutation, refetch]);

  const addToCart = useCallback(async (product: any, quantity: number = 1) => {
    if (user) {
      await addToCartMutation({
        variables: {
          input: {
            productId: product.id,
            quantity
          }
        }
      });
      refetch();
    } else {
      const updated = [...guestCart];
      const idx = updated.findIndex(it => it.productId === product.id);
      if (idx > -1) {
        updated[idx].quantity += quantity;
      } else {
        updated.push({ productId: product.id, product, quantity });
      }
      setGuestCart(updated);
      localStorage.setItem('osart_guest_cart', JSON.stringify(updated));
    }
  }, [user, guestCart, addToCartMutation, refetch]);

  const items = user ? (data as any)?.cart?.items ?? [] : guestCart;
  const subtotal = items.reduce((acc: number, it: any) => acc + (it.product.price * it.quantity), 0);
  const itemCount = items.reduce((acc: number, it: any) => acc + it.quantity, 0);

  return {
    items,
    subtotal,
    itemCount,
    loading: loading || !isLoaded,
    addToCart,
    refetch,
  };
}

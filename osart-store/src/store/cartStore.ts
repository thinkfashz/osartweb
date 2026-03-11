import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
    images?: any[];
    stock?: number;
    imageUrl?: string;
  };
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  updatingId: string | null;
  coupon: { code: string; discount: number } | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setItems: (items: CartItem[]) => void;
  addToCart: (product: any, quantity?: number, user?: any) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, user?: any) => Promise<void>;
  removeFromCart: (productId: string, user?: any) => Promise<void>;
  applyCoupon: (code: string) => boolean;
  clearCart: () => void;
  
  // Computed values through selectors
  getTotals: () => { subtotal: number; discount: number; total: number; itemCount: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      updatingId: null,
      coupon: null,

      setLoading: (loading) => set({ loading }),
      setItems: (items) => set({ items }),

      addToCart: async (product, quantity = 1, user) => {
        const { items } = get();
        const productId = product.id || product.productId;
        
        // Optimistic UI update
        const existingItem = items.find((item) => item.productId === productId);
        let newItems: CartItem[];
        
        if (existingItem) {
          newItems = items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [
            ...items,
            {
              id: `temp_${Date.now()}`,
              productId,
              quantity,
              product: {
                id: productId,
                name: product.name,
                price: product.price,
                slug: product.slug,
                imageUrl: product.imageUrl || product.images?.[0]?.url || product.images?.[0] || null,
              },
            },
          ];
        }

        set({ items: newItems });
        toast.success(existingItem ? 'Cantidad actualizada' : 'Producto añadido al carrito');

        // Sync with background if user is logged in
        if (user) {
          try {
            const res = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                productId,
                quantity: existingItem ? existingItem.quantity + quantity : quantity,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              set({ items: data.items });
            }
          } catch (e) {
            console.error('Failed to sync cart with database', e);
          }
        }
      },

      updateQuantity: async (productId, quantity, user) => {
        if (quantity < 1) return;
        const { items } = get();
        
        // Optimistic UI update
        const newItems = items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        set({ items: newItems, updatingId: productId });

        if (user) {
          try {
            const res = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                productId,
                quantity,
                action: 'update',
              }),
            });
            if (res.ok) {
              const data = await res.json();
              set({ items: data.items });
            }
          } catch (e) {
            toast.error('Error al sincronizar cantidad');
          } finally {
            set({ updatingId: null });
          }
        } else {
          set({ updatingId: null });
        }
      },

      removeFromCart: async (productId, user) => {
        const { items } = get();
        const newItems = items.filter((item) => item.productId !== productId);
        set({ items: newItems, updatingId: productId });
        
        toast.success('Producto eliminado');

        if (user) {
          try {
            const res = await fetch(`/api/cart?userId=${user.id}&productId=${productId}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              const data = await res.json();
              set({ items: data.items });
            }
          } catch (e) {
            toast.error('Error al eliminar del servidor');
          } finally {
            set({ updatingId: null });
          }
        } else {
          set({ updatingId: null });
        }
      },

      applyCoupon: (code) => {
        const validCoupons: Record<string, number> = {
          'OSART10': 0.1,
          'INDUSTRIAL': 0.15,
          'POWER': 0.05
        };

        const upperCode = code.toUpperCase();
        if (validCoupons[upperCode]) {
          set({ coupon: { code: upperCode, discount: validCoupons[upperCode] } });
          toast.success(`Cupón ${upperCode} aplicado`);
          return true;
        } else {
          toast.error('Cupón inválido');
          return false;
        }
      },

      clearCart: () => set({ items: [], coupon: null }),

      getTotals: () => {
        const { items, coupon } = get();
        const subtotal = items.reduce((acc, it) => acc + ((it.product?.price || 0) * (it.quantity || 0)), 0);
        const discount = coupon ? subtotal * coupon.discount : 0;
        const total = subtotal - discount;
        const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);
        
        return { subtotal, discount, total, itemCount };
      },
    }),
    {
      name: 'osart-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist items and coupon, ignore loading states
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    }
  )
);

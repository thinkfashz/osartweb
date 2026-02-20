'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/AuthContext';

const GET_CART = gql`
  query GetCart {
    cart {
      id
      items {
        id
        productId
        product {
          name
          price
          slug
        }
        quantity
      }
    }
  }
`;

const UPDATE_CART_QTY = gql`
  mutation UpdateCartItem($productId: String!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      id
      items {
        id
        quantity
      }
    }
  }
`;

const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: String!) {
    removeFromCart(productId: $productId) {
      id
    }
  }
`;

const CartPage = () => {
    const { user, loading: authLoading } = useAuth();
    const { data, loading, error, refetch } = useQuery<any>(GET_CART, {
        skip: !user
    });
    const [updateQty] = useMutation(UPDATE_CART_QTY);
    const [removeItem] = useMutation(REMOVE_FROM_CART);

    const cart = (data as any)?.cart;
    const items = cart?.items || [];

    const subtotal = items.reduce((acc: number, item: any) => acc + item.product.price * item.quantity, 0);
    const shipping = subtotal > 50000 ? 0 : 5000;
    const total = subtotal + shipping;

    const handleUpdateQty = async (productId: string, delta: number, currentQty: number) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        await updateQty({ variables: { productId, quantity: delta } });
        refetch();
    };

    const handleRemove = async (productId: string) => {
        await removeItem({ variables: { productId } });
        refetch();
    };

    if (authLoading || loading) return (
        <div className="max-w-[1200px] mx-auto px-5 py-20 flex justify-center">
            <Loader2 className="animate-spin text-electric-blue" size={48} />
        </div>
    );

    if (!user) return (
        <div className="max-w-[1200px] mx-auto px-5 py-20 text-center">
            <h1 className="text-3xl font-bold mb-6">Debes iniciar sesión</h1>
            <p className="text-muted-foreground mb-10">Ingresa a tu cuenta para ver tu carrito de compras.</p>
            <Link href="/login" className="neon-button inline-flex">Iniciar Sesión</Link>
        </div>
    );

    if (items.length === 0) {
        return (
            <div className="max-w-[1200px] mx-auto px-5 py-20 text-center">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <ShoppingCart size={40} className="text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
                <p className="text-muted-foreground mb-10 max-w-sm mx-auto">Parece que aún no has añadido ningún repuesto a tu compra.</p>
                <Link href="/catalog" className="neon-button inline-flex">
                    Ir al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-12">
            <h1 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase italic tracking-tighter">
                <ShoppingCart size={32} className="text-electric-blue" />
                Tu Carrito <span className="text-sm font-bold text-muted-foreground not-italic ml-2">({items.length} productos)</span>
            </h1>

            <div className="grid lg:grid-cols-3 gap-12">

                {/* Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item: any) => (
                        <div key={item.id} className="glass p-4 sm:p-6 flex gap-4 sm:gap-6 border-white/5 bg-zinc-900/40">
                            <div className="w-24 h-24 bg-zinc-950 rounded-xl flex-shrink-0 flex items-center justify-center border border-white/5">
                                <ShoppingCart size={32} className="text-electric-blue opacity-20" />
                            </div>

                            <div className="flex-grow flex flex-col justify-between">
                                <div className="flex justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold hover:text-electric-blue transition-colors leading-tight">
                                            <Link href={`/product/${item.product.slug}`}>{item.product.name}</Link>
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.productId)}
                                        className="text-muted-foreground hover:text-red-500 transition-colors self-start"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex items-center bg-zinc-950 border border-white/10 rounded-lg p-0.5">
                                        <button
                                            onClick={() => handleUpdateQty(item.productId, -1, item.quantity)}
                                            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-white"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQty(item.productId, 1, item.quantity)}
                                            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-black text-white">${(item.product.price * item.quantity).toLocaleString('es-CL')}</span>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">${item.product.price.toLocaleString('es-CL')} c/u</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="glass p-8 sticky top-24 border-electric-blue/20 bg-zinc-950/80 backdrop-blur-xl">
                        <h2 className="text-xl font-black mb-6 pb-4 border-b border-white/5 uppercase italic tracking-tighter">Resumen de Compra</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-muted-foreground">
                                <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
                                <span className="font-bold">${subtotal.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span className="text-xs font-bold uppercase tracking-widest">Envío estimado</span>
                                <span className={`font-bold ${shipping === 0 ? 'text-green-500' : ''}`}>
                                    {shipping === 0 ? 'GRATIS' : `$${shipping.toLocaleString('es-CL')}`}
                                </span>
                            </div>
                            <hr className="border-white/5" />
                            <div className="flex justify-between text-white text-2xl font-black">
                                <span className="uppercase italic tracking-tighter">Total</span>
                                <span className="text-electric-blue">${total.toLocaleString('es-CL')}</span>
                            </div>
                        </div>

                        <Link href="/checkout" className="neon-button w-full flex items-center justify-center gap-2 py-4 mb-6">
                            Finalizar Pedido
                            <ArrowRight size={20} />
                        </Link>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                <ShieldCheck size={16} className="text-electric-blue" />
                                <span>Transacción Protegida OSART</span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                <Truck size={16} className="text-electric-blue" />
                                <span>Despacho a nivel nacional</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

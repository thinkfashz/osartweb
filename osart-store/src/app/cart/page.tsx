'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Terminal } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { useCart } from '@/hooks/useCart';
import CartItemCard from '@/components/cart/CartItemCard';
import CartSummary from '@/components/cart/CartSummary';
import CouponBox from '@/components/cart/CouponBox';
import StickyCheckoutBar from '@/components/cart/StickyCheckoutBar';
import EmptyCartState from '@/components/cart/EmptyCartState';

const CartPage = () => {
    const router = useRouter();
    const {
        items,
        subtotal,
        discount,
        total,
        itemCount,
        loading,
        updatingId,
        coupon,
        updateQuantity,
        removeFromCart,
        applyCoupon
    } = useCart();

    const handleCheckout = () => {
        router.push('/checkout');
    };

    if (loading && items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 p-5">
                <div className="relative">
                    <Loader2 className="animate-spin text-sky-500" size={56} strokeWidth={1} />
                    <div className="absolute inset-0 bg-sky-500/20 blur-2xl rounded-full" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white italic">Sincronizando_Manifiesto</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 animate-pulse">
                        Accediendo a terminal central...
                    </p>
                </div>
            </div>
        );
    }

    if (items.length === 0 && !loading) {
        return <EmptyCartState />;
    }

    return (
        <div className="relative min-h-screen pb-40 lg:pb-24">
            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-sky-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-12 sm:pt-20">
                {/* Header Section */}
                <div className="mb-12 sm:mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link
                            href="/catalog"
                            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-sky-500 transition-all mb-8 group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Retornar al Almacén Central
                        </Link>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl sm:text-8xl font-black uppercase italic tracking-tighter leading-none"
                        >
                            <span className="text-white block sm:inline">Tu</span>
                            <span className="text-sky-500 block sm:inline sm:ml-4">Carrito</span>
                        </motion.h1>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-4 bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-3 backdrop-blur-sm shadow-xl"
                        >
                            <Terminal size={18} className="text-sky-500" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-tight">Manifest_Status</span>
                                <span className="text-xs font-bold text-zinc-200 uppercase font-mono italic">
                                    LVL:01_QTY:{itemCount.toString().padStart(2, '0')}_ITEMS
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 sm:gap-16">
                    {/* Items List - Left Column */}
                    <div className="lg:col-span-8">
                        <div className="space-y-6">
                            <AnimatePresence mode='popLayout'>
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id || item.productId}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        <CartItemCard
                                            item={item}
                                            onUpdateQty={updateQuantity}
                                            onRemove={removeFromCart}
                                            isUpdating={updatingId === item.productId}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Additional Info / Trust Badges */}
                        <div className="mt-12 p-8 rounded-2xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm grid sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Seguridad Encriptada</h4>
                                <p className="text-[9px] text-zinc-500 uppercase font-bold leading-relaxed tracking-wider">
                                    Todas las transacciones están protegidas por protocolos de seguridad bancaria OSART.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Soporte Técnico</h4>
                                <p className="text-[9px] text-zinc-500 uppercase font-bold leading-relaxed tracking-wider">
                                    Asistencia inmediata disponible para cualquier anomalía en el proceso de carga.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary - Right Column */}
                    <div className="lg:col-span-4 lg:relative">
                        <div className="lg:sticky lg:top-28 space-y-8">
                            <CartSummary
                                subtotal={subtotal}
                                discount={discount}
                                total={total}
                                onCheckout={handleCheckout}
                            />

                            <div className="rounded-2xl overflow-hidden border border-white/5">
                                <CouponBox onApply={applyCoupon} appliedCoupon={coupon} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar for Mobile Only */}
            <StickyCheckoutBar
                total={total + (subtotal > 50000 ? 0 : 5000)}
                itemCount={itemCount}
                onCheckout={handleCheckout}
            />
        </div>
    );
};

export default CartPage;

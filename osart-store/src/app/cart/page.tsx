'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Loader2, ArrowLeft } from 'lucide-react';
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
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-electric-blue" size={48} />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                    Sincronizando Inventario...
                </p>
            </div>
        );
    }

    if (items.length === 0) {
        return <EmptyCartState />;
    }

    return (
        <div className="relative min-h-screen pb-32 lg:pb-12">
            <div className="max-w-[1200px] mx-auto px-5 pt-8 sm:pt-12">
                {/* Header */}
                <div className="mb-10 sm:mb-12">
                    <Link
                        href="/catalog"
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-electric-blue transition-colors mb-6 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Volver al Catálogo
                    </Link>

                    <h1 className="text-4xl sm:text-6xl font-black flex flex-wrap items-baseline gap-x-4 uppercase italic tracking-tighter leading-none">
                        <span className="text-white">Tu</span>
                        <span className="text-electric-blue">Carrito</span>
                        <span className="text-sm not-italic font-bold text-muted-foreground tracking-widest mt-2 sm:mt-0 font-mono">
                            [LVL:01_QTY:{itemCount}]
                        </span>
                    </h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 sm:gap-12">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex flex-col gap-4">
                            <AnimatePresence initial={false}>
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
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

                        {/* Tablet/Mobile Additional Content */}
                        <div className="lg:hidden space-y-4">
                            <CouponBox onApply={applyCoupon} appliedCoupon={coupon} />
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-4 lg:relative">
                        <div className="lg:sticky lg:top-28 space-y-6">
                            <div className="hidden lg:block">
                                <CartSummary
                                    subtotal={subtotal}
                                    discount={discount}
                                    total={total}
                                    onCheckout={handleCheckout}
                                />
                            </div>

                            <div className="hidden lg:block">
                                <CouponBox onApply={applyCoupon} appliedCoupon={coupon} />
                            </div>

                            {/* Mobile Info Card (Prices only) */}
                            <div className="lg:hidden pt-4">
                                <CartSummary
                                    subtotal={subtotal}
                                    discount={discount}
                                    total={total}
                                    onCheckout={handleCheckout}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <StickyCheckoutBar
                total={total + (subtotal > 50000 ? 0 : 5000)}
                itemCount={itemCount}
                onCheckout={handleCheckout}
            />
        </div>
    );
};

export default CartPage;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Zap, Star, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useToggleWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/graphql/types';
import { toast } from 'sonner';
import { SafeImage } from '@/components/ui/SafeImage';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { user } = useAuth();
    const router = useRouter();
    const { addToCart } = useCart();
    const [toggleWishlist] = useToggleWishlist();
    const { wishlist } = useWishlist();
    const [adding, setAdding] = useState(false);
    const [showFloat, setShowFloat] = useState(false);

    const isFavorited = wishlist.some((item: any) => item.productId === product.id);

    const categoryName =
        product.categoryData?.name ||
        (typeof product.category === 'string' ? product.category : product.category?.name) ||
        'General';

    const imgSrc = product.images?.[0]?.url ?? (product as any).image_url ?? null;
    const isLowStock = product.stock !== undefined && product.stock < 5 && product.stock > 0;
    const isOutOfStock = product.stock === 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) { toast.error('Sin stock disponible'); return; }
        setAdding(true);
        try {
            await addToCart(product as any, 1);
            toast.success(`${product.name} añadido al carrito`);

            // Trigger floating animation
            setShowFloat(true);
            setTimeout(() => setShowFloat(false), 1200);

        } catch {
            toast.error('Error al añadir al carrito');
        } finally {
            setAdding(false);
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) { router.push('/login'); return; }
        try {
            await toggleWishlist({ input: { productId: product.id } });
        } catch { /* ignore */ }
    };

    return (
        <motion.article
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="group relative flex flex-col bg-zinc-950 border border-white/5 hover:border-electric-blue/30 rounded-2xl overflow-hidden transition-colors duration-300 shadow-lg hover:shadow-[0_8px_40px_rgba(0,229,255,0.08)]"
        >
            {/* ── Corner accent lines ── */}
            <div className="absolute top-0 left-0 w-5 h-[1px] bg-electric-blue/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 left-0 w-[1px] h-5 bg-electric-blue/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-5 h-[1px] bg-electric-blue/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-[1px] h-5 bg-electric-blue/30 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* ── Wishlist button (top-right) ── */}
            <button
                onClick={handleToggleWishlist}
                aria-label="Añadir a favoritos"
                className={cn(
                    'absolute top-3 right-3 z-30 p-2 rounded-xl border transition-all duration-200 backdrop-blur-md',
                    isFavorited
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                        : 'bg-zinc-950/70 border-white/10 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-rose-400'
                )}
            >
                <Heart size={14} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>

            {/* ── Stock badge ── */}
            {(isLowStock || isOutOfStock) && (
                <div className={cn(
                    'absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-xl border backdrop-blur-md text-[8px] font-black uppercase tracking-widest',
                    isOutOfStock
                        ? 'bg-zinc-900/80 border-zinc-700 text-zinc-500'
                        : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                )}>
                    <div className={cn('w-1 h-1 rounded-full', isOutOfStock ? 'bg-zinc-600' : 'bg-rose-500 animate-pulse')} />
                    {isOutOfStock ? 'Sin Stock' : `Últimas ${product.stock}`}
                </div>
            )}

            {/* ── Image ── */}
            <Link href={`/product/${product.slug}`} className="block">
                <div className="aspect-[4/3] relative bg-zinc-900 overflow-hidden">
                    {/* Subtle scanline overlay */}
                    <div className="absolute inset-0 retro-scanlines opacity-20 pointer-events-none z-10" />

                    <SafeImage
                        src={imgSrc}
                        alt={product.name}
                        fallbackIconSize={40}
                        className={cn(
                            'w-full h-full object-cover transition-all duration-700',
                            'group-hover:scale-105',
                            isOutOfStock ? 'grayscale opacity-40' : 'opacity-100'
                        )}
                    />

                    {/* Bottom gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none z-10" />

                    {/* SKU chip */}
                    <div className="absolute bottom-2 left-3 z-20 text-[7px] font-mono text-electric-blue/50 bg-zinc-950/60 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                        {(product.sku || product.id.slice(0, 8)).toUpperCase()}
                    </div>
                </div>
            </Link>

            {/* ── Info ── */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                {/* Category */}
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-electric-blue/70 bg-electric-blue/8 px-2 py-0.5 rounded-full border border-electric-blue/10">
                        {categoryName}
                    </span>
                    {product.stock !== undefined && product.stock >= 5 && (
                        <div className="flex items-center gap-1 text-[9px] text-zinc-600">
                            <Star size={9} className="fill-zinc-700 text-zinc-700" />
                            <span className="font-mono">{product.stock} uds</span>
                        </div>
                    )}
                </div>

                {/* Product name */}
                <Link href={`/product/${product.slug}`}>
                    <h3 className="text-sm font-bold uppercase italic tracking-tighter text-white group-hover:text-electric-blue transition-colors line-clamp-2 leading-tight">
                        {product.name}
                    </h3>
                </Link>

                {/* Price + CTA */}
                <div className="relative mt-auto pt-2 flex items-center justify-between gap-2 border-t border-white/5">

                    {/* Floating Add to Cart Animation Overlay */}
                    <AnimatePresence>
                        {showFloat && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: -30 }}
                                exit={{ opacity: 0, scale: 1.2, y: -40 }}
                                transition={{ duration: 0.4, type: "spring" }}
                                className="absolute right-0 bottom-12 z-50 flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] pointer-events-none"
                            >
                                <ShoppingCart size={18} className="text-white" />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute -top-1 -right-1"
                                >
                                    <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <p className="text-[8px] text-zinc-600 font-mono uppercase mb-0.5">Precio unit.</p>
                        <p className="text-lg font-black text-white tracking-tighter leading-none">
                            ${(product.price || 0).toLocaleString('es-CL')}
                        </p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={adding || isOutOfStock}
                        aria-label="Añadir al carrito"
                        className={cn(
                            'relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all duration-200 border shrink-0 overflow-hidden',
                            isOutOfStock
                                ? 'border-zinc-800 text-zinc-700 cursor-not-allowed bg-transparent'
                                : adding || showFloat
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                    : 'bg-electric-blue text-black border-transparent hover:bg-electric-blue/90 shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.35)] active:scale-95'
                        )}
                    >
                        {adding ? (
                            <Zap size={13} className="animate-pulse" />
                        ) : showFloat ? (
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3 }}>
                                <svg className="w-[13px] h-[13px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>
                        ) : (
                            <ShoppingCart size={13} />
                        )}
                        <span className="hidden sm:inline">
                            {isOutOfStock ? 'Agotado' : showFloat ? 'Añadido' : adding ? 'Añadiendo' : 'Añadir'}
                        </span>
                    </button>
                </div>
            </div>
        </motion.article>
    );
};

export default ProductCard;

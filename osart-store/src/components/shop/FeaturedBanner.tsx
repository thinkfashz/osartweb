'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, ShoppingCart, ArrowUpRight, Tag } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { SafeImage } from '@/components/ui/SafeImage';

interface FeaturedProduct {
    id: string;
    slug?: string;
    title?: string;
    name?: string;
    price: number;
    description?: string;
    image_url?: string;
    category?: { name: string } | string;
    categoryData?: { name: string };
    metadata?: { is_featured?: boolean; accent_color?: string };
}

interface FeaturedBannerProps {
    products: FeaturedProduct[];
}

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [adding, setAdding] = useState(false);
    const { addToCart } = useCart();
    const [paused, setPaused] = useState(false);

    const advance = useCallback(() => {
        setCurrentIndex(prev => (prev === products.length - 1 ? 0 : prev + 1));
    }, [products.length]);

    useEffect(() => {
        if (products.length <= 1 || paused) return;
        const timer = setInterval(advance, 7000);
        return () => clearInterval(timer);
    }, [products.length, paused, advance]);

    if (!products || products.length === 0) return null;

    const p = products[currentIndex];
    const title = p.title || (p as any).name || '';
    const categoryName =
        (p as any).categoryData?.name ||
        (typeof p.category === 'object' ? (p.category as any)?.name : p.category) ||
        '';
    const slug = (p as any).slug || p.id;

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            await addToCart(p as any, 1);
            toast.success(`${title} añadido al carrito`);
        } catch {
            toast.error('Error al añadir al carrito');
        } finally {
            setAdding(false);
        }
    };

    return (
        <section
            className="relative w-full bg-zinc-950 overflow-hidden min-h-[520px] lg:min-h-[680px] flex items-center"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* ── Retro background layers ── */}
            <div className="absolute inset-0 retro-grid opacity-60 pointer-events-none" />
            <div className="absolute inset-0 retro-scanlines opacity-30 pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(0,229,255,0.06), transparent), radial-gradient(ellipse 50% 50% at 20% 50%, rgba(100,50,255,0.05), transparent)' }}
            />

            {/* Animated product BG image (blurred) */}
            <AnimatePresence>
                {p.image_url && (
                    <motion.div
                        key={`bg-${p.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `url(${p.image_url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(80px) saturate(0.3)',
                            opacity: 0.07,
                        }}
                    />
                )}
            </AnimatePresence>

            <div className="max-w-[1400px] mx-auto px-5 w-full relative z-10 py-16 lg:py-24">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -60 }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                    >
                        {/* ── Left: Content ── */}
                        <div className="space-y-8 order-2 lg:order-1 text-center lg:text-left">
                            {/* Featured badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-3 justify-center lg:justify-start"
                            >
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-electric-blue/10 border border-electric-blue/20 rounded-full">
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-electric-blue animate-ping" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.35em] text-electric-blue">Selección Destacada</span>
                                </div>
                                {categoryName && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                                        <Tag size={10} className="text-zinc-500" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{categoryName}</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.18 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.88] text-white"
                            >
                                {title}
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.28 }}
                                className="text-zinc-400 text-base lg:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed"
                            >
                                {p.description || 'Componente de alta precisión certificado para reparaciones industriales críticas.'}
                            </motion.p>

                            {/* Price + CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.38 }}
                                className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
                            >
                                {/* Price block */}
                                <div className="flex flex-col items-center lg:items-start">
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Precio Especial</span>
                                    <span className="text-5xl font-black text-white italic tracking-tighter leading-none">
                                        ${(p.price || 0).toLocaleString('es-CL')}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                    {/* Primary CTA */}
                                    <Link
                                        href={`/product/${slug}`}
                                        className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-electric-blue transition-all duration-200 shadow-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] active:scale-95 group"
                                    >
                                        Ver Producto
                                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Link>

                                    {/* Add to cart */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={adding}
                                        className="flex items-center gap-2 px-6 py-4 bg-electric-blue/10 border border-electric-blue/30 text-electric-blue rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-electric-blue hover:text-black transition-all duration-200 disabled:opacity-60 active:scale-95"
                                    >
                                        <ShoppingCart size={15} className={adding ? 'animate-bounce' : ''} />
                                        {adding ? 'Añadiendo...' : 'Añadir'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* ── Right: Product visual ── */}
                        <motion.div
                            initial={{ scale: 0.88, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.08, duration: 0.7, ease: 'easeOut' }}
                            className="relative order-1 lg:order-2 flex items-center justify-center"
                        >
                            {/* Orbit rings */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[340px] h-[340px] border border-white/5 rounded-full animate-spin-slow" />
                                <div className="absolute w-[280px] h-[280px] border border-electric-blue/8 rounded-full" style={{ animation: 'spinSlow 30s linear infinite reverse' }} />
                                <div className="absolute w-[420px] h-[420px] border border-white/3 rounded-full hidden lg:block" />
                            </div>

                            {/* Glow halo */}
                            <div className="absolute inset-10 bg-electric-blue/10 blur-[80px] rounded-full animate-pulse-glow pointer-events-none" />

                            <div className="relative aspect-square w-full max-w-[380px] p-8">
                                {p.image_url ? (
                                    <SafeImage
                                        src={p.image_url}
                                        alt={title}
                                        priority={true}
                                        sizes="(max-width: 768px) 100vw, 380px"
                                        className="object-contain drop-shadow-[0_20px_60px_rgba(0,229,255,0.25)]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Zap size={180} className="text-electric-blue opacity-15 relative z-10 drop-shadow-[0_0_50px_rgba(0,229,255,0.3)]" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Navigation arrows ── */}
            {products.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentIndex(i => (i === 0 ? products.length - 1 : i - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-zinc-900/80 border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:border-electric-blue/30 transition-all backdrop-blur-md"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentIndex(i => (i === products.length - 1 ? 0 : i + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-zinc-900/80 border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:border-electric-blue/30 transition-all backdrop-blur-md"
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
            )}

            {/* ── Dot pagination ── */}
            {products.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
                    {products.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={cn(
                                'h-1.5 rounded-full transition-all duration-400',
                                currentIndex === idx
                                    ? 'w-8 bg-electric-blue shadow-[0_0_8px_rgba(0,229,255,0.6)]'
                                    : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                            )}
                        />
                    ))}
                    {/* Progress bar */}
                    <div className="ml-3 h-[2px] w-16 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            key={currentIndex}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 7, ease: 'linear' }}
                            className="h-full bg-electric-blue/60"
                        />
                    </div>
                </div>
            )}

            {/* Product count chip */}
            <div className="absolute top-6 right-6 z-30 text-[9px] font-mono text-zinc-600 bg-zinc-900/80 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-md">
                {String(currentIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
            </div>
        </section>
    );
};

export default FeaturedBanner;

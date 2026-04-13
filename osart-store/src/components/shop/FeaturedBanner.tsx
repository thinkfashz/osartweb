'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { SafeImage } from '@/components/ui/SafeImage';

interface FeaturedProduct {
    id: string;
    slug?: string;
    title?: string;
    name?: string;
    price?: number;
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
    const { addToCart } = useCart();
    const [paused, setPaused] = useState(false);
    const [adding, setAdding] = useState(false);

    const advance = useCallback(() => {
        setCurrentIndex(prev => (prev === products.length - 1 ? 0 : prev + 1));
    }, [products.length]);

    useEffect(() => {
        if (products.length <= 1 || paused) return;
        const timer = setInterval(advance, 8000);
        return () => clearInterval(timer);
    }, [products.length, paused, advance]);

    if (!products || products.length === 0) return null;

    const p = products[currentIndex];
    const title = p.title || (p as any).name || '';
    const slug = (p as any).slug || p.id;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
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
            className="relative w-full overflow-hidden min-h-screen flex items-center py-24"
            style={{ background: '#0a0a0f' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Aurora background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-20 animate-pulse"
                    style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(100px)' }}
                />
                <div
                    className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(120px)' }}
                />
                <div
                    className="absolute bottom-0 left-1/3 w-[400px] h-[300px] rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #6d28d9 0%, transparent 70%)', filter: 'blur(80px)' }}
                />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="grid lg:grid-cols-2 gap-12 items-center"
                    >
                        {/* Content */}
                        <div className="space-y-8 order-2 lg:order-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400">
                                    PREMIUM SELECTION 2026
                                </span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-7xl lg:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] text-white"
                            >
                                {title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-zinc-400 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed"
                            >
                                {p.description || 'Ingeniería de vanguardia aplicada a componentes electrónicos de alta precisión.'}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                            >
                                <span className="text-5xl font-black text-amber-400 italic tracking-tighter">
                                    ${(p.price || 0).toLocaleString('es-CL')}
                                </span>
                                <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Valor Unitario</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55 }}
                                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                            >
                                <Link
                                    href={`/product/${slug}`}
                                    className="px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-white flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-violet-600/30"
                                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}
                                >
                                    VER PRODUCTO
                                </Link>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={adding}
                                    className="px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-white flex items-center gap-3 hover:scale-105 transition-all border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 disabled:opacity-50"
                                >
                                    <ShoppingCart size={15} />
                                    {adding ? 'Agregando...' : 'Agregar al Carrito'}
                                </button>
                            </motion.div>
                        </div>

                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="order-1 lg:order-2 flex justify-center"
                        >
                            <div className="relative aspect-square w-full max-w-[540px] group">
                                {/* Violet halo */}
                                <div
                                    className="absolute inset-0 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                                    style={{ background: 'radial-gradient(circle at 50% 60%, rgba(139,92,246,0.5) 0%, transparent 65%)', filter: 'blur(40px)' }}
                                />
                                <motion.div
                                    animate={{ y: [0, -14, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="relative w-full h-full"
                                >
                                    <SafeImage
                                        src={p.image_url}
                                        alt={title}
                                        priority={true}
                                        className="object-contain drop-shadow-2xl w-full h-full"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation arrows */}
            {products.length > 1 && (
                <div className="absolute bottom-12 right-10 flex gap-3 z-20">
                    <button
                        onClick={() => setCurrentIndex(i => (i === 0 ? products.length - 1 : i - 1))}
                        className="w-12 h-12 rounded-full border border-violet-500/40 text-violet-400 flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 hover:text-white transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentIndex(i => (i === products.length - 1 ? 0 : i + 1))}
                        className="w-12 h-12 rounded-full border border-violet-500/40 text-violet-400 flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 hover:text-white transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Progress bar */}
            {products.length > 1 && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/5 overflow-hidden">
                    <motion.div
                        key={currentIndex}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 8, ease: 'linear' }}
                        className="h-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                    />
                </div>
            )}
        </section>
    );
};

export default FeaturedBanner;

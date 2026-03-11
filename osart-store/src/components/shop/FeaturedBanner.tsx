'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
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

    return (
        <section
            className="relative w-full bg-background overflow-hidden min-h-[70vh] flex items-center py-20"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="max-w-[1400px] mx-auto px-5 w-full relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="grid lg:grid-cols-2 gap-10 items-center"
                    >
                        {/* Content */}
                        <div className="space-y-8 order-2 lg:order-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-sky-500"
                            >
                                PREMIUM SELECTION 2026
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] text-foreground"
                            >
                                {title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-muted-foreground text-lg max-w-lg mx-auto lg:mx-0"
                            >
                                {p.description || 'Ingeniería de vanguardia aplicada a componentes electrónicos de alta precisión.'}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start"
                            >
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black text-foreground italic tracking-tighter">
                                        ${(p.price || 0).toLocaleString('es-CL')}
                                    </span>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Valor Unitario</span>
                                </div>

                                <Link
                                    href={`/product/${slug}`}
                                    className="bg-sky-500 text-white px-10 py-4 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-sky-500/20"
                                >
                                    DETALLES DEL MODELO
                                    <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                        </div>

                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="order-1 lg:order-2 flex justify-center"
                        >
                            <div className="relative aspect-square w-full max-w-[500px] group">
                                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-sky-500/10 blur-[120px] rounded-full group-hover:bg-sky-500/20 transition-colors" />
                                <SafeImage
                                    src={p.image_url}
                                    alt={title}
                                    priority={true}
                                    className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            {products.length > 1 && (
                <div className="absolute bottom-10 right-10 flex gap-4 z-20">
                    <button
                        onClick={() => setCurrentIndex(i => (i === 0 ? products.length - 1 : i - 1))}
                        className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentIndex(i => (i === products.length - 1 ? 0 : i + 1))}
                        className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Pagination Line */}
            {products.length > 1 && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-foreground/5 overflow-hidden">
                    <motion.div
                        key={currentIndex}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 8, ease: 'linear' }}
                        className="h-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                    />
                </div>
            )}
        </section>
    );
};

export default FeaturedBanner;

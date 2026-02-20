'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FeaturedProduct {
    id: string;
    title: string;
    price: number;
    description?: string;
    image_url?: string;
    metadata?: {
        is_featured?: boolean;
        accent_color?: string;
    };
}

interface FeaturedBannerProps {
    products: FeaturedProduct[];
}

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (products.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
        }, 8000);
        return () => clearInterval(timer);
    }, [products.length]);

    if (!products || products.length === 0) return null;

    const currentProduct = products[currentIndex];

    return (
        <section className="relative w-full bg-zinc-950 overflow-hidden min-h-[500px] lg:min-h-[650px] flex items-center">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,112,243,0.1),transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-10" />
            </div>

            <div className="max-w-[1400px] mx-auto px-5 w-full relative z-10 py-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentProduct.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                    >
                        {/* Content Side */}
                        <div className="space-y-8 order-2 lg:order-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-3 justify-center lg:justify-start"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-electric-blue animate-ping" />
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-electric-blue">Selección Destacada</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] text-white"
                            >
                                {currentProduct.title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-zinc-400 text-lg max-w-lg mx-auto lg:mx-0 font-medium"
                            >
                                {currentProduct.description || "Componente de alta precisión certificado para reparaciones industriales críticas."}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
                            >
                                <div className="flex flex-col items-center lg:items-start">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Precio Especial</span>
                                    <span className="text-4xl font-black text-white italic tracking-tighter">
                                        ${currentProduct.price.toLocaleString('es-CL')}
                                    </span>
                                </div>

                                <Link
                                    href={`/product/${currentProduct.id}`}
                                    className="relative group overflow-hidden px-10 py-5 bg-electric-blue rounded-2xl transition-all hover:scale-105 active:scale-95"
                                >
                                    {/* Neon Button Background Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-100 group-hover:blur-md transition-all duration-300" />
                                    <div className="absolute -inset-1 bg-cyan-400/50 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />

                                    <div className="relative flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs z-10">
                                        Explorar Ahora
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>

                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                                    <ShoppingCart size={16} />
                                    Añadir rápido
                                </button>
                            </motion.div>
                        </div>

                        {/* Visual Side */}
                        <div className="relative order-1 lg:order-2">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 1 }}
                                className="relative aspect-square flex items-center justify-center p-8 lg:p-16"
                            >
                                {/* Decorative Circles */}
                                <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow" />
                                <div className="absolute inset-10 border border-electric-blue/10 rounded-full animate-reverse-spin" />
                                <div className="absolute inset-0 bg-electric-blue/10 blur-[100px] rounded-full animate-pulse" />

                                {currentProduct.image_url ? (
                                    <img
                                        src={currentProduct.image_url}
                                        alt={currentProduct.title}
                                        className="relative z-10 max-h-[400px] object-contain drop-shadow-[0_20px_50px_rgba(0,112,243,0.3)]"
                                    />
                                ) : (
                                    <Zap size={200} className="text-electric-blue opacity-20 relative z-10" />
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pagination / Dots */}
            {products.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                    {products.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={cn(
                                "h-1.5 transition-all duration-500 rounded-full",
                                currentIndex === idx ? "w-10 bg-electric-blue shadow-[0_0_10px_rgba(0,112,243,0.5)]" : "w-1.5 bg-zinc-800 hover:bg-zinc-700"
                            )}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default FeaturedBanner;

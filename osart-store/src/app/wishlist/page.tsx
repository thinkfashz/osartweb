'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Loader2, Zap, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/shop/ProductCard';

export default function WishlistPage() {
    const { wishlist, loading } = useWishlist();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
                <Loader2 className="animate-spin text-electric-blue" size={48} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
                    Accediendo a Memoria de Hardware...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-12 sm:pt-20">

                {/* Header */}
                <div className="mb-12 sm:mb-20">
                    <Link
                        href="/catalog"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-electric-blue transition-colors mb-8 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Retornar al Nodo de Suministro
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Heart size={16} className="text-electric-blue" fill="currentColor" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-electric-blue">Almacenamiento Local</span>
                            </div>
                            <h1 className="text-5xl sm:text-8xl font-black uppercase italic tracking-tighter leading-none text-white">
                                Hardware <span className="text-electric-blue">Reservado</span>
                            </h1>
                            <div className="flex items-center gap-4 pl-1">
                                <div className="h-px w-12 bg-white/10" />
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                    Status: {wishlist.length} Items Sincronizados
                                </span>
                            </div>
                        </div>

                        {wishlist.length > 0 && (
                            <div className="hidden sm:flex items-center gap-4 py-3 px-5 bg-white/5 border border-white/10 rounded-xl">
                                <Zap size={16} className="text-electric-blue" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                    Disponibilidad Crítica Monitoreada
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    {wishlist.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center justify-center py-32 sm:py-48 text-center space-y-8"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-electric-blue/10 blur-[60px] rounded-full" />
                                <PackageSearch size={80} className="text-zinc-800 relative z-10" />
                            </div>
                            <div className="space-y-4 max-w-md mx-auto">
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">No se detecta Hardware Guardado</h2>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-loose">
                                    Tu terminal de favoritos está vacío. Explora el catálogo industrial para reservar componentes críticos.
                                </p>
                            </div>
                            <Link href="/catalog" className="neon-button px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] italic">
                                Sincronizar Catálogo
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {wishlist.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <ProductCard product={item.product || item} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Technical Bottom Accent */}
                <div className="mt-32 pt-10 border-t border-white/5 flex justify-between items-center opacity-30 pointer-events-none">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="w-1 h-3 bg-white/20" />
                        ))}
                    </div>
                    <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-zinc-500">
                        OSART_WISH_SUBSYSTEM_SYNC_COMPLETE
                    </span>
                </div>
            </div>
        </div>
    );
}

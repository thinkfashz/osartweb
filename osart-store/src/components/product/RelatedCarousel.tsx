'use client';

import { motion } from 'framer-motion';
import { Product } from '@/lib/graphql/types';
import Link from 'next/link';
import { ShoppingCart, ArrowRight } from 'lucide-react';

interface RelatedCarouselProps {
    products: Product[];
    onAddToCart: (p: Product) => void;
}

export function RelatedCarousel({ products, onAddToCart }: RelatedCarouselProps) {
    if (!products || products.length === 0) return null;

    // Duplicate items for seamless loop
    const displayProducts = [...products, ...products, ...products];

    return (
        <div className="space-y-10 py-20 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
                    Componentes Relacionados
                </h2>
                <Link href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 flex items-center gap-2">
                    Ver Todo el Catálogo
                    <ArrowRight size={14} />
                </Link>
            </div>

            <div className="relative">
                <motion.div
                    animate={{ x: [0, -2000] }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex gap-8 px-6"
                >
                    {displayProducts.map((p, i) => (
                        <div
                            key={`${p.id}-${i}`}
                            className="w-80 flex-shrink-0 bg-white border border-slate-100 rounded-3xl p-6 group transition-all hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5"
                        >
                            <div className="aspect-square bg-slate-50 rounded-2xl mb-6 flex items-center justify-center p-8 transition-transform group-hover:scale-105">
                                {p.images?.[0]?.url ? (
                                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-slate-200"><ShoppingCart size={64} /></div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    {p.brand || 'Osart Grade'}
                                </div>
                                <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 line-clamp-1">
                                    {p.name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-black text-slate-900 italic">${p.price.toLocaleString()}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onAddToCart(p)}
                                            className="p-3 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                        <Link
                                            href={`/product/${p.slug}`}
                                            className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                                        >
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Gradient overlays for polish */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10" />
            </div>
        </div>
    );
}

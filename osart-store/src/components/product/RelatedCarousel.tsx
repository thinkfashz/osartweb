'use client';

import { motion } from 'framer-motion';
import { Product } from '@/lib/graphql/types';
import Link from 'next/link';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

interface RelatedCarouselProps {
    products: Product[];
    onAddToCart: (p?: any) => void;
}

export function RelatedCarousel({ products, onAddToCart }: RelatedCarouselProps) {
    if (!products || products.length === 0) return null;

    // Duplicate items for seamless loop
    const displayProducts = [...products, ...products, ...products];

    return (
        <div className="space-y-10 py-20 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 flex items-end justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Sistemas Sincronizados</span>
                    </div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                        Componentes Relacionados
                    </h2>
                </div>
                <Link href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 transition-colors group">
                    VER TODO <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
                            className="w-80 flex-shrink-0 bg-zinc-900 border border-white/5 rounded-3xl p-6 group transition-all hover:border-sky-500/40 relative overflow-hidden"
                        >
                            <div className="aspect-square bg-[#0a0a0a] rounded-2xl mb-6 flex items-center justify-center p-8 transition-transform group-hover:scale-105 border border-white/5 relative">
                                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/10" />
                                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/10" />

                                <SafeImage 
                                    src={p.images?.[0]?.url} 
                                    alt={p.name} 
                                    className="w-full h-full object-contain relative z-10" 
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
                                    {p.brand || 'OSART_GRADE'}
                                </div>
                                <h3 className="text-lg font-black uppercase italic tracking-tighter text-white line-clamp-1 group-hover:text-sky-500 transition-colors">
                                    {p.name}
                                </h3>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-xl font-black text-white italic tracking-tighter">${(p.price || 0).toLocaleString('es-CL')}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onAddToCart(p)}
                                            className="p-3 rounded-xl bg-sky-500 text-black hover:bg-white transition-all shadow-lg shadow-sky-500/20"
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                        <Link
                                            href={`/product/${p.slug}`}
                                            className="p-3 rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all"
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
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10" />
            </div>
        </div>
    );
}

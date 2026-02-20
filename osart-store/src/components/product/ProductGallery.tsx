'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProductImage } from '@/lib/graphql/types';
import { ImageIcon } from 'lucide-react';

interface ProductGalleryProps {
    images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square rounded-3xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-4 border-2 border-dashed border-slate-200">
                <ImageIcon size={64} />
                <p className="text-[10px] font-black uppercase tracking-widest">Sin Imágenes Disponibles</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="aspect-square rounded-[3rem] bg-white border border-slate-200 overflow-hidden relative group">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeIndex}
                        src={images[activeIndex].url}
                        alt="Product"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full object-contain p-12"
                    />
                </AnimatePresence>

                {/* Technical Deco */}
                <div className="absolute top-8 right-8 flex flex-col items-end gap-1 pointer-events-none">
                    <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Scanner Active</div>
                    <div className="w-12 h-[1px] bg-slate-200" />
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={cn(
                            "relative flex-shrink-0 w-24 h-24 rounded-2xl bg-white border-2 transition-all p-2",
                            activeIndex === i
                                ? "border-emerald-500 shadow-lg shadow-emerald-500/10"
                                : "border-slate-100 hover:border-slate-200 opacity-60 hover:opacity-100"
                        )}
                    >
                        <img src={img.url} alt={`Thumbnail ${i}`} className="w-full h-full object-contain" />
                    </button>
                ))}
            </div>
        </div>
    );
}

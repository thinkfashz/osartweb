'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProductImage } from '@/lib/graphql/types';
import { ImageIcon, Maximize2 } from 'lucide-react';

interface ProductGalleryProps {
    images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square rounded-2xl bg-zinc-900/50 flex flex-col items-center justify-center text-zinc-700 gap-4 border border-dashed border-white/10">
                <ImageIcon size={64} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sin imágenes en el búfer</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="aspect-square rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden relative group">
                {/* Structural Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-electric-blue/40 z-20" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-electric-blue/40 z-20" />

                {/* Image Stage */}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeIndex}
                        src={images[activeIndex].url}
                        alt="Component View"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full object-contain p-8 lg:p-12 relative z-10 opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                </AnimatePresence>

                {/* Technical Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                <div className="absolute top-6 right-6 flex flex-col items-end gap-1.5 pointer-events-none z-20">
                    <div className="text-[7px] font-mono text-electric-blue uppercase tracking-[0.4em] bg-black/60 px-2 py-0.5 rounded-sm backdrop-blur-md">
                        CAM_ACTIVE_CH_{activeIndex + 1}
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 z-20">
                    <button className="p-3 bg-black/60 hover:bg-electric-blue text-white transition-all rounded-lg border border-white/10 backdrop-blur-md group/btn">
                        <Maximize2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={cn(
                            "relative flex-shrink-0 w-20 h-20 rounded-xl bg-zinc-900 border transition-all p-1 overflow-hidden group",
                            activeIndex === i
                                ? "border-electric-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                                : "border-white/5 hover:border-white/20 opacity-40 hover:opacity-100"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
                        <img src={img.url} alt={`View ${i + 1}`} className="w-full h-full object-contain relative z-10" />
                        {activeIndex === i && (
                            <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-electric-blue animate-pulse z-20" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

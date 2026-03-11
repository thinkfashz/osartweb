'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as LucideImage, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductImage } from '@/lib/graphql/types';
import { SafeImage } from '@/components/ui/SafeImage';

interface ProductGalleryProps {
    images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square rounded-2xl bg-zinc-900/50 flex flex-col items-center justify-center text-zinc-700 gap-4 border border-dashed border-white/10 text-readability">
                <LucideImage size={64} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sin imágenes en el búfer</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-readability">
            <div className="aspect-square rounded-[24px] md:rounded-[32px] bg-[#050505] border border-white/5 overflow-hidden relative group shadow-2xl">
                {/* Structural Accents */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-sky-500/20 z-20 rounded-tl-[32px]" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-sky-500/20 z-20 rounded-br-[32px]" />

                {/* Image Stage */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full p-6 lg:p-8 relative z-10"
                    >
                        <SafeImage
                            src={images[activeIndex].url}
                            alt={`Product View ${activeIndex + 1}`}
                            containerClassName="rounded-2xl"
                            priority={true}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Technical Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />

                <div className="absolute top-8 right-8 flex flex-col items-end gap-2 pointer-events-none z-20">
                    <div className="text-[8px] font-mono text-sky-500 font-bold uppercase tracking-[0.5em] bg-black/80 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                        CAM_CH_{activeIndex + 1}
                    </div>
                </div>

                <div className="absolute bottom-8 left-8 z-20">
                    <button className="w-12 h-12 flex items-center justify-center bg-black/80 hover:bg-sky-500 text-white transition-all rounded-2xl border border-white/10 backdrop-blur-md group/btn shadow-xl active:scale-90">
                        <Maximize2 size={20} className="group-hover/btn:scale-120 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 no-scrollbar">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={cn(
                            "relative flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[20px] bg-zinc-900 border-2 transition-all p-1.5 md:p-2 overflow-hidden group",
                            activeIndex === i
                                ? "border-sky-500 shadow-[0_0_25px_rgba(0,240,255,0.2)] bg-zinc-900"
                                : "border-white/5 hover:border-white/20 opacity-40 hover:opacity-100 bg-transparent"
                        )}
                    >
                        <SafeImage src={img.url} alt={`View ${i + 1}`} containerClassName="rounded-xl" />
                        {activeIndex === i && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-500 animate-pulse z-20 shadow-[0_0_8px_rgba(0,240,255,1)]" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

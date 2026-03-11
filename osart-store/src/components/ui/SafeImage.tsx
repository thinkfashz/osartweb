'use client';

import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'srcSet' | 'sizes'> {
    src?: string | null;
    alt?: string;
    fallbackIconSize?: number;
    fallbackClassName?: string;
    containerClassName?: string;
    priority?: boolean;
    sizes?: string;
}

export function SafeImage({
    src,
    alt,
    className,
    fallbackIconSize = 40,
    fallbackClassName,
    containerClassName,
    priority = false,
    sizes = "(max-width: 768px) 100vw, 400px",
    ...props
}: SafeImageProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (!src || hasError) {
        return (
            <div className={cn("w-full h-full flex flex-col items-center justify-center gap-3 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-600", containerClassName, fallbackClassName)}>
                <Package size={fallbackIconSize} className="group-hover:text-sky-500/50 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest px-4 text-center opacity-50">
                    {hasError ? 'Imagen No Disponible' : 'Sin Imagen'}
                </span>
            </div>
        );
    }

    return (
        <div className={cn("relative w-full h-full overflow-hidden bg-zinc-900/20 group/safe-img", containerClassName)}>
            {/* Loading / Shimmer Layer */}
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-200/10 dark:via-white/5 to-transparent shimmer-animate" />
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-2 border-sky-500/10 animate-ping" />
                        <div className="relative w-full h-full rounded-full border-t-2 border-sky-500 animate-spin" />
                    </div>
                </div>
            )}

            <Image
                src={src}
                alt={alt || 'Product Image'}
                fill
                priority={priority}
                sizes={sizes}
                className={cn(
                    'object-contain transition-all duration-700',
                    className,
                    isLoading ? 'opacity-0 scale-90 blur-xl' : 'opacity-100 scale-100 blur-0'
                )}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />

            {/* Subtle Gradient Overlays for depth */}
            {!isLoading && !hasError && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover/safe-img:opacity-100 transition-opacity duration-500" />
            )}
        </div>
    );
}

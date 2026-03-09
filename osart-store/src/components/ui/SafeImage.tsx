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
            <div className={cn("w-full h-full flex flex-col items-center justify-center gap-3 bg-zinc-900/60 text-zinc-700", containerClassName, fallbackClassName)}>
                <Package size={fallbackIconSize} className="group-hover:text-electric-blue/50 transition-colors" />
                <span className="text-[9px] font-mono uppercase tracking-widest px-4 text-center">
                    {hasError ? 'Imagen no disponible' : 'Sin imagen'}
                </span>
            </div>
        );
    }

    return (
        <div className={cn("relative w-full h-full overflow-hidden bg-zinc-900/20 group/safe-img", containerClassName)}>
            {/* Shimmer / Skeleton Layer */}
            {isLoading && (
                <div className="absolute inset-0 z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent shimmer-animate" />
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="w-12 h-12 rounded-full border border-electric-blue/10 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-t-2 border-electric-blue animate-spin opacity-40" />
                        </div>
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
                    'object-contain p-4 lg:p-8 transition-all duration-700 transition-opacity',
                    className,
                    isLoading ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
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

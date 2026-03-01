'use client';

import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackIconSize?: number;
    fallbackClassName?: string;
    containerClassName?: string;
}

export function SafeImage({
    src,
    alt,
    className,
    fallbackIconSize = 40,
    fallbackClassName,
    containerClassName,
    ...props
}: SafeImageProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Si no hay src desde el principio, mostramos el fallback de inmediato
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
        <div className={cn("relative w-full h-full overflow-hidden", containerClassName)}>
            {/* Loading skeleton */}
            {isLoading && (
                <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-electric-blue/30 border-t-electric-blue animate-spin" />
                </div>
            )}

            <img
                {...props}
                src={src}
                alt={alt || 'Product Image'}
                className={cn(className, isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100')}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />
        </div>
    );
}

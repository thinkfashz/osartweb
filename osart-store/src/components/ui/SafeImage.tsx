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
        <div className={cn("relative w-full h-full overflow-hidden", containerClassName)}>
            {isLoading && (
                <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-electric-blue/30 border-t-electric-blue animate-spin" />
                </div>
            )}

            <Image
                src={src}
                alt={alt || 'Product Image'}
                fill
                priority={priority}
                sizes={sizes}
                className={cn('object-cover', className, isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100')}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />
        </div>
    );
}

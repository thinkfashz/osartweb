"use client";

import React from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface ProductImageProps {
    src?: string | null;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    priority?: boolean;
}

export default function ProductImage({
    src,
    alt,
    size = 'md',
    className = "",
    priority = false
}: ProductImageProps) {
    const [error, setError] = React.useState(false);

    const sizeClasses = {
        sm: "w-8 h-8 rounded-lg",
        md: "w-12 h-12 rounded-xl",
        lg: "w-20 h-20 rounded-2xl",
        xl: "w-full aspect-square rounded-[2rem]"
    };

    const iconSizes = {
        sm: 14,
        md: 18,
        lg: 24,
        xl: 48
    };

    if (!src || error) {
        return (
            <div className={`
                ${sizeClasses[size]} 
                bg-zinc-50 border border-zinc-100 
                flex items-center justify-center 
                text-zinc-300 shrink-0
                ${className}
            `}>
                <Package size={iconSizes[size]} strokeWidth={1.5} />
            </div>
        );
    }

    return (
        <div className={`
            ${sizeClasses[size]} 
            relative overflow-hidden 
            bg-zinc-100 border border-zinc-100 
            shrink-0
            ${className}
        `}>
            <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                className="object-cover transition-transform duration-500 hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setError(true)}
            />
        </div>
    );
}

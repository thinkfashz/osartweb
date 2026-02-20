'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye, Star } from 'lucide-react';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    image?: string;
    brand?: string;
    slug: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    name,
    price,
    compareAtPrice,
    image,
    brand,
    slug,
}) => {
    const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : null;

    return (
        <div className="group glass border-white/5 hover:border-electric-blue/30 transition-all duration-500 overflow-hidden flex flex-col h-full">
            {/* Product Image Wrapper */}
            <div className="relative aspect-square overflow-hidden bg-zinc-900/30">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                        <ShoppingCart size={64} className="text-white" />
                    </div>
                )}

                {/* Badge */}
                {discount && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-electric-blue text-bg-dark text-[10px] font-bold rounded uppercase">
                        -{discount}%
                    </div>
                )}

                {/* Quick Actions overlay */}
                <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link
                        href={`/product/${slug}`}
                        className="w-10 h-10 bg-white text-bg-dark rounded-full flex items-center justify-center hover:bg-electric-blue transition-colors"
                    >
                        <Eye size={20} />
                    </Link>
                    <button className="w-10 h-10 bg-electric-blue text-bg-dark rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                {brand && (
                    <span className="text-[10px] uppercase tracking-widest text-electric-blue font-bold mb-1">
                        {brand}
                    </span>
                )}

                <Link href={`/product/${slug}`} className="hover:text-electric-blue transition-colors">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight">
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < 4 ? "text-yellow-500 fill-yellow-500" : "text-zinc-700"} />
                    ))}
                    <span className="text-xs text-text-muted ml-1">(12)</span>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold text-white">
                            ${price.toLocaleString('es-CL')}
                        </span>
                        {compareAtPrice && (
                            <span className="text-xs text-text-muted line-through">
                                ${compareAtPrice.toLocaleString('es-CL')}
                            </span>
                        )}
                    </div>

                    <button className="p-2 bg-zinc-900 border border-white/10 rounded-lg text-text-secondary hover:text-electric-blue hover:border-electric-blue transition-all">
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useToggleWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/graphql/types';
import { toast } from 'sonner';
import { SafeImage } from '@/components/ui/SafeImage';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product: rawProduct }) => {
    const product = rawProduct as any;
    const { user } = useAuth();
    const router = useRouter();
    const { addToCart } = useCart();
    const [toggleWishlist] = useToggleWishlist();
    const { wishlist } = useWishlist();
    const [adding, setAdding] = useState(false);

    const isFavorited = wishlist.some((item: any) => item.productId === product.id);
    const imgSrc = product.images?.[0]?.url ?? product.image_url ?? null;
    const isOutOfStock = product.stock === 0 || product.stock_quantity === 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) { toast.error('Sin stock disponible'); return; }
        setAdding(true);
        try {
            await addToCart(product as any, 1);
            toast.success(`${product.name} añadido`);
        } catch {
            toast.error('Error al añadir');
        } finally {
            setAdding(false);
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) { router.push('/login'); return; }
        try {
            await toggleWishlist({ input: { productId: product.id } });
        } catch { /* ignore */ }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative flex flex-col bg-card border border-foreground/5 hover:border-foreground/10 transition-all duration-500 overflow-hidden"
        >
            {/* Image Container with Hover Reveal */}
            <div className="relative aspect-square overflow-hidden bg-muted/20">
                <SafeImage
                    src={imgSrc}
                    alt={product.name}
                    className={cn(
                        'w-full h-full object-cover transition-transform duration-700 ease-[0.23, 1, 0.32, 1]',
                        'group-hover:scale-105',
                        isOutOfStock && 'grayscale opacity-50'
                    )}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {product.discount_tag && (
                        <span className="bg-foreground text-background text-[8px] font-black px-2 py-0.5 uppercase tracking-widest italic">
                            -{product.discount_tag}
                        </span>
                    )}
                </div>

                {/* Wishlist Toggle (Always visible but subtle) */}
                <button
                    onClick={handleToggleWishlist}
                    className={cn(
                        "absolute top-4 right-4 z-20 p-2 rounded-full transition-all duration-300",
                        isFavorited ? "text-red-500" : "text-foreground/40 hover:text-foreground"
                    )}
                >
                    <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                </button>

                {/* Hover Reveal Actions */}
                <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-30">
                    <Link
                        href={`/product/${product.slug}`}
                        className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                    >
                        <Search size={20} />
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={adding || isOutOfStock}
                        className="w-12 h-12 rounded-full bg-electric-blue text-white flex items-center justify-center hover:scale-110 transition-transform active:scale-95 disabled:opacity-50"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                <div className="space-y-1">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        {product.brand || 'OSART_INDUSTRIAL'}
                    </span>
                    <Link href={`/product/${product.slug}`} className="block">
                        <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter leading-tight group-hover:underline transition-all line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-baseline justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-foreground italic tracking-tighter">
                            ${(product.price * 1000).toLocaleString('es-CL')}
                        </span>
                        {product.original_price && (
                            <span className="text-xs text-muted-foreground line-through decoration-red-500/50">
                                ${(product.original_price * 1000).toLocaleString('es-CL')}
                            </span>
                        )}
                    </div>
                    {isOutOfStock && (
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">OUT_OF_STOCK</span>
                    )}
                </div>
            </div>
        </motion.article>
    );
};

export default ProductCard;

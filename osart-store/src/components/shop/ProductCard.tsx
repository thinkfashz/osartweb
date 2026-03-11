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

    // 3D Tilt & Dynamic Glow State
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalize for Tilt (-1 to 1)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20; // Subtle tilt intensity
        const rotateY = (centerX - x) / 20;

        setMousePos({ x, y, rotateX, rotateY } as any);
    };

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
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setMousePos({ x: 0, y: 0, rotateX: 0, rotateY: 0 } as any);
            }}
            animate={{
                rotateX: (mousePos as any).rotateX || 0,
                rotateY: (mousePos as any).rotateY || 0,
                scale: isHovered ? 1.02 : 1,
            }}
            style={{
                transformStyle: 'preserve-3d',
                perspective: 1000
            }}
            className="group relative flex flex-col bg-card rounded-[2.5rem] border border-border hover:border-sky-500/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-sky-500/10"
        >
            {/* Dynamic Cursor Glow */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute pointer-events-none z-0"
                        style={{
                            left: mousePos.x,
                            top: mousePos.y,
                            width: '300px',
                            height: '300px',
                            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                )}
            </AnimatePresence>
            {/* Image Container with Hover Reveal */}
            <div className="relative aspect-square overflow-hidden bg-background/50 flex items-center justify-center">
                {/* Subtle Center Glow */}
                <div className="absolute w-1/2 h-1/2 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

                <SafeImage
                    src={imgSrc}
                    alt={product.name}
                    style={{
                        transform: isHovered
                            ? `translateZ(50px) rotateX(${(mousePos as any).rotateX * 1.5}deg) rotateY(${(mousePos as any).rotateY * 1.5}deg)`
                            : 'translateZ(0px)',
                    }}
                    className={cn(
                        'w-full h-full object-contain p-6 transition-transform duration-500 ease-out',
                        isOutOfStock && 'grayscale opacity-50'
                    )}
                />

                {/* Badges */}
                <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                    {product.discount_tag && (
                        <span className="bg-sky-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-sky-500/20">
                            -{product.discount_tag}
                        </span>
                    )}
                </div>

                {/* Wishlist Toggle */}
                <button
                    onClick={handleToggleWishlist}
                    className={cn(
                        "absolute top-6 right-6 z-20 p-2.5 rounded-xl transition-all duration-300 backdrop-blur-md",
                        isFavorited
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                            : "bg-black/20 text-white/70 hover:text-white hover:bg-black/40"
                    )}
                >
                    <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
                </button>

                {/* Hover Reveal Actions */}
                <div className="absolute inset-0 bg-sky-950/20 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-30">
                    <Link
                        href={`/product/${product.slug}`}
                        className="w-14 h-14 rounded-2xl bg-white text-zinc-900 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-xl"
                    >
                        <Search size={20} />
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={adding || isOutOfStock}
                        className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center hover:scale-110 transition-transform active:scale-95 disabled:opacity-50 shadow-xl shadow-sky-500/20"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-4">
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.25em] text-readability">
                        {product.brand || 'Osart Premium'}
                    </span>
                    <Link href={`/product/${product.slug}`} className="block">
                        <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-sky-500 transition-all line-clamp-1 text-readability">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Precio Hoy</span>
                        <span className="text-2xl font-black text-foreground tracking-tighter text-readability">
                            ${(product.price * 1000).toLocaleString('es-CL')}
                        </span>
                    </div>
                    {isOutOfStock ? (
                        <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[9px] font-black rounded-full uppercase tracking-widest">Sin Stock</span>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
};

export default ProductCard;

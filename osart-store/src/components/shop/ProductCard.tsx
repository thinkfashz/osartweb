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

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
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
            style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            className="group relative flex flex-col bg-[#111118] border border-violet-500/20 rounded-[2rem] overflow-hidden hover:border-violet-500/50 transition-all duration-300 shadow-xl hover:shadow-violet-500/10"
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
                            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-[#0d0d16] flex items-center justify-center">
                <div className="absolute w-1/2 h-1/2 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

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
                <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                    {product.discount_tag && (
                        <span className="bg-amber-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20">
                            -{product.discount_tag}
                        </span>
                    )}
                </div>

                {/* Wishlist Toggle */}
                <button
                    onClick={handleToggleWishlist}
                    className={cn(
                        "absolute top-5 right-5 z-20 p-2.5 rounded-xl transition-all duration-300 backdrop-blur-md",
                        isFavorited
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                            : "bg-violet-900/40 text-white/70 hover:text-white hover:bg-violet-600"
                    )}
                >
                    <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
                </button>

                {/* Hover Reveal Actions */}
                <div className="absolute inset-0 bg-violet-950/20 backdrop-blur-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-30">
                    <Link
                        href={`/product/${product.slug}`}
                        className="w-14 h-14 rounded-2xl bg-white text-zinc-900 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-xl"
                    >
                        <Search size={20} />
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={adding || isOutOfStock}
                        className="w-14 h-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center hover:scale-110 transition-transform active:scale-95 disabled:opacity-50 shadow-xl shadow-violet-600/30"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-3">
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.25em]">
                        {product.brand || 'Osart Premium'}
                    </span>
                    <Link href={`/product/${product.slug}`} className="block">
                        <h3 className="text-base font-black text-white tracking-tight group-hover:text-violet-300 transition-all line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Precio Hoy</span>
                        <span className="text-2xl font-black text-white tracking-tighter">
                            ${(product.price * 1000).toLocaleString('es-CL')}
                        </span>
                    </div>
                    {isOutOfStock ? (
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[9px] font-black rounded-full uppercase tracking-widest border border-amber-500/20">Sin Stock</span>
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={adding || isOutOfStock}
                    className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest w-full mt-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {adding ? 'Agregando...' : 'Agregar al Carrito'}
                </button>
            </div>
        </motion.article>
    );
};

export default ProductCard;

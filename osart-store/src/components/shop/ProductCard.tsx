'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye, Zap, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useToggleWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Product } from '@/lib/graphql/types';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { user } = useAuth();
    const router = useRouter();
    const { addToCart } = useCart();
    const [toggleWishlist] = useToggleWishlist();
    const { wishlist } = useWishlist();

    const isFavorited = wishlist.some((item: any) => item.productId === product.id);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            // Updated to pass product as any to avoid strict interface mismatches if needed, 
            // but the hook should handle the new Product type.
            await addToCart(product as any, 1);
        } catch (err: any) {
            console.error('Error adding to cart:', err);
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }
        try {
            await toggleWishlist({
                variables: {
                    input: {
                        productId: product.id
                    }
                }
            });
        } catch (err) {
            console.error('Error toggling wishlist:', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col bg-zinc-950 border border-white/5 hover:border-electric-blue/40 transition-all duration-300 overflow-hidden"
        >
            {/* Structural Accents */}
            <div className="absolute top-0 right-0 w-8 h-[1px] bg-electric-blue/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-[1px] h-8 bg-electric-blue/40 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Image Stage */}
            <div className="aspect-[4/5] relative bg-[#0a0a0a] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                {/* Crosshair Decor */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10 pointer-events-none" />

                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100 grayscale-[40%] group-hover:grayscale-0"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900/30">
                        <Zap size={40} className="text-zinc-800 group-hover:text-electric-blue/40 transition-colors" />
                    </div>
                )}

                {/* Technical Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                    <div className="space-y-1">
                        <div className="text-[7px] font-mono text-electric-blue/60 uppercase tracking-[0.2em] bg-background/80 px-1.5 py-0.5 rounded-sm backdrop-blur-md">
                            Revision: 1.0.4
                        </div>
                        <div className="text-[7px] font-mono text-white/40 uppercase tracking-[0.2em] px-1.5">
                            SKU-{(product.sku || product.id.slice(0, 8)).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Low Stock Beacon */}
                {product.stock && product.stock < 5 && (
                    <div className="absolute top-4 right-4 z-20">
                        <div className="flex items-center gap-1.5 bg-rose-500/10 text-rose-500 px-2 py-1 rounded-sm border border-rose-500/20 backdrop-blur-md">
                            <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Alerta Stock</span>
                        </div>
                    </div>
                )}

                {/* Hover Quick Actions */}
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-30">
                    <Link
                        href={`/product/${product.slug}`}
                        className="p-3 bg-white text-black hover:bg-electric-blue hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
                    >
                        <Eye size={18} />
                    </Link>
                    <button
                        onClick={handleToggleWishlist}
                        className={cn(
                            "p-3 transition-all transform translate-y-2 group-hover:translate-y-0 delay-75 duration-300",
                            isFavorited ? "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]" : "bg-white text-black hover:bg-rose-100"
                        )}
                    >
                        <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                    </button>
                    <button
                        onClick={handleAddToCart}
                        className="p-3 bg-electric-blue text-white hover:bg-white hover:text-black transition-all transform translate-y-2 group-hover:translate-y-0 delay-100 duration-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>

            {/* Data Sheet */}
            <div className="p-5 flex flex-col flex-grow border-t border-white/5 relative bg-zinc-950">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-electric-blue/80">
                        {product.categoryData?.name || (typeof product.category === 'string' ? product.category : product.category?.name) || 'Standard'}
                    </span>
                    <ShieldCheck size={12} className="text-zinc-800" />
                </div>

                <Link href={`/product/${product.slug}`} className="block mb-6">
                    <h3 className="text-sm font-bold uppercase italic tracking-tighter text-white group-hover:text-electric-blue transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                    <div className="h-px w-0 group-hover:w-full bg-electric-blue/30 transition-all duration-500 mt-1" />
                </Link>

                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <div className="text-[8px] text-zinc-500 font-mono uppercase mb-0.5">Precio de Unidad</div>
                        <div className="text-xl font-black text-white tracking-tighter">
                            ${product.price.toLocaleString('es-CL')}
                        </div>
                    </div>

                    <Link
                        href={`/product/${product.slug}`}
                        className="flex items-center gap-1 text-zinc-500 hover:text-white transition-colors group/link"
                    >
                        <span className="text-[9px] font-black uppercase tracking-widest">Detail</span>
                        <ArrowUpRight size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Visual Divider Bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </motion.div>
    );
};

export default ProductCard;

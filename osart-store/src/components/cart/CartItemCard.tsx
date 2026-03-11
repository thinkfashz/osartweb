'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, Loader2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface CartItemCardProps {
    item: any;
    onUpdateQty: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
    isUpdating: boolean;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQty, onRemove, isUpdating }) => {
    const imageUrl = item.product?.imageUrl || item.product?.images?.[0]?.url || item.product?.images?.[0] || '/placeholder-product.png';

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-500 backdrop-blur-sm"
        >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex p-4 sm:p-5 gap-5 sm:gap-7 relative z-10">
                {/* Product Image Section */}
                <div className="relative group/img flex-shrink-0">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-black rounded-lg overflow-hidden border border-white/10 ring-1 ring-white/5 shadow-2xl">
                        <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover transform scale-100 group-hover/img:scale-110 transition-transform duration-700 ease-out grayscale-[0.2] group-hover/img:grayscale-0"
                            sizes="(max-width: 640px) 96px, 128px"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent transition-colors" />
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-grow flex flex-col justify-between min-w-0 py-1">
                    <div className="space-y-1">
                        <div className="flex justify-between items-start gap-4">
                            <Link
                                href={`/product/${item.product.slug}`}
                                className="group/title inline-flex items-center gap-1.5"
                            >
                                <h3 className="font-black text-base sm:text-xl text-zinc-100 uppercase italic tracking-tighter leading-tight decoration-sky-500/0 group-hover/title:decoration-sky-500/50 underline transition-all duration-300">
                                    {item.product.name}
                                </h3>
                                <ExternalLink size={12} className="text-zinc-500 opacity-0 group-hover/title:opacity-100 -translate-y-1 translate-x-1 group-hover/title:translate-x-0 group-hover/title:translate-y-0 transition-all" />
                            </Link>
                            
                            <button
                                onClick={() => onRemove(item.productId)}
                                className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all p-2 rounded-lg"
                                aria-label="Eliminar"
                            >
                                <Trash2 size={18} strokeWidth={1.5} />
                            </button>
                        </div>
                        
                        <p className="text-[10px] font-bold text-sky-500/70 uppercase tracking-[0.25em] font-mono">
                            SN: {item.productId.slice(0, 8)} | COMP_V2
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-between items-end gap-4 mt-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-1 shadow-inner backdrop-blur-md">
                            <button
                                onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-20"
                            >
                                <Minus size={16} />
                            </button>
                            
                            <div className="w-10 text-center text-sm font-black text-white font-mono">
                                {isUpdating ? (
                                    <Loader2 size={14} className="animate-spin text-sky-500 mx-auto" />
                                ) : (
                                    item.quantity.toString().padStart(2, '0')
                                )}
                            </div>
                            
                            <button
                                onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                                disabled={isUpdating}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Pricing */}
                        <div className="flex flex-col items-end">
                            <div className="text-2xl sm:text-3xl font-black text-white italic tracking-tighter leading-none">
                                <span className="text-sky-500 text-sm align-top mr-1">$</span>
                                {((item.product?.price || 0) * (item.quantity || 0)).toLocaleString('es-CL')}
                            </div>
                            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                <span className="font-mono">${(item.product?.price || 0).toLocaleString('es-CL')}</span> x UNIT
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accent Border Bottom */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-sky-500 group-hover:w-24 transition-all duration-700 ease-out" />
        </motion.div>
    );
};

export default CartItemCard;

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { CartItem } from '@/hooks/useCart';

interface CartItemCardProps {
    item: CartItem;
    onUpdateQty: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
    isUpdating: boolean;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQty, onRemove, isUpdating }) => {
    const imageUrl = (item.product as any).imageUrl || (item.product as any).images?.[0]?.url || (item.product as any).images?.[0] || '/placeholder-product.png';

    return (
        <div className="glass group overflow-hidden border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300">
            <div className="flex p-4 sm:p-5 gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-zinc-950 rounded-lg overflow-hidden border border-white/5 flex-shrink-0">
                    <Image
                        src={imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        sizes="(max-width: 640px) 80px, 112px"
                    />
                </div>

                {/* Product Info */}
                <div className="flex-grow flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-3">
                        <Link
                            href={`/product/${item.product.slug}`}
                            className="font-black text-sm sm:text-lg hover:text-electric-blue transition-colors uppercase italic tracking-tighter truncate"
                        >
                            {item.product.name}
                        </Link>
                        <button
                            onClick={() => onRemove(item.productId)}
                            className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                            aria-label={`Eliminar ${item.product.name} del carrito`}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                        {/* Quantity Controller */}
                        <div className="flex items-center bg-zinc-950 border border-white/10 rounded-lg overflow-hidden">
                            <button
                                onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating}
                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                aria-label="Disminuir cantidad"
                            >
                                <Minus size={14} />
                            </button>
                            <div className="w-8 sm:w-10 text-center text-xs sm:text-sm font-black mono flex items-center justify-center">
                                {isUpdating ? <Loader2 size={12} className="animate-spin text-electric-blue" /> : item.quantity}
                            </div>
                            <button
                                onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                                disabled={isUpdating}
                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                aria-label="Aumentar cantidad"
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        {/* Price Info */}
                        <div className="text-right">
                            <span className="text-lg sm:text-xl font-black text-white italic tracking-tighter">
                                ${((item.product?.price || 0) * (item.quantity || 0)).toLocaleString('es-CL')}
                            </span>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-0.5">
                                ${(item.product?.price || 0).toLocaleString('es-CL')} UNIT
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemCard;

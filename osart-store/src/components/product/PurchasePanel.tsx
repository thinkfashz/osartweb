'use client';

import { useState } from 'react';
import { ShoppingCart, Zap, Package, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/graphql/types';
import { GlowButton } from '@/components/ui/GlowButton';

interface PurchasePanelProps {
    product: Product;
    onAddToCart: (qty: number) => Promise<void>;
    isAdding: boolean;
}

export function PurchasePanel({ product, onAddToCart, isAdding }: PurchasePanelProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(
        product.variants?.[0]?.id || null
    );

    const discount = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    return (
        <div className="space-y-10">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 bg-slate-900/5 text-slate-500 rounded-lg border border-slate-200">
                        {product.brand} - {product.model}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        SKU: {product.sku}
                    </span>
                </div>

                <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-slate-900 mb-6">
                    {product.name}
                </h1>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        {product.compareAtPrice && (
                            <span className="text-sm text-slate-400 line-through font-bold">
                                ${product.compareAtPrice.toLocaleString()}
                            </span>
                        )}
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900 italic">
                                ${product.price.toLocaleString()}
                            </span>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">CLP</span>
                        </div>
                    </div>

                    {discount > 0 && (
                        <div className="bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase italic tracking-widest shadow-lg shadow-rose-500/20">
                            -{discount}% OFF
                        </div>
                    )}
                </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-4 py-6 border-y border-slate-100">
                <div className={cn(
                    "w-3 h-3 rounded-full animate-pulse",
                    product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-rose-500"
                )} />
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                    {product.stock > 10 ? "Stock Garantizado" : product.stock > 0 ? `Bajo Stock (${product.stock} disp.)` : "Sin Stock"}
                </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Cantidad</span>
                <div className="flex items-center w-40 bg-slate-50 rounded-2xl p-1 border border-slate-200">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors font-bold"
                    >-</button>
                    <span className="flex-1 text-center font-black text-sm text-slate-900">{quantity}</span>
                    <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors font-bold"
                    >+</button>
                </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4">
                <GlowButton
                    variant="primary"
                    disabled={product.stock === 0 || isAdding}
                    onClick={() => onAddToCart(quantity)}
                    className="w-full flex items-center justify-center gap-3 py-6"
                >
                    {isAdding ? "Procesando..." : (
                        <>
                            <ShoppingCart size={20} />
                            Añadir al Carrito
                        </>
                    )}
                </GlowButton>

                <button className="w-full flex items-center justify-center gap-3 py-6 rounded-2xl border-2 border-slate-200 text-slate-900 font-black uppercase italic tracking-widest hover:bg-slate-50 transition-all">
                    <Zap size={20} />
                    Comprar Ahora
                </button>
            </div>

            {/* Trust Markers */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500" size={18} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Garantía High-Grade</span>
                </div>
                <div className="flex items-center gap-3">
                    <Package className="text-blue-500" size={18} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Envío Inmediato</span>
                </div>
            </div>
        </div>
    );
}

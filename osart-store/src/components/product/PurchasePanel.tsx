'use client';

import { useState } from 'react';
import { ShoppingCart, Zap, Package, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/graphql/types';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface PurchasePanelProps {
    product: Product;
}

export function PurchasePanel({ product: rawProduct }: PurchasePanelProps) {
    const product = rawProduct as any;
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await addToCart(product as any, quantity);
            toast.success("AGREGADO AL SISTEMA", {
                description: `${product.name} listo para despacho.`
            });
        } catch (err) {
            toast.error("ERROR", {
                description: "No se pudo procesar la solicitud."
            });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-electric-blue">
                        {product.brand || 'OSART_INDUSTRIAL'}
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground">
                        REF_{(product.sku || product.id.slice(0, 6)).toUpperCase()}
                    </span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter leading-[0.85] text-foreground">
                    {product.name}
                </h1>

                <div className="flex flex-col gap-2 pt-4">
                    {product.original_price && (
                        <span className="text-xl font-black text-muted-foreground line-through decoration-red-500/50 italic tracking-tighter">
                            ${(product.original_price * 1000).toLocaleString('es-CL')}
                        </span>
                    )}
                    <div className="flex items-baseline gap-4">
                        <span className="text-7xl font-black text-foreground italic tracking-tighter">
                            ${(product.price * 1000).toLocaleString('es-CL')}
                        </span>
                        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">CLP_NETO</span>
                    </div>
                </div>
            </div>

            {/* Simple Status Grid */}
            <div className="grid grid-cols-2 gap-px bg-foreground/5 border-y border-foreground/5 py-8">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">DISPONIBILIDAD</span>
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            (product.stock || product.stock_quantity) > 0 ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                        )} />
                        <span className="text-sm font-black uppercase italic tracking-tighter">
                            {(product.stock || product.stock_quantity) > 0 ? 'STOCK_ACTIVO' : 'SIN_EXISTENCIAS'}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">DESPACHO</span>
                    <div className="flex items-center gap-2 text-electric-blue">
                        <Zap size={14} fill="currentColor" />
                        <span className="text-sm font-black uppercase italic tracking-tighter">EXPRESS_PRIORITY</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-8">
                <div className="flex flex-col lg:flex-row items-stretch gap-4">
                    <div className="flex items-center border border-foreground/10 rounded-full h-20 px-4">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 flex items-center justify-center text-foreground/40 hover:text-foreground transition-all text-2xl font-black"
                        >-</button>
                        <div className="w-16 text-center font-black text-xl text-foreground italic tracking-tighter">{quantity.toString().padStart(2, '0')}</div>
                        <button
                            onClick={() => setQuantity(Math.min(product.stock || product.stock_quantity || 99, quantity + 1))}
                            className="w-12 h-12 flex items-center justify-center text-foreground/40 hover:text-foreground transition-all text-2xl font-black"
                        >+</button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={(product.stock === 0 && product.stock_quantity === 0) || isAdding}
                        className={cn(
                            "flex-grow h-20 flex items-center justify-center gap-4 font-black uppercase italic tracking-tighter text-xl transition-all rounded-full overflow-hidden",
                            (product.stock === 0 && product.stock_quantity === 0)
                                ? "bg-foreground/5 text-foreground/20 cursor-not-allowed"
                                : "bg-foreground text-background hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                        )}
                    >
                        {isAdding ? "PROCESANDO..." : "ADQUIRIR COMPONENTE"}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="h-16 rounded-full border border-foreground/10 flex items-center justify-center gap-3 font-black uppercase italic tracking-widest text-[10px] text-muted-foreground hover:bg-foreground hover:text-background transition-all">
                        <Heart size={16} />
                        FAVORITOS
                    </button>
                    <button className="h-16 rounded-full border border-foreground/10 flex items-center justify-center gap-3 font-black uppercase italic tracking-widest text-[10px] text-muted-foreground hover:bg-foreground hover:text-background transition-all">
                        <Package size={16} />
                        DETALLES
                    </button>
                </div>
            </div>

            {/* Guarantee */}
            <div className="p-8 border-l-4 border-emerald-500 bg-emerald-500/5">
                <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">OSART_PROTECTION_PLAN</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">
                    Certificación de integridad hardware garantizada por 12 meses.
                </p>
            </div>
        </div>
    );
}

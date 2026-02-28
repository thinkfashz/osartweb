'use client';

import { useState } from 'react';
import { ShoppingCart, Zap, Package, ShieldCheck, Heart, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/graphql/types';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface PurchasePanelProps {
    product: Product;
}

export function PurchasePanel({ product }: PurchasePanelProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await addToCart(product as any, quantity);
            toast.success("COMPONENTE SINCRONIZADO", {
                description: `${product.name} añadido al búfer de salida.`
            });
        } catch (err) {
            toast.error("ERROR DE PROTOCOLO", {
                description: "No se pudo añadir el componente al inventario."
            });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] px-2.5 py-1 bg-electric-blue/10 text-electric-blue rounded border border-electric-blue/20 backdrop-blur-md">
                        {product.brand || 'OSART_GENERIC'} // {product.model || 'V1.0'}
                    </span>
                    <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/40">
                        HASH: {(product.sku || product.id.slice(0, 12)).toUpperCase()}
                    </span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] text-white">
                    {product.name}
                </h1>

                <div className="flex items-center gap-6 pt-4">
                    <div className="flex flex-col">
                        <div className="text-[8px] font-mono text-electric-blue/60 uppercase tracking-widest mb-1">Precio Unitario</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white italic tracking-tighter">
                                ${(product.price || 0).toLocaleString('es-CL')}
                            </span>
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">CLP</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-2 gap-4 py-8 border-y border-white/5">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        product.stock > 10 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" :
                            product.stock > 0 ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" :
                                "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]"
                    )} />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/90">Estado de Stock</span>
                        <span className="text-[8px] font-mono text-white/40 uppercase">
                            {product.stock > 0 ? `${product.stock} UNI DISPONIBLES` : "REPOSICIÓN REQUERIDA"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Zap size={16} className="text-electric-blue" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/90">Despacho Priority</span>
                        <span className="text-[8px] font-mono text-white/40 uppercase">ENVÍO EN &lt; 2 HORAS</span>
                    </div>
                </div>
            </div>

            {/* Operational Controls */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                    <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-14 h-14 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all text-xl"
                        >-</button>
                        <div className="w-14 text-center font-mono text-sm text-white">{quantity.toString().padStart(2, '0')}</div>
                        <button
                            onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                            className="w-14 h-14 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all text-xl"
                        >+</button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || isAdding}
                        className={cn(
                            "flex-grow flex items-center justify-center gap-3 px-8 py-4 font-black uppercase italic tracking-widest transition-all rounded-xl relative overflow-hidden group/buy",
                            product.stock === 0
                                ? "bg-zinc-900 text-white/20 border border-white/5 cursor-not-allowed"
                                : "bg-electric-blue text-background hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                        )}
                    >
                        {isAdding ? (
                            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                        ) : (
                            <>
                                <ShoppingCart size={20} className="group-hover/buy:rotate-12 transition-transform" />
                                <span>SINCRONIZAR A PEDIDO</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 py-4 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-white/20 transition-all">
                        <Heart size={14} />
                        FAVORITOS
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-white/20 transition-all">
                        <Package size={14} />
                        GUÍA TÉCNICA
                    </button>
                </div>
            </div>

            {/* Technical Trust Markers */}
            <div className="p-4 bg-zinc-950/50 border border-white/5 rounded-xl flex items-start gap-4 backdrop-blur-md">
                <ShieldCheck className="text-emerald-500 flex-shrink-0" size={18} />
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest">CERTIFICACIÓN OSART_PRO</p>
                    <p className="text-[8px] font-mono text-white/40 uppercase leading-relaxed">
                        Este componente ha pasado las pruebas de conductividad y resistencia antes de ser etiquetado para su distribución.
                    </p>
                </div>
            </div>
        </div>
    );
}

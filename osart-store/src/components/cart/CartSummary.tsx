'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Zap, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface CartSummaryProps {
    subtotal: number;
    discount: number;
    total: number;
    onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, discount, total, onCheckout }) => {
    const shipping = subtotal > 50000 ? 0 : 5000;
    const finalTotal = total + shipping;

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-zinc-950/40 backdrop-blur-2xl p-6 sm:p-8"
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl -z-10" />
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
                    Resumen <span className="text-sky-500 italic">OSART</span>
                </h2>
                <div className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-[9px] font-bold text-sky-400 tracking-widest uppercase">
                    Checkout_V4
                </div>
            </div>

            <div className="space-y-5 mb-10">
                <div className="flex justify-between items-center group/row">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover/row:text-zinc-400 transition-colors">Subtotal Bruto</span>
                    <span className="font-mono text-sm font-bold text-zinc-300">${(subtotal || 0).toLocaleString('es-CL')}</span>
                </div>

                {discount > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex justify-between items-center text-emerald-400"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                            <Zap size={12} fill="currentColor" />
                            Cupón Aplicado
                        </span>
                        <span className="font-mono text-sm font-bold">-${(discount || 0).toLocaleString('es-CL')}</span>
                    </motion.div>
                )}

                <div className="flex justify-between items-center group/row">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover/row:text-zinc-400 transition-colors">Logística Express</span>
                        {shipping === 0 && (
                            <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest mt-0.5 animate-pulse">
                                Bonificación Activada
                            </span>
                        )}
                    </div>
                    <span className={`font-mono text-sm font-bold ${shipping === 0 ? 'text-sky-500' : 'text-zinc-300'}`}>
                        {shipping === 0 ? '0.00' : `$${shipping.toLocaleString('es-CL')}`}
                    </span>
                </div>

                <div className="pt-6 mt-4 border-t border-white/10">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Total a Liquidar</span>
                        <div className="flex justify-between items-baseline">
                            <span className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Global</span>
                            <span className="text-4xl font-black text-sky-500 italic tracking-tighter leading-none pulse-glow">
                                ${(finalTotal || 0).toLocaleString('es-CL')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    onClick={onCheckout}
                    className="group relative w-full overflow-hidden rounded-xl bg-sky-500 py-4 font-black uppercase italic tracking-tighter text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] active:scale-[0.98]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="relative flex items-center justify-center gap-3">
                        <span className="text-lg">Confirmar Pedido</span>
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
                
                <p className="text-center text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    IVA Incluido en todos los ítems
                </p>
            </div>

            {/* Badges */}
            <div className="mt-10 space-y-4 pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 group/badge">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-sky-500 group-hover/badge:border-sky-500/30 transition-colors">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-zinc-200 uppercase tracking-widest">Garantía Certificada</p>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Standard OSART Protocol</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 group/badge">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-sky-500 group-hover/badge:border-sky-500/30 transition-colors">
                        <Truck size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-zinc-200 uppercase tracking-widest">Envío Prioritario</p>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Seguimiento Real-Time</p>
                    </div>
                </div>
            </div>

            {/* Hint */}
            {subtotal < 50000 && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-3 rounded-lg bg-sky-500/5 border border-sky-500/10 flex gap-3"
                >
                    <Info size={16} className="text-sky-500 shrink-0" />
                    <p className="text-[9px] font-bold text-zinc-400 uppercase leading-relaxed tracking-wider">
                        Añade ${(50000 - subtotal).toLocaleString('es-CL')} más para activar el <span className="text-sky-500">Envío Bonificado</span>.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default CartSummary;

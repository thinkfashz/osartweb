'use client';

import React from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface StickyCheckoutBarProps {
    total: number;
    itemCount: number;
    onCheckout: () => void;
}

const StickyCheckoutBar: React.FC<StickyCheckoutBarProps> = ({ total, itemCount, onCheckout }) => {
    return (
        <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden px-4 pb-safe-area-inset-bottom pt-4 bg-zinc-950/90 backdrop-blur-2xl border-t border-white/5 shadow-[0_-20px_40px_rgba(0,0,0,0.6)]"
        >
            <div className="max-w-md mx-auto flex items-center justify-between gap-6 py-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <ShoppingCart size={10} className="text-zinc-500" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                            Lote: {itemCount.toString().padStart(2, '0')}_UNT
                        </span>
                    </div>
                    <span className="text-2xl font-black text-white italic tracking-tighter leading-none pulse-glow">
                        <span className="text-sky-500 text-xs align-top mr-1 font-sans font-bold">$</span>
                        {(total || 0).toLocaleString('es-CL')}
                    </span>
                </div>

                <button
                    onClick={onCheckout}
                    className="group relative overflow-hidden rounded-xl bg-sky-500 px-8 py-4 text-sm font-black uppercase italic tracking-tighter text-black transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <div className="relative flex items-center gap-2">
                        <span>Pagar</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
            </div>
        </motion.div>
    );
};

export default StickyCheckoutBar;

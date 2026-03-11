'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Hammer, ArrowRight, PackageOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyCartState: React.FC = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-5 py-24 sm:py-32 text-center relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full -z-10" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative inline-block mb-12"
            >
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-zinc-900/50 rounded-3xl flex items-center justify-center border border-white/5 relative z-10 backdrop-blur-sm">
                    <PackageOpen size={64} className="text-zinc-800" strokeWidth={1} />
                </div>
                <motion.div 
                    animate={{ rotate: [12, 15, 12] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 w-14 h-14 bg-sky-500 rounded-xl flex items-center justify-center shadow-2xl shadow-sky-500/20 z-20"
                >
                    <Hammer size={28} className="text-black" />
                </motion.div>
                
                {/* Decorative Rings */}
                <div className="absolute inset-0 border border-sky-500/10 rounded-3xl scale-110 -z-10 animate-pulse" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-5xl sm:text-7xl font-black mb-6 uppercase italic tracking-tighter leading-none">
                    Línea <span className="text-sky-500">Inactiva</span>
                </h1>

                <p className="text-zinc-500 mb-12 max-w-sm mx-auto uppercase text-[10px] font-bold tracking-[0.3em] leading-relaxed">
                    Sistemas en espera. No se han detectado <br />
                    requerimientos de hardware en el manifiesto actual.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        href="/catalog" 
                        className="group relative overflow-hidden rounded-xl bg-sky-500 px-10 py-5 text-sm font-black uppercase italic tracking-tighter text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="relative z-10 flex items-center gap-3">
                            Abastecer Inventario
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                    
                    <Link 
                        href="/" 
                        className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        Volver al Inicio
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default EmptyCartState;

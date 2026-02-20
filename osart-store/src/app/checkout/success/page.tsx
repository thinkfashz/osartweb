'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const SuccessPage = () => {
    return (
        <div className="container py-20 flex flex-col items-center justify-center min-h-[70vh]">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-10 border border-green-500/20"
            >
                <CheckCircle2 size={64} className="text-green-500" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center space-y-4 mb-12"
            >
                <h1 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter text-white">Pedido Confirmado</h1>
                <p className="text-text-secondary max-w-md mx-auto">Tu orden ha sido procesada exitosamente. Recibirás un correo con el detalle de tu compra y el código de seguimiento.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="glass p-8 w-full max-w-xl border-white/5 bg-zinc-900/30"
            >
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-white/5">
                            <Package size={24} className="text-electric-blue" />
                        </div>
                        <div>
                            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Nº de Orden</p>
                            <p className="text-sm font-bold">#OSART-{Math.floor(Math.random() * 100000)}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors">
                            <Download size={16} />
                            Boleta PDF
                        </button>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12 flex flex-wrap gap-6 justify-center"
            >
                <Link href="/" className="neon-button px-12 py-4">Volver al Inicio</Link>
                <Link href="/catalog" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-muted hover:text-electric-blue transition-colors group">
                    Seguir Comprando <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
        </div>
    );
};

export default SuccessPage;

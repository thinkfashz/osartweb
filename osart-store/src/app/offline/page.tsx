"use client";

import React from 'react';
import { WifiOff, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center mb-8 border border-zinc-800"
            >
                <WifiOff className="text-zinc-500" size={32} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">
                    Sin Conexión
                </h1>
                <p className="text-zinc-400 max-w-sm mb-12 text-sm leading-relaxed">
                    Parece que has perdido la conexión a internet. Esta página no está disponible sin conexión, pero puedes volver al inicio o intentar recargar.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4 w-full max-w-xs"
            >
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-black text-xs uppercase italic tracking-widest rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/10"
                >
                    <RefreshCcw size={16} />
                    Reintentar
                </button>
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-zinc-400 font-black text-xs uppercase italic tracking-widest rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-all active:scale-95"
                >
                    <Home size={16} />
                    Regresar al Inicio
                </Link>
            </motion.div>

            {/* Aesthetic Background Grid */}
            <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_800px_at_50%_-100px,#1a1a1a,transparent)]" />
        </div>
    );
}

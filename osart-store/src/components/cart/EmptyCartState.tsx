'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Hammer, ArrowRight } from 'lucide-react';

const EmptyCartState: React.FC = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-5 py-24 text-center">
            <div className="relative inline-block mb-10">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 relative z-10">
                    <ShoppingCart size={48} className="text-zinc-700" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20 rotate-12 z-20">
                    <Hammer size={24} className="text-black" />
                </div>
                <div className="absolute inset-0 bg-sky-500/5 blur-3xl rounded-full scale-150" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-black mb-6 uppercase italic tracking-tighter">
                Inventario <span className="text-sky-500">Vacio</span>
            </h1>

            <p className="text-muted-foreground mb-12 max-w-sm mx-auto uppercase text-xs font-bold tracking-[0.2em] leading-relaxed">
                Tu línea de ensamblaje está detenida. <br />
                Explora nuestro catálogo industrial para continuar.
            </p>

            <Link href="/catalog" className="neon-button inline-flex items-center gap-3">
                Ver Catálogo
                <ArrowRight size={20} />
            </Link>
        </div>
    );
};

export default EmptyCartState;

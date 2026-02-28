'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StickyCheckoutBarProps {
    total: number;
    itemCount: number;
    onCheckout: () => void;
}

const StickyCheckoutBar: React.FC<StickyCheckoutBarProps> = ({ total, itemCount, onCheckout }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-safe-area-inset-bottom pt-4 bg-zinc-950/90 backdrop-blur-xl border-t border-white/10 safe-area-px">
            <div className="max-w-md mx-auto flex items-center justify-between gap-4 py-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {itemCount} {itemCount === 1 ? 'Producto' : 'Productos'}
                    </span>
                    <span className="text-xl font-black text-electric-blue italic tracking-tighter">
                        ${(total || 0).toLocaleString('es-CL')}
                    </span>
                </div>

                <button
                    onClick={onCheckout}
                    className="neon-button py-3 px-6 flex items-center gap-2 text-sm"
                >
                    Checkout
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default StickyCheckoutBar;

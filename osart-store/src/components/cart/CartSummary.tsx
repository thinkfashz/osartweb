'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';

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
        <div className="glass p-6 sm:p-8 bg-zinc-950/80 border-electric-blue/20 backdrop-blur-xl">
            <h2 className="text-xl font-black mb-6 pb-4 border-b border-white/5 uppercase italic tracking-tighter">
                Orden de Servicio
            </h2>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Subtotal Bruto</span>
                    <span className="font-mono font-bold text-white">${(subtotal || 0).toLocaleString('es-CL')}</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Descuento Aplicado</span>
                        <span className="font-mono font-bold">-${(discount || 0).toLocaleString('es-CL')}</span>
                    </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Logística / Envío</span>
                    <span className={`font-mono font-bold ${shipping === 0 ? 'text-electric-blue' : 'text-white'}`}>
                        {shipping === 0 ? 'BONIFICADO' : `$${shipping.toLocaleString('es-CL')}`}
                    </span>
                </div>

                <div className="pt-4 mt-2 border-t border-white/5">
                    <div className="flex justify-between text-white">
                        <span className="text-2xl font-black uppercase italic tracking-tighter">Total</span>
                        <span className="text-3xl font-black text-electric-blue italic tracking-tighter">
                            ${(finalTotal || 0).toLocaleString('es-CL')}
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={onCheckout}
                className="neon-button w-full flex items-center justify-center gap-2 py-4 shadow-lg group"
            >
                <span>Confirmar Pedido</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
                    <ShieldCheck size={16} className="text-electric-blue shrink-0" />
                    <span>Garantía de Hardware OSART</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
                    <Truck size={16} className="text-electric-blue shrink-0" />
                    <span>Seguimiento en Tiempo Real</span>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;

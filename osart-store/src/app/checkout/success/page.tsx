'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const provider = searchParams.get('provider');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            if (!containerRef.current) return;
            const tl = gsap.timeline();
            tl.fromTo('.success-icon', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' })
              .fromTo('.success-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
              .fromTo('.success-card', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
              .fromTo('.success-actions', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.1');
        })();
    }, []);

    return (
        <div ref={containerRef} className="py-20 flex flex-col items-center justify-center min-h-[70vh] px-6">
            <div className="success-icon opacity-0 w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-10 border border-emerald-500/20">
                <CheckCircle2 size={64} className="text-emerald-500" />
            </div>

            <div className="success-title opacity-0 text-center space-y-4 mb-12">
                <h1 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter">Pedido Confirmado</h1>
                <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                    Tu orden ha sido procesada exitosamente. Recibirás un correo con el detalle de tu compra.
                    {provider === 'mercadopago' && ' Pago procesado vía MercadoPago.'}
                </p>
            </div>

            {orderId && (
                <div className="success-card opacity-0 glass p-8 w-full max-w-xl border-white/5 bg-zinc-900/30 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-white/5">
                                <Package size={24} className="text-sky-500" />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Nº de Orden</p>
                                <p className="text-sm font-mono font-bold text-white">#OSART-{orderId.slice(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">
                            {provider ? `vía ${provider}` : ''}
                        </div>
                    </div>
                </div>
            )}

            <div className="success-actions opacity-0 mt-4 flex flex-wrap gap-6 justify-center">
                <Link href="/" className="neon-button px-12 py-4">Volver al Inicio</Link>
                <Link href="/catalog" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-sky-500 transition-colors group">
                    Seguir Comprando <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

export default SuccessPage;

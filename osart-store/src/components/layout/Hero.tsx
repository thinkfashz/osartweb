'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Zap, ShieldCheck, Box } from 'lucide-react';
import { motion } from 'framer-motion';

const floatVariants = (delay = 0, amplitude = 20) => ({
    animate: {
        y: [0, -amplitude, 0],
        transition: {
            duration: 4 + delay,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay
        },
    },
});

const Hero = () => {
    return (
        <section className="relative w-full py-24 lg:py-36 overflow-hidden bg-background">

            {/* ── Retro illuminated background ── */}
            <div className="absolute inset-0 retro-grid pointer-events-none" />
            <div className="absolute inset-0 retro-glow-bg pointer-events-none" />
            <div className="absolute inset-0 retro-scanlines opacity-40 pointer-events-none" />

            {/* Deep corner glows */}
            <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-electric-blue/10 blur-[140px] rounded-full pointer-events-none -mr-40 -mt-20 animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-purple-600/8 blur-[120px] rounded-full pointer-events-none -ml-20 -mb-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-electric-blue/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Floating orbit ring — desktop only */}
            <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] hidden xl:block pointer-events-none">
                <div className="absolute inset-0 border border-electric-blue/10 rounded-full animate-spin-slow" />
                <div className="absolute inset-8 border border-electric-blue/6 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
                <div className="absolute inset-20 border border-white/5 rounded-full" />
            </div>

            <div className="max-w-[1200px] mx-auto px-5 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* ── Text Content ── */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-electric-blue/10 border border-electric-blue/20 rounded-full backdrop-blur-md"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-electric-blue neon-glow animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-electric-blue">Nuevo Stock: Componentes iPhone 15</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.div
                            initial={{ opacity: 0, y: 36 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="space-y-4"
                        >
                            <h1 className="text-5xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.88] text-foreground">
                                La Energía{' '}
                                <br />
                                <span className="text-electric-blue neon-text">Que Mueve</span>{' '}
                                <br />
                                Tus Arreglos
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed font-medium">
                                Repuestos electrónicos de alta fidelidad para servicios técnicos exigentes.
                                Suministros industriales con despacho express en todo Chile.
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.25 }}
                            className="flex flex-wrap gap-4 pt-2"
                        >
                            <Link href="/catalog" className="neon-button px-10 py-4 flex items-center gap-3 group font-black text-xs">
                                Explorar Catálogo
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/services" className="px-10 py-4 border border-border hover:border-electric-blue/40 hover:bg-electric-blue/5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-foreground">
                                Precios Mayoristas
                            </Link>
                        </motion.div>

                        {/* Quick Benefits */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.45 }}
                            className="pt-8 grid grid-cols-3 gap-6 border-t border-border"
                        >
                            {[
                                { icon: ShieldCheck, label: 'Garantía Total' },
                                { icon: Zap, label: 'Envío Hoy' },
                                { icon: Box, label: 'Stock Real' },
                            ].map(({ icon: Icon, label }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="space-y-2 group"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center text-electric-blue group-hover:bg-electric-blue/20 transition-all">
                                        <Icon size={18} />
                                    </div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{label}</h4>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── Right Visual ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                        className="relative hidden lg:flex items-center justify-center"
                    >
                        {/* Main card */}
                        <div className="relative w-[380px] h-[380px] glass rounded-[3rem] border-electric-blue/10 flex items-center justify-center overflow-hidden group">
                            {/* Animated shimmer sweep */}
                            <div className="absolute inset-0 animate-shimmer opacity-50 pointer-events-none" />

                            {/* Orbit rings inside */}
                            <div className="absolute inset-6 border border-electric-blue/10 rounded-full animate-spin-slow" />
                            <div className="absolute inset-14 border border-electric-blue/6 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />

                            {/* Center bolt icon */}
                            <div className="relative z-10 text-center space-y-4">
                                <div className="relative inline-block">
                                    <Zap size={110} className="text-electric-blue opacity-15 blur-2xl absolute inset-0 m-auto" />
                                    <Zap size={110} className="text-electric-blue relative z-10 drop-shadow-[0_0_30px_rgba(0,229,255,0.4)]" />
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-electric-blue opacity-70 block">High-Tech Suministros</span>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter mt-1 text-foreground">Osart Precision®</h3>
                                </div>
                            </div>
                        </div>

                        {/* Floating accent chips */}
                        <motion.div {...floatVariants(0)} className="absolute -top-4 -right-8 z-20">
                            <div className="bg-background border border-electric-blue/25 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Stock Live</span>
                            </div>
                        </motion.div>

                        <motion.div {...floatVariants(1.5, 16)} className="absolute -bottom-4 -left-8 z-20">
                            <div className="bg-background border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center gap-3">
                                <Zap size={18} className="text-electric-blue" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Express 2h</span>
                            </div>
                        </motion.div>

                        <motion.div {...floatVariants(0.8, 12)} className="absolute top-1/2 -right-16 -translate-y-1/2 z-20">
                            <div className="bg-background border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
                                <ShieldCheck size={20} className="text-emerald-400" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

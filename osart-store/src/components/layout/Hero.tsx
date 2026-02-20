'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Zap, ShieldCheck, CreditCard, Box } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-background">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-electric-blue/5 blur-[120px] rounded-full pointer-events-none -mr-40" />
            <div className="absolute -bottom-20 -left-20 w-1/3 h-1/2 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-[1200px] mx-auto px-5 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-electric-blue animate-pulse neon-glow" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Nuevo Stock: Componentes iPhone 15</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="space-y-4"
                        >
                            <h1 className="text-5xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
                                La Energía <br />
                                <span className="text-electric-blue neon-text">Que Mueve</span> <br />
                                Tus Arreglos
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed font-medium">
                                Repuestos electrónicos de alta fidelidad para servicios técnicos exigentes.
                                Suministros industriales con despacho express en todo Chile.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-wrap gap-4 pt-4"
                        >
                            <Link href="/catalog" className="neon-button px-10 py-4 flex items-center gap-3 group">
                                Explorar Catálogo
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/services" className="px-10 py-4 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                                Precios Mayoristas
                            </Link>
                        </motion.div>

                        {/* Quick Benefits */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="pt-10 grid grid-cols-3 gap-6 border-t border-white/5"
                        >
                            <div className="space-y-2">
                                <ShieldCheck size={20} className="text-electric-blue" />
                                <h4 className="text-[10px] font-bold uppercase tracking-widest">Garantía Total</h4>
                            </div>
                            <div className="space-y-2">
                                <Zap size={20} className="text-electric-blue" />
                                <h4 className="text-[10px] font-bold uppercase tracking-widest">Envío Hoy</h4>
                            </div>
                            <div className="space-y-2">
                                <Box size={20} className="text-electric-blue" />
                                <h4 className="text-[10px] font-bold uppercase tracking-widest">Stock Real</h4>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Element / Product Spotlight */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="aspect-square glass rounded-[40px] border-white/10 flex items-center justify-center p-20 relative overflow-hidden group">
                            {/* Inner circle decor */}
                            <div className="absolute inset-0 border-[0.5px] border-electric-blue/20 rounded-full scale-150 group-hover:scale-125 transition-transform duration-1000" />
                            <div className="absolute inset-20 border-[0.5px] border-electric-blue/10 rounded-full group-hover:animate-spin-slow" />

                            <div className="relative text-center space-y-6">
                                <div className="relative">
                                    <Zap size={140} className="text-electric-blue opacity-10 blur-xl absolute inset-0 m-auto" />
                                    <Zap size={140} className="text-electric-blue relative z-10" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-electric-blue opacity-60">High-Tech Suministros</span>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mt-2">Osart Precision®</h3>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-10 bg-zinc-950 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl"
                            >
                                <CreditCard size={24} className="text-electric-blue opacity-50" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-20 left-10 bg-zinc-950 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl"
                            >
                                <Box size={24} className="text-electric-blue opacity-50" />
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Hero;

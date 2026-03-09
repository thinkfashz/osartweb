'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const Hero = () => {
    const { theme } = useTheme();

    return (
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-5">
            {/* Background elements that adapt to theme */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 retro-grid" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
            </div>

            <div className="max-w-[1200px] w-full mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* Minimalist Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse shadow-[0_0_8px_var(--electric-blue)]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/70">
                            OSART_INDUSTRIAL_SYSTEM_V4.0
                        </span>
                    </div>

                    {/* Massive Bold Heading */}
                    <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
                        Precision <br />
                        <span className="text-electric-blue outline-text">Electronics</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="max-w-2xl text-lg md:text-xl text-muted-foreground font-medium leading-relaxed mt-4">
                        Componentes de alta fidelidad para servicios técnicos de élite.
                        Ingeniería táctica aplicada a cada reparación.
                    </p>

                    {/* Minimalist Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
                        <Link
                            href="/catalog"
                            className="bg-foreground text-background px-12 py-5 rounded-full font-black uppercase italic tracking-tighter text-sm hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
                        >
                            EXPLORAR CATÁLOGO
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/about"
                            className="text-foreground border-b-2 border-foreground/20 hover:border-foreground transition-all py-2 font-black uppercase tracking-widest text-[10px]"
                        >
                            NUESTRA MISIÓN
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Subtle decorative text */}
            <div className="absolute bottom-10 left-10 hidden lg:block opacity-10 select-none">
                <span className="text-[100px] font-black italic uppercase tracking-tighter leading-none">OSART</span>
            </div>

            <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block vertical-text opacity-10 select-none rotate-180">
                <span className="text-[10px] font-black uppercase tracking-[1em]">SYSTEM_STABILITY_V4.02</span>
            </div>

            <style jsx>{`
                .outline-text {
                    -webkit-text-stroke: 2px currentColor;
                    color: transparent;
                }
                [data-theme="red"] .outline-text {
                    -webkit-text-stroke: 2px white;
                }
                .vertical-text {
                    writing-mode: vertical-rl;
                }
            `}</style>
        </section>
    );
};

export default Hero;

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useStorefront } from '@/context/StorefrontContext';

const Hero = () => {
    const { theme } = useTheme();
    const { settings } = useStorefront();

    // Split title to keep the italic style on 'Mueve' if present, otherwise just show it
    const renderTitle = () => {
        const parts = settings.hero_title.split(/(Mueve)/i);
        return parts.map((part, i) =>
            part.toLowerCase() === 'mueve'
                ? <span key={i} className="text-sky-500 italic" style={{ color: settings.primary_color }}>{part}</span>
                : part
        );
    };

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-32 px-5 bg-white dark:bg-zinc-950">
            {/* Rondón Animado: Background logic */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-sky-200/40 dark:bg-sky-900/10 blur-[120px] rounded-full"
                    style={{ backgroundColor: `${settings.primary_color}40` }}
                />
                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 60, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[20%] right-[10%] w-[25%] h-[25%] bg-cyan-200/30 dark:bg-cyan-900/10 blur-[100px] rounded-full"
                    style={{ backgroundColor: `${settings.secondary_color}30` }}
                />
            </div>

            <div className="max-w-[1200px] w-full mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* Modern Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 dark:bg-sky-500/5 border border-sky-500/20 rounded-full" style={{ borderColor: `${settings.primary_color}33`, backgroundColor: `${settings.primary_color}1a` }}>
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" style={{ backgroundColor: settings.primary_color, boxShadow: `0 0 10px ${settings.primary_color}` }} />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-600 dark:text-sky-400" style={{ color: settings.primary_color }}>
                            OSART DIGITAL SYSTEMS 2026
                        </span>
                    </div>

                    {/* Massive Bold Heading */}
                    <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.9] text-zinc-900 dark:text-white max-w-4xl text-center">
                        {renderTitle()}
                    </h1>

                    {/* Subheadline */}
                    <p className="max-w-xl text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mt-6 text-center whitespace-pre-line">
                        {settings.hero_subtitle}
                    </p>

                    {/* Premium Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
                        <Link
                            href="/catalog"
                            className="bg-sky-500 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 hover:bg-sky-600 transition-all flex items-center gap-3 active:scale-95 shadow-2xl shadow-sky-500/30"
                            style={{ backgroundColor: settings.primary_color, boxShadow: `0 20px 40px ${settings.primary_color}4d` }}
                        >
                            Ver Catálogo Completo
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/about"
                            className="text-zinc-900 dark:text-white px-12 py-5 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                        >
                            Nuestra Misión
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

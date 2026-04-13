'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStorefront } from '@/context/StorefrontContext';
import { useGSAPMount } from '@/hooks/useGSAP';

const STATS = [
    { value: '1000+', label: 'Clientes' },
    { value: '99%', label: 'Calidad' },
    { value: '6 Meses', label: 'Garantía' },
];

const Hero = () => {
    const { settings } = useStorefront();
    const heroRef = useGSAPMount({ y: 50, duration: 1, delay: 0.1 });

    const renderTitle = () => {
        const parts = settings.hero_title.split(/(Mueve)/i);
        return parts.map((part, i) =>
            part.toLowerCase() === 'mueve'
                ? <span key={i} className="text-violet-400 italic">{part}</span>
                : part
        );
    };

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-32 px-5 bg-[#0a0a0f]">
            {/* Aurora background layers */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Primary violet aurora */}
                <motion.div
                    animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-[5%] left-[5%] w-[45%] h-[45%] rounded-full blur-[140px]"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)' }}
                />
                {/* Purple mid-layer */}
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, 70, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    className="absolute bottom-[15%] right-[5%] w-[40%] h-[40%] rounded-full blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.2) 0%, transparent 70%)' }}
                />
                {/* Amber accent glow */}
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-[40%] right-[25%] w-[20%] h-[20%] rounded-full blur-[80px]"
                    style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }}
                />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Content */}
            <div ref={heroRef} className="max-w-[1200px] w-full mx-auto relative z-10">
                <div className="flex flex-col items-center gap-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-400">
                            OSART DIGITAL SYSTEMS 2026
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.9] text-white max-w-4xl">
                        {renderTitle()}
                    </h1>

                    {/* Subheadline */}
                    <p className="max-w-xl text-base md:text-lg text-zinc-400 font-medium leading-relaxed mt-4 whitespace-pre-line">
                        {settings.hero_subtitle}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-2 md:gap-8 mt-6 flex-wrap justify-center">
                        {STATS.map(({ value, label }, i) => (
                            <React.Fragment key={label}>
                                <div className="flex flex-col items-center gap-0.5">
                                    <span className="text-2xl md:text-3xl font-black text-white">{value}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</span>
                                </div>
                                {i < STATS.length - 1 && (
                                    <div className="w-px h-10 bg-violet-500/20 hidden md:block" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
                        {/* Primary: violet gradient */}
                        <Link
                            href="/catalog"
                            className="group relative px-10 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs text-white overflow-hidden transition-all active:scale-95 hover:scale-105 shadow-2xl shadow-violet-500/30"
                            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)' }}
                        >
                            <span className="relative z-10 flex items-center gap-2.5">
                                Ver Catálogo Completo
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
                        </Link>

                        {/* Secondary: glass */}
                        <Link
                            href="/about"
                            className="px-10 py-4 border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/40 text-white/80 hover:text-white rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all active:scale-95 backdrop-blur-sm"
                        >
                            <span className="flex items-center gap-2">
                                <Zap size={14} className="text-amber-400" />
                                Nuestra Misión
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative watermark */}
            <div className="absolute bottom-10 left-10 hidden lg:block opacity-[0.04] select-none pointer-events-none">
                <span className="text-[100px] font-black italic uppercase tracking-tighter leading-none text-white">OSART</span>
            </div>
            <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block opacity-[0.04] select-none pointer-events-none" style={{ writingMode: 'vertical-rl' }}>
                <span className="text-[10px] font-black uppercase tracking-[1em] text-white">SYSTEM_STABILITY_V4.02</span>
            </div>
        </section>
    );
};

export default Hero;

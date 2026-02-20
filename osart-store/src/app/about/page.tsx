'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Award, TrendingUp, Cpu, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="flex flex-col w-full bg-background overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-40 border-b border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,112,243,0.1),transparent_70%)]" />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                <div className="max-w-[1200px] mx-auto px-5 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center text-center space-y-6"
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.5em] text-electric-blue">Trayectoria Industrial</span>
                        <h1 className="text-5xl lg:text-8xl font-black tracking-tighter uppercase italic leading-none text-white">
                            7+ Años de <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-cyan-400">Excelencia</span>
                        </h1>
                        <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl leading-relaxed">
                            Desde nuestros inicios hasta convertirnos en un referente global, OSART ha sido el motor de miles de reparaciones exitosas.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats/Metrics Bar */}
            <section className="bg-zinc-950 border-b border-white/5 py-12">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: "Años de Experiencia", value: "07+", icon: <Award size={20} /> },
                            { label: "Repuestos Vendidos", value: "50k+", icon: <TrendingUp size={20} /> },
                            { label: "Países Alcanzados", value: "15+", icon: <Globe size={20} /> },
                            { label: "Soporte Técnico", value: "24/7", icon: <Cpu size={20} /> },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center lg:items-start space-y-2 border-l border-white/10 pl-6"
                            >
                                <div className="text-electric-blue flex items-center gap-2 mb-1">
                                    {stat.icon}
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</span>
                                </div>
                                <span className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 lg:py-40 relative">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <span className="text-xs font-bold uppercase tracking-[0.4em] text-electric-blue">Nuestra Evolución</span>
                                <h2 className="text-4xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">
                                    De Mercado Pago al Mundo
                                </h2>
                            </div>
                            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                                <p>
                                    Comenzamos hace más de 7 años con una visión clara: democratizar el acceso a repuestos electrónicos de alta precisión. Durante años, consolidamos nuestra reputación en plataformas como <span className="text-white font-bold">Mercado Pago</span>, convirtiéndonos en líderes de confianza a nivel nacional.
                                </p>
                                <p>
                                    Hoy, damos el salto definitivo. Con nuestra propia tienda web, eliminamos fronteras para llegar a cualquier rincón del planeta. Ya no somos solo un proveedor local; somos el aliado estratégico de técnicos y entusiastas en todo el mundo.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="glass px-6 py-4 flex items-center gap-3">
                                    <CreditCard className="text-electric-blue" size={24} />
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Partner Histórico</span>
                                        <span className="text-sm font-bold text-white">Mercado Pago Certified</span>
                                    </div>
                                </div>
                                <div className="glass px-6 py-4 flex items-center gap-3">
                                    <Globe className="text-electric-blue" size={24} />
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Alcance Actual</span>
                                        <span className="text-sm font-bold text-white">Logística Global Directa</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -inset-10 bg-electric-blue/10 blur-[100px] rounded-full -z-10" />
                            <div className="glass aspect-square flex items-center justify-center p-8 border-white/5 overflow-hidden">
                                <div className="relative w-full h-full flex items-center justify-center">
                                    {/* Industrial decoration */}
                                    <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow opacity-20" />
                                    <div className="absolute inset-8 border border-electric-blue/20 rounded-full animate-reverse-spin opacity-40" />
                                    <Cpu size={120} className="text-white/10" />
                                    <div className="absolute text-center">
                                        <span className="text-6xl font-black text-white italic tracking-tighter">GLOBAL</span>
                                        <span className="block text-xs font-bold tracking-[0.8em] text-electric-blue mt-2">NETWORK</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-zinc-950 border-y border-white/5">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-xs font-bold uppercase tracking-[0.5em] text-electric-blue">Filosofía OSART</span>
                        <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase italic text-white">Nuestro Compromiso</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass p-10 space-y-6 hover:border-electric-blue/30 transition-all group">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-electric-blue border border-white/10 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold uppercase italic tracking-tight text-white">Calidad Certificada</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Cada componente que sale de OSART pasa por un riguroso control de calidad industrial. No vendemos copias, vendemos soluciones.
                            </p>
                        </div>
                        <div className="glass p-10 space-y-6 hover:border-electric-blue/30 transition-all group">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-electric-blue border border-white/10 group-hover:scale-110 transition-transform">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-xl font-bold uppercase italic tracking-tight text-white">Velocidad Extrema</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Entendemos que el tiempo es dinero para tu taller. Por eso optimizamos nuestra logística para despachos inmediatos a todo el mundo.
                            </p>
                        </div>
                        <div className="glass p-10 space-y-6 hover:border-electric-blue/30 transition-all group">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-electric-blue border border-white/10 group-hover:scale-110 transition-transform">
                                <Globe size={28} />
                            </div>
                            <h3 className="text-xl font-bold uppercase italic tracking-tight text-white">Visión Sin Fronteras</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Nuestra meta es que cualquier pieza, sin importar cuán rara sea, esté al alcance de un click desde cualquier continente.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 lg:py-40 relative overflow-hidden">
                <div className="absolute inset-0 bg-electric-blue/5 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-blue/10 blur-[120px] rounded-full animate-pulse" />
                </div>

                <div className="max-w-[800px] mx-auto px-5 text-center relative z-10 space-y-10">
                    <h2 className="text-4xl lg:text-7xl font-black tracking-tighter uppercase italic leading-tight text-white">
                        Únete a la Revolución del <span className="text-electric-blue underline decoration-white/10 underline-offset-8">Hardware</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Estamos listos para potenciar tus reparaciones hoy mismo. Explora nuestro catálogo y descubre por qué somos la elección de los profesionales.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/catalog" className="neon-button px-12 py-5 text-sm uppercase tracking-widest font-black italic">
                            Explorar Catálogo
                        </Link>
                        <Link href="/register" className="glass px-12 py-5 text-sm uppercase tracking-widest font-bold text-white hover:bg-white/5 transition-all">
                            Crear Cuenta Pro
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

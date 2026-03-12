'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Cpu, ShieldCheck, Award, Zap } from 'lucide-react';
import ElectronicsGame from '@/components/game/ElectronicsGame';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AcademyPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-sky-500 selection:text-black">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 mb-20 text-readability">
                        <div className="space-y-6 max-w-2xl">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-500 text-[10px] font-black uppercase tracking-[0.2em]"
                            >
                                <Sparkles size={12} />
                                Centro de Entrenamiento OSART
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl sm:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]"
                            >
                                OSART <span className="text-sky-500">Academy</span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-zinc-500 text-sm sm:text-base font-bold uppercase tracking-widest leading-relaxed"
                            >
                                Forjando la próxima generación de ingenieros en hardware industrial. 
                                Domina los componentes, acumula XP y desbloquea el máximo potencial del sistema.
                            </motion.p>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-2 gap-4 w-full lg:w-auto"
                        >
                            {[
                                { icon: BookOpen, label: 'Teoría V2', val: '+500 XP' },
                                { icon: Cpu, label: 'Identificación', val: 'PRÁCTICA' },
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-zinc-900 border border-white/5 rounded-2xl space-y-3">
                                    <item.icon size={24} className="text-sky-500" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.label}</span>
                                        <span className="text-sm font-black text-white italic tracking-tighter uppercase">{item.val}</span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Game Section */}
                    <div className="relative mb-32">
                        {/* Decorative background glow */}
                        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/5 blur-[150px] -z-10" />
                        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/5 blur-[150px] -z-10" />
                        
                        <ElectronicsGame />
                    </div>

                    {/* Reward Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                title: "Sincronización de Perfil",
                                desc: "Tus puntajes se guardan automáticamente en tu registro de operario.",
                                icon: ShieldCheck
                            },
                            {
                                title: "Niveles de Acceso",
                                desc: "A medida que aprendas, desbloquearás insignias y rangos exclusivos.",
                                icon: Award
                            },
                            {
                                title: "Próximos Desafíos",
                                desc: "Nuevos módulos de entrenamiento próximamente: Micro-soldadura y Diseño de PCB.",
                                icon: Zap
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 bg-zinc-900/40 border border-white/5 rounded-3xl space-y-4 hover:border-sky-500/20 transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-lg font-black uppercase italic tracking-tighter">{item.title}</h3>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
            
            <Footer />
        </main>
    );
}

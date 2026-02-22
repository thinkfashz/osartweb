'use client';

import React from 'react';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import { Settings, Shield, Zap, Database, Save } from 'lucide-react';
import { GlowButton } from '@/components/admin/ui/GlowButton';

export default function SettingsPage() {
    return (
        <PageTransition>
            <div className="space-y-6 md:space-y-10 pb-20">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 shadow-sm transition-all duration-300">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                            <Settings size={14} />
                            Configuración de Núcleo
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter uppercase italic text-zinc-950 leading-tight">Ajustes del Sistema</h1>
                    </div>

                    <GlowButton className="py-4 px-8 h-12 md:h-16 text-[9px] md:text-[10px] rounded-xl md:rounded-2xl w-full lg:w-auto shadow-lg shadow-blue-500/10">
                        <Save size={16} className="mr-3" />
                        GUARDAR CONFIGURACIÓN
                    </GlowButton>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className="bg-white border border-zinc-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 space-y-8 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-950 flex items-center gap-3">
                            <Shield size={18} className="text-emerald-500" />
                            Seguridad y Accesos
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-zinc-50/50 p-4 md:p-6 rounded-2xl border border-zinc-100/50">
                                <div className="min-w-0 pr-4">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-950 truncate">Autenticación Multifactor</p>
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Requerido para administradores</p>
                                </div>
                                <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1 shrink-0 cursor-pointer shadow-inner">
                                    <div className="w-4 h-4 bg-white rounded-full translate-x-6 shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 space-y-8 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-950 flex items-center gap-3">
                            <Zap size={18} className="text-blue-500" />
                            Rendimiento Global
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-zinc-50/50 p-4 md:p-6 rounded-2xl border border-zinc-100/50">
                                <div className="min-w-0 pr-4">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-950 truncate">Modo de Alta Velocidad</p>
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Optimizar consultas GraphQL</p>
                                </div>
                                <div className="w-12 h-6 bg-zinc-200 rounded-full flex items-center px-1 shrink-0 cursor-pointer shadow-inner">
                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

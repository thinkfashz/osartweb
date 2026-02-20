'use client';

import React from 'react';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import { Zap, RefreshCcw, Database, Cloud, AlertCircle } from 'lucide-react';
import { GlowButton } from '@/components/admin/ui/GlowButton';

export default function SyncPage() {
    return (
        <PageTransition>
            <div className="space-y-10 pb-20">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                            <Zap size={14} />
                            Puente de Datos OSART
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-zinc-950">Sincronización</h1>
                    </div>

                    <GlowButton className="py-4 px-8 h-14 text-[10px] rounded-2xl">
                        <RefreshCcw size={16} className="mr-3" />
                        FORZAR SYNC TOTAL
                    </GlowButton>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-zinc-950 p-10 rounded-[2.5rem] text-white relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                                    <Cloud size={24} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Servicio Cloud Activo</p>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Latencia Zero-Touch</h3>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                    <span>Sincronización de Base de Datos</span>
                                    <span>Listo</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-950 mb-8 flex items-center gap-3">
                                <RefreshCcw size={18} className="text-zinc-400" />
                                Historial de Sincronía
                            </h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <p className="text-[10px] font-bold text-zinc-950 uppercase tracking-widest">Update Master {i}</p>
                                        </div>
                                        <p className="text-[9px] font-bold text-zinc-400">Hace {i * 15} min</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-sm space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-950 border-l-4 border-blue-500 pl-4">Estado de Red</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <Database size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Database Link</p>
                                    <p className="text-lg font-black uppercase italic tracking-tighter text-zinc-950">Estable</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

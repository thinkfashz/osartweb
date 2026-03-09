"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, Globe, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase-auth';

export const SupabaseStatusPanel = () => {
    const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
    const [latency, setLatency] = useState<number | null>(null);

    useEffect(() => {
        const checkConnection = async () => {
            const start = performance.now();
            try {
                const { error } = await supabase.from('profiles').select('count').limit(1);
                const end = performance.now();

                if (error) throw error;

                setLatency(Math.round(end - start));
                setStatus('online');
            } catch (err) {
                console.error("Supabase Connection Error:", err);
                setStatus('offline');
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 30000); // Check every 30s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="saas-glass dark:saas-glass-dark rounded-[2.5rem] p-8 border border-white/40 dark:border-zinc-800/50 shadow-2xl h-full flex flex-col justify-between overflow-hidden relative group">
            {/* Animated Grid Decoration */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--saas-primary)_1px,_transparent_1px)] bg-[size:16px_16px]" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="p-3 bg-sky-50 dark:bg-sky-500/10 rounded-2xl text-sky-600">
                        <Database size={20} />
                    </div>
                    <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border ${status === 'online'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                        : status === 'offline'
                            ? 'bg-red-50 border-red-100 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
                            : 'bg-zinc-50 border-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:border-zinc-700'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {status === 'online' ? 'Sincronizado' : status === 'offline' ? 'Desconectado' : 'Validando'}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap size={16} className="text-zinc-400" />
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Latencia</span>
                        </div>
                        <span className="text-sm font-black font-mono">{latency ? `${latency}ms` : '--'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Globe size={16} className="text-zinc-400" />
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Región</span>
                        </div>
                        <span className="text-sm font-black">AWS-East-1</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Cpu size={16} className="text-zinc-400" />
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Protocolo</span>
                        </div>
                        <span className="text-sm font-black">HTTPS/GQL</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/30 relative z-10">
                <div className="flex items-center gap-3 p-4 bg-sky-600 rounded-2xl shadow-lg shadow-sky-600/20 group-hover:scale-[1.02] transition-transform cursor-pointer">
                    <CheckCircle2 size={18} className="text-white" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Ver Historial de Commit</span>
                </div>
            </div>
        </div>
    );
}

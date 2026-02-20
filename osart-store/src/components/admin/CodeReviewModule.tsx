'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, AlertCircle, CheckCircle2, Search, Filter, ShieldAlert, Cpu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DiagnosticError {
    id: string;
    type: 'error' | 'performance' | 'connection';
    message: string;
    line?: string;
    file?: string;
    solution: string;
    timestamp: string;
}

const CodeReviewModule = () => {
    const [errors, setErrors] = useState<DiagnosticError[]>([]);
    const [filter, setFilter] = useState<'all' | 'error' | 'performance' | 'connection'>('all');

    useEffect(() => {
        // Mocking real-time error detection
        const mockErrors: DiagnosticError[] = [
            {
                id: '1',
                type: 'connection',
                message: 'Latencia elevada detectada en endpoint /api/products',
                solution: 'Implementar SWR o React Query para cacheado agresivo.',
                timestamp: 'Hace 2 min'
            },
            {
                id: '2',
                type: 'error',
                message: 'Uncaught TypeError: cannot read property "name" of undefined',
                line: '154',
                file: 'CatalogPage.tsx',
                solution: 'Añadir encadenamiento opcional (?) en la línea afectada.',
                timestamp: 'Hace 5 min'
            },
            {
                id: '3',
                type: 'performance',
                message: 'Large render overhead en FeaturedBanner',
                solution: 'Usar React.memo() y optimizar las dependencias de useMemo.',
                timestamp: 'Hace 12 min'
            }
        ];
        setErrors(mockErrors);
    }, []);

    const filteredErrors = errors.filter(e => filter === 'all' || e.type === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Code Review & Diagnostics</h2>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Análisis automático y detección de fallas en tiempo real</p>
                </div>
                <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800/50 backdrop-blur-md">
                    {['all', 'error', 'performance', 'connection'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                filter === f ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredErrors.map((error) => (
                        <motion.div
                            key={error.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-zinc-900 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl hover:border-zinc-700 transition-all group"
                        >
                            <div className="flex">
                                <div className={cn(
                                    "w-1.5",
                                    error.type === 'error' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' :
                                        error.type === 'performance' ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' :
                                            'bg-electric-blue shadow-[0_0_20px_rgba(0,210,255,0.3)]'
                                )} />
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {error.type === 'error' && <ShieldAlert size={16} className="text-red-500" />}
                                            {error.type === 'performance' && <Zap size={16} className="text-amber-500" />}
                                            {error.type === 'connection' && <Cpu size={16} className="text-electric-blue" />}
                                            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500">{error.type}</span>
                                        </div>
                                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{error.timestamp}</span>
                                    </div>

                                    <h3 className="text-base font-bold text-white mb-3 tracking-tight">{error.message}</h3>

                                    {error.file && (
                                        <div className="flex items-center gap-2 mb-6">
                                            <Terminal size={14} className="text-zinc-600" />
                                            <code className="text-[11px] font-mono text-electric-blue bg-electric-blue/5 border border-electric-blue/10 px-2 py-0.5 rounded">
                                                {error.file}:{error.line}
                                            </code>
                                        </div>
                                    )}

                                    <div className="bg-black/40 rounded-xl p-5 border border-zinc-800/50 border-dashed relative group/solution overflow-hidden">
                                        <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-zinc-800 rounded-full" />
                                            Protocolo de Resolución
                                        </div>
                                        <p className="text-xs font-medium text-zinc-400 leading-relaxed relative z-10">
                                            {error.solution}
                                        </p>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover/solution:translate-x-full transition-transform duration-1000" />
                                    </div>
                                </div>
                                <div className="px-6 flex items-center justify-center border-l border-zinc-800/30">
                                    <button className="p-3 rounded-full bg-zinc-800/50 text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent transition-all active:scale-90">
                                        <CheckCircle2 size={24} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CodeReviewModule;

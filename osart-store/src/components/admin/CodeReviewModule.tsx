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
                    <h2 className="text-lg font-black uppercase tracking-tighter italic">Code Review & Diagnostics</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Análisis automático y detección de fallos en tiempo real</p>
                </div>
                <div className="flex gap-2">
                    {['all', 'error', 'performance', 'connection'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === f ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"
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
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="flex">
                                <div className={cn(
                                    "w-1.5",
                                    error.type === 'error' ? 'bg-rose-500' :
                                        error.type === 'performance' ? 'bg-amber-500' : 'bg-blue-500'
                                )} />
                                <div className="p-5 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            {error.type === 'error' && <ShieldAlert size={16} className="text-rose-500" />}
                                            {error.type === 'performance' && <Zap size={16} className="text-amber-500" />}
                                            {error.type === 'connection' && <Cpu size={16} className="text-blue-500" />}
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{error.type}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase">{error.timestamp}</span>
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-900 mb-2">{error.message}</h3>

                                    {error.file && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <Terminal size={12} className="text-slate-400" />
                                            <code className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                {error.file}:{error.line}
                                            </code>
                                        </div>
                                    )}

                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 border-dashed">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Solución Sugerida</div>
                                        <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                            {error.solution}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-4 flex items-center justify-center border-l border-slate-50">
                                    <button className="p-2 rounded-full bg-slate-50 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all">
                                        <CheckCircle2 size={20} />
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

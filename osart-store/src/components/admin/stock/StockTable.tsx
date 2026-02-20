"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Plus, History, Package, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockTableProps {
    products: any[];
    onAdjust: (p: any) => void;
}

export default function StockTable({ products, onAdjust }: StockTableProps) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val || 0);

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="p-8 border-b border-slate-50 flex items-center justify-between relative z-10">
                <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-950 flex items-center gap-3">
                        <Package size={20} className="text-slate-400" />
                        Inventario Operativo
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monitoreo de existencias en tiempo real</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 rounded-xl border border-slate-100 hover:bg-slate-950 hover:text-white transition-all shadow-sm">
                        Exportación Global
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Hardware / Identificador</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Categoría</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Nivel Stock</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Estado Crítico</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Valoración</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Terminal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        <AnimatePresence mode='popLayout'>
                            {products.map((p, idx) => {
                                const isLow = p.stock > 0 && p.stock <= 5;
                                const isOut = p.stock <= 0;

                                return (
                                    <motion.tr
                                        key={p.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-slate-50/50 transition-all cursor-default group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{p.name}</span>
                                                <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest mt-0.5">{p.sku || 'SERIAL-PENDING'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-lg bg-slate-50/50">
                                                {p.category?.name || 'Standard'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex items-center justify-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-lg transition-all shadow-inner",
                                                    isOut ? "bg-rose-50 text-rose-600 border border-rose-100" :
                                                        isLow ? "bg-orange-50 text-orange-600 border border-orange-100" :
                                                            "bg-slate-50 text-slate-900 border border-slate-100"
                                                )}>
                                                    {p.stock}
                                                </div>
                                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => onAdjust(p)}
                                                        className="p-1.5 rounded-lg bg-slate-950 text-white hover:bg-blue-600 transition-all shadow-lg active:scale-90"
                                                        title="Ajustar Inventario"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {isOut ? (
                                                <div className="flex items-center gap-2 text-rose-600">
                                                    <ShieldAlert size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Agotado</span>
                                                </div>
                                            ) : isLow ? (
                                                <div className="flex items-center gap-2 text-orange-600">
                                                    <AlertTriangle size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Bajo Stock</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-emerald-600">
                                                    <CheckCircle2 size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Operativo</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="text-sm font-black text-slate-950 italic font-mono">
                                                {formatCurrency(p.price)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-950 hover:text-white transition-all shadow-sm">
                                                    <History size={16} />
                                                </button>
                                                <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                    <Edit2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

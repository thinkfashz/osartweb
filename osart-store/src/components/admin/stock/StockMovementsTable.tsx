'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpRight,
    ArrowDownLeft,
    Equal,
    Calendar,
    FileText,
    Filter,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockMovementsTableProps {
    movements: any[];
    isLoading?: boolean;
}

const StockMovementsTable = ({ movements, isLoading }: StockMovementsTableProps) => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                        <FileText size={20} className="text-slate-400" />
                        Historial de Movimientos
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Registro forense de variaciones de inventario
                    </p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-slate-100 transition-all">
                    <Filter size={14} />
                    Filtrar Logs
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Operación</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Magnitud</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Justificación Técnica</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode='popLayout'>
                            {movements.map((move: any, idx: number) => {
                                const isPositive = move.type === 'in' || (move.type === 'adjust' && move.qty > 0);
                                const isNegative = move.type === 'out' || (move.type === 'adjust' && move.qty < 0);
                                const isNeutral = move.type === 'adjust' && move.qty === 0;

                                return (
                                    <motion.tr
                                        key={move.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-tighter">
                                                <Calendar size={12} />
                                                {new Date(move.createdAt).toLocaleDateString()}
                                                <span className="text-slate-200">|</span>
                                                {new Date(move.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
                                                    isPositive ? "bg-emerald-50 text-emerald-600" :
                                                        isNegative ? "bg-rose-50 text-rose-600" :
                                                            "bg-blue-50 text-blue-600"
                                                )}>
                                                    {isPositive ? <ArrowUpRight size={16} /> :
                                                        isNegative ? <ArrowDownLeft size={16} /> :
                                                            <Equal size={16} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                                        {move.type === 'adjust' ? 'Ajuste de Sistema' :
                                                            move.type === 'in' ? 'Entrada / Reabastecimiento' :
                                                                'Salida / Pedido'}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                        ID REF: {move.id.substring(0, 8)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className={cn(
                                                "font-mono font-bold px-3 py-1 rounded-full text-xs inline-flex items-center gap-1",
                                                isPositive ? "bg-emerald-50 text-emerald-600" :
                                                    isNegative ? "bg-rose-50 text-rose-600" :
                                                        "bg-blue-50 text-blue-600"
                                            )}>
                                                {isPositive ? '+' : ''}{move.qty}
                                                <ArrowRight size={10} className="opacity-40" />
                                                <span className="opacity-70">UNITS</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic max-w-xs truncate">
                                                "{move.reason || 'Sin justificación registrada'}"
                                            </p>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                        {movements.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <FileText size={48} />
                                        <p className="text-sm font-black uppercase tracking-[0.3em]">Sin registros históricos</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockMovementsTable;

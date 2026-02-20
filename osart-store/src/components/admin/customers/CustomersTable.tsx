"use client";

import React from 'react';
import { Mail, Phone, ShoppingBag, ArrowRight, User, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomersTableProps {
    customers: any[];
    onSelect: (id: string) => void;
}

export default function CustomersTable({ customers, onSelect }: CustomersTableProps) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val || 0);

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/[0.02] overflow-hidden relative">
            {/* Ambient Grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="p-8 border-b border-slate-50 flex items-center justify-between relative z-10">
                <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-950 flex items-center gap-3">
                        <User size={20} className="text-slate-400" />
                        Registro de Terminales
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base de datos centralizada de usuarios activos</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200/50 shadow-sm flex items-center gap-2">
                        <Activity size={10} className="text-emerald-500" />
                        {customers.length} Nodos Sincronizados
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Perfil de Usuario</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Canal de Comunicación</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Actividad</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Inversión Logística</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Terminal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        <AnimatePresence mode='popLayout'>
                            {customers.map((c, idx) => (
                                <motion.tr
                                    key={c.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-50/50 transition-all cursor-pointer group"
                                    onClick={() => onSelect(c.id)}
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-white font-black text-lg transition-all shadow-xl shadow-slate-900/10 group-hover:scale-110 group-hover:rotate-3 duration-500">
                                                    {c.fullName?.charAt(0) || 'U'}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-lg border-2 border-white flex items-center justify-center shadow-lg">
                                                    <ShieldCheck size={10} className="text-white" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-950 uppercase tracking-tight group-hover:text-blue-600 transition-colors leading-none mb-1.5">{c.fullName || 'Usuario Anónimo'}</span>
                                                <span className="text-[9px] font-bold text-slate-400 font-mono tracking-widest uppercase">ID NODE: {c.id.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <Mail size={12} />
                                                </div>
                                                {c.email}
                                            </div>
                                            {c.phone && (
                                                <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300">
                                                        <Phone size={12} />
                                                    </div>
                                                    {c.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="bg-slate-50 rounded-2xl px-4 py-2 inline-flex items-center gap-3 border border-slate-100 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                                            <ShoppingBag size={14} className="text-slate-400 group-hover:text-blue-400" />
                                            <span className="text-xs font-black italic">{c.totalOrders || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black text-slate-950 italic font-mono decoration-blue-100 underline decoration-2 underline-offset-4">{formatCurrency(c.totalSpent)}</span>
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1">LTV Optimized</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

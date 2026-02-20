"use client";

import React from 'react';
import {
    LayoutGrid,
    List,
    MoreVertical,
    Edit2,
    Trash2,
    Star,
    CheckCircle2,
    XCircle,
    Package,
    ArrowUpRight,
    Zap,
    ShieldAlert,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminCatalogTable({ products, view }: { products: any[], view: 'table' | 'grid' }) {
    const formatPrice = (val: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val || 0);

    if (view === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence>
                    {products.map((p, idx) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-900/5 transition-all group relative overflow-hidden flex flex-col"
                        >
                            {/* Visual Unit Area */}
                            <div className="aspect-square bg-slate-50 rounded-[2rem] mb-6 overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500">
                                <div className="absolute top-4 right-4 flex gap-2 z-10">
                                    {p.isFeatured && (
                                        <div className="bg-amber-400 text-white p-2 rounded-xl shadow-lg shadow-amber-200 animate-pulse">
                                            <Star size={14} fill="currentColor" />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "p-2 rounded-xl text-white shadow-lg",
                                        p.isActive ? 'bg-emerald-500 shadow-emerald-200' : 'bg-slate-400 shadow-slate-200'
                                    )}>
                                        {p.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                    </div>
                                </div>
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 group-hover:text-slate-900 transition-colors">
                                    <Package size={64} strokeWidth={1} className="mb-2" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">Unidad Enrolada</span>
                                </div>

                                {/* Stock Badge overlay */}
                                <div className={cn(
                                    "absolute bottom-4 left-4 right-4 p-3 rounded-2xl backdrop-blur-md border flex items-center justify-between",
                                    p.outOfStock ? "bg-rose-50/80 border-rose-100 text-rose-600" :
                                        p.isLowStock ? "bg-orange-50/80 border-orange-100 text-orange-600" :
                                            "bg-white/80 border-slate-100 text-slate-600"
                                )}>
                                    <div className="flex items-center gap-2">
                                        {p.outOfStock ? <ShieldAlert size={14} /> : p.isLowStock ? <Zap size={14} /> : <Activity size={14} />}
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                            {p.outOfStock ? 'Agotado' : p.isLowStock ? 'Bajo Stock' : 'Estable'}
                                        </span>
                                    </div>
                                    <span className="text-xs font-black italic">{p.stock} U.</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-2">
                                <h3 className="font-black text-slate-900 text-base uppercase italic tracking-tighter truncate leading-tight group-hover:text-blue-600 transition-colors">{p.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-2 py-0.5 rounded-lg">{p.sku || 'SERIAL-PENDING'}</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.category?.name}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Inversión Unidad</span>
                                    <span className="text-xl font-black text-slate-950 tracking-tighter">{formatPrice(p.price)}</span>
                                </div>
                                <Link
                                    href={`/admin/products/${p.id}`}
                                    className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white hover:bg-blue-600 hover:rotate-12 transition-all active:scale-90"
                                >
                                    <ArrowUpRight size={20} />
                                </Link>
                            </div>

                            {/* Decorative background accent */}
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Hardware / Identificador</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Estado de Red</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Inversión</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Inventario</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Terminal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/80 transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-inner">
                                            <Package size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 uppercase italic tracking-tight group-hover:text-blue-600 transition-colors">{p.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{p.sku}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-50">{p.category?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2.5 h-2.5 rounded-full ring-4 transition-all",
                                            p.isActive ? 'bg-emerald-500 ring-emerald-50 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300 ring-slate-50'
                                        )} />
                                        <span className="text-[10px] font-black uppercase text-slate-950 tracking-wider font-mono">
                                            {p.isActive ? 'ACTIVO' : 'BORRADOR'}
                                        </span>
                                        {p.isFeatured && (
                                            <span className="text-[8px] font-black uppercase bg-amber-50 text-amber-500 border border-amber-100 px-2 py-0.5 rounded-lg shadow-sm">Destacado</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className="text-sm font-black text-slate-950 tracking-tighter italic">{formatPrice(p.price)}</span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className={cn(
                                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-[10px] font-black",
                                        p.outOfStock ? "bg-rose-50 text-rose-600" :
                                            p.isLowStock ? "bg-orange-50 text-orange-600" :
                                                "bg-slate-50 text-slate-600"
                                    )}>
                                        <span className="opacity-40">QTY:</span> {p.stock}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-950 hover:border-slate-300 hover:shadow-lg transition-all active:scale-90">
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-lg transition-all active:scale-90">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Ambient Background Grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
    );
}

"use client";

import React from 'react';
import { Search, ChevronRight, Hash, User, Calendar, DollarSign, Activity, CheckCircle2, Clock, XCircle, AlertCircle, Eye, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function OrdersTable({ orders }: { orders: any[] }) {
    const [search, setSearch] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');

    const filteredOrders = (orders || []).filter(o => {
        const matchesSearch =
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
            (o.customerEmail || '').toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatPrice = (val: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val || 0);

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'delivered':
            case 'paid':
                return {
                    bg: 'bg-emerald-50/50',
                    text: 'text-emerald-600',
                    border: 'border-emerald-100',
                    icon: CheckCircle2,
                    label: 'Verified / Complete'
                };
            case 'processing':
            case 'shipping':
                return {
                    bg: 'bg-amber-50/50',
                    text: 'text-amber-600',
                    border: 'border-amber-100',
                    icon: Clock,
                    label: 'Processing Cluster'
                };
            case 'cancelled':
                return {
                    bg: 'bg-rose-50/50',
                    text: 'text-rose-600',
                    border: 'border-rose-100',
                    icon: XCircle,
                    label: 'Void / Terminated'
                };
            default:
                return {
                    bg: 'bg-slate-50',
                    text: 'text-slate-600',
                    border: 'border-slate-200',
                    icon: AlertCircle,
                    label: 'Pending Manual sync'
                };
        }
    };

    return (
        <div className="space-y-6">
            {/* Advanced Filters UI */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="SEARCH OPERATIONAL LOGS (ID, NAME, EMAIL)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-xs font-black uppercase tracking-widest placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-slate-100 rounded-2xl p-1 flex gap-1 shadow-sm">
                        {['all', 'completed', 'processing', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    statusFilter === status
                                        ? "bg-slate-950 text-white shadow-lg shadow-slate-900/20"
                                        : "text-slate-400 hover:text-slate-950 hover:bg-slate-50"
                                )}
                            >
                                {status === 'all' ? 'Full Archive' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Header (Hidden on Mobile) */}
            <div className="hidden md:grid grid-cols-6 gap-6 px-10 py-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="col-span-1 flex items-center gap-2">
                    <Hash size={12} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry ID</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                    <User size={12} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity / Customer</span>
                </div>
                <div className="col-span-1 flex items-center gap-2">
                    <Calendar size={12} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</span>
                </div>
                <div className="col-span-1 flex items-center gap-2">
                    <DollarSign size={12} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
                </div>
                <div className="col-span-1 flex items-center gap-2">
                    <Activity size={12} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {filteredOrders.map((order, idx) => {
                        const status = getStatusStyles(order.status);
                        const StatusIcon = status.icon;

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                key={order.id}
                                className="grid grid-cols-1 md:grid-cols-6 gap-6 px-10 py-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all group relative overflow-hidden"
                            >
                                {/* Technical Accent Line */}
                                <div className="absolute top-0 left-0 bottom-0 w-1 bg-slate-950 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="col-span-1 flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-900 font-mono tracking-tighter uppercase truncate max-w-full">
                                        #{order.id.split('-')[0]}
                                    </span>
                                </div>

                                <div className="col-span-2 flex flex-col justify-center">
                                    <span className="text-sm font-black text-slate-950 leading-tight uppercase truncate">{order.customerName || 'Guest'}</span>
                                    <span className="text-[10px] font-bold text-slate-400 truncate tracking-tight">{order.customerEmail || 'N/A'}</span>
                                </div>

                                <div className="col-span-1 flex items-center">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        {new Date(order.createdAt).toLocaleDateString('es-CL', {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }).toUpperCase()}
                                    </span>
                                </div>

                                <div className="col-span-1 flex items-center">
                                    <span className="text-sm font-black text-slate-950 tracking-tighter tabular-nums italic">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>

                                <div className="col-span-1 flex items-center justify-between">
                                    <div className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-xl border",
                                        status.bg, status.text, status.border
                                    )}>
                                        <StatusIcon size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em]">{status.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-2 text-slate-400 hover:text-slate-950 cursor-pointer">
                                            <Eye size={16} />
                                        </div>
                                        <div className="p-2 text-slate-400 hover:text-slate-950 cursor-pointer">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredOrders.length === 0 && (
                    <div className="py-20 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                        <Activity className="mx-auto text-slate-200 mb-4" size={48} />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Zero entries matching selection</p>
                    </div>
                )}
            </div>
        </div>
    );
}

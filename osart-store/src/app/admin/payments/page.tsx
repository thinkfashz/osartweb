'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import {
    CreditCard, Banknote, TrendingUp, CheckCircle, XCircle, Clock,
    RefreshCcw, ExternalLink, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatCardSkeleton } from '@/components/admin/ui/Skeleton';

const PROVIDER_LABELS: Record<string, string> = {
    mercadopago: 'MercadoPago',
    stripe: 'Stripe',
    transfer: 'Transferencia',
};

const STATUS_COLORS: Record<string, string> = {
    paid: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    failed: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const STATUS_ICONS: Record<string, React.ElementType> = {
    paid: CheckCircle,
    pending: Clock,
    failed: XCircle,
};

export default function AdminPaymentsPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Error al cargar transacciones');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const filtered = filter === 'all' ? orders : orders.filter(o => o.payment_status === filter);

    const totalRevenue = orders
        .filter(o => o.payment_status === 'paid')
        .reduce((acc, o) => acc + Number(o.total || 0), 0);
    const paidCount = orders.filter(o => o.payment_status === 'paid').length;
    const pendingCount = orders.filter(o => o.payment_status === 'pending' || !o.payment_status).length;
    const failedCount = orders.filter(o => o.payment_status === 'failed').length;

    return (
        <PageTransition>
            <div className="space-y-8 pb-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Sistema de Pagos</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                            Transacciones
                        </h1>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="self-start sm:self-auto p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all"
                    >
                        <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading ? (
                        <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
                    ) : (<>
                        <StatCard title="Ingresos Confirmados" value={`$${totalRevenue.toLocaleString('es-CL')}`} icon={TrendingUp} description="Pagos exitosos" />
                        <StatCard title="Pagos Exitosos" value={paidCount} icon={CheckCircle} description="Transacciones aprobadas" />
                        <StatCard title="En Proceso" value={pendingCount} icon={Clock} description="Esperando confirmación" />
                        <StatCard title="Fallidos" value={failedCount} icon={XCircle} color="red-500" description="Rechazados o cancelados" />
                    </>)}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                        <Filter size={12} /> Filtrar:
                    </span>
                    {(['all', 'paid', 'pending', 'failed'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-sky-500 border border-transparent dark:border-zinc-800'}`}
                        >
                            {f === 'all' ? 'Todos' : f === 'paid' ? 'Pagados' : f === 'pending' ? 'Pendientes' : 'Fallidos'}
                        </button>
                    ))}
                </div>

                {/* Transactions Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                                    {['Orden', 'Cliente', 'Total', 'Proveedor', 'Estado', 'Fecha', ''].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16 text-center">
                                            <div className="flex items-center justify-center gap-3 text-zinc-500">
                                                <RefreshCcw size={18} className="animate-spin" />
                                                <span className="text-[10px] font-mono uppercase tracking-widest">Cargando transacciones...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16 text-center text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                                            No hay transacciones con este filtro.
                                        </td>
                                    </tr>
                                ) : filtered.map((order, i) => {
                                    const statusKey = order.payment_status || 'pending';
                                    const StatusIcon = STATUS_ICONS[statusKey] ?? Clock;
                                    return (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-[10px] text-zinc-400">
                                                    #{(order.id || '').slice(0, 8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-xs font-bold truncate max-w-[120px]">{order.customerName || 'Guest'}</p>
                                                    <p className="text-[10px] text-zinc-500 truncate max-w-[120px]">{order.customerEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-sm">
                                                ${Number(order.total || 0).toLocaleString('es-CL')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {order.payment_provider === 'mercadopago' && <CreditCard size={12} className="text-sky-500" />}
                                                    {order.payment_provider === 'transfer' && <Banknote size={12} className="text-emerald-500" />}
                                                    {order.payment_provider === 'stripe' && <CreditCard size={12} className="text-violet-500" />}
                                                    <span className="text-[10px] font-mono text-zinc-500">
                                                        {PROVIDER_LABELS[order.payment_provider] || '—'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_COLORS[statusKey] || STATUS_COLORS.pending}`}>
                                                    <StatusIcon size={10} />
                                                    {statusKey === 'paid' ? 'Pagado' : statusKey === 'failed' ? 'Fallido' : 'Pendiente'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[10px] font-mono text-zinc-500">
                                                {order.created_at ? new Date(order.created_at).toLocaleDateString('es-CL') : '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={`/admin/sales`}
                                                    className="p-2 rounded-xl text-zinc-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all inline-flex"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

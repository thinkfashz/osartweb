"use client";

import React from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { ADMIN_SALES_SUMMARY, ADMIN_ORDERS, ADMIN_SEED_DATA } from '@/lib/graphql/adminQueries';
import SalesKpis from '@/components/admin/sales/SalesKpis';
import SalesCharts from '@/components/admin/sales/SalesCharts';
import OrdersTable from '@/components/admin/sales/OrdersTable';
import { Database, Download, RefreshCcw, Sparkles, Filter, ChevronDown, BarChart3, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function SalesPage() {
    const [dateRange, setDateRange] = React.useState('30d');
    const { data: summaryData, loading: summaryLoading, refetch: refetchSummary } = useQuery<any>(ADMIN_SALES_SUMMARY, {
        variables: { dateRange }
    });
    const { data: ordersData, loading: ordersLoading, refetch: refetchOrders } = useQuery<any>(ADMIN_ORDERS);

    const [seedDemoData, { loading: seeding }] = useMutation(ADMIN_SEED_DATA, {
        onCompleted: () => {
            toast.success('System database populated successfully.');
            refetchSummary();
            refetchOrders();
        },
        onError: (err) => toast.error(`Seeding critical failure: ${err.message}`)
    });

    const handleRefresh = async () => {
        const refreshPromise = Promise.all([refetchSummary(), refetchOrders()]);
        toast.promise(refreshPromise, {
            loading: 'Re-syncing transactional volumes...',
            success: 'System synchronized.',
            error: 'Sync failure.'
        });
    };

    if (summaryLoading || ordersLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-8">
                <div className="relative">
                    <div className="w-16 h-16 border-[3px] border-slate-100 border-t-slate-950 rounded-full animate-spin" />
                    <BarChart3 className="absolute inset-0 m-auto text-slate-950 animate-pulse" size={24} />
                </div>
                <div className="text-center">
                    <p className="text-sm font-black text-slate-900 tracking-[0.2em] uppercase mb-1">Analyzing Technical Volumes</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculando métricas de rendimiento...</p>
                </div>
            </div>
        );
    }

    const summary = summaryData?.adminSalesSummary;
    const orders = ordersData?.adminOrders || [];
    const isEmpty = !summary || summary.totalOrders === 0;

    return (
        <div className="space-y-10 min-h-screen pb-20">
            {/* Technical Background Effect */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* Header Section */}
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Module: Alpha-Revenue</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-950 tracking-tighter leading-none mb-2 italic uppercase">
                            Revenue & <span className="text-slate-400">Analytics</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-sm tracking-tight max-w-lg uppercase">
                            Monitoring system performance, transactional flow and industrial throughput.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-950 hover:border-slate-300 transition-all group"
                        title="Re-sync Data"
                    >
                        <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                    </button>

                    <button className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-100 text-slate-950 font-black text-xs uppercase tracking-widest hover:border-slate-300 transition-all shadow-sm">
                        <Download size={18} className="text-slate-400" />
                        <span>Export CSV</span>
                    </button>

                    <div className="h-8 w-[1px] bg-slate-100 mx-2" />

                    <div className="relative group">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="appearance-none bg-slate-950 text-white rounded-2xl pl-6 pr-12 py-4 font-black text-xs uppercase tracking-[0.15em] border-none outline-none focus:ring-4 focus:ring-slate-900/10 transition-all cursor-pointer"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last quarter</option>
                            <option value="all">Full Record</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none opacity-50" size={16} />
                    </div>
                </div>
            </div>

            {/* Empty State / Seed Action */}
            <AnimatePresence>
                {isEmpty && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center gap-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="w-24 h-24 rounded-[2rem] bg-slate-950 flex items-center justify-center text-white shadow-2xl shadow-slate-900/20 relative z-10">
                            <Database size={44} />
                        </div>

                        <div className="max-w-md relative z-10">
                            <h2 className="text-3xl font-black text-slate-950 tracking-tighter mb-3 uppercase italic">System Database Depleted</h2>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed uppercase">
                                No records found in the current temporal window. Initialize demo population to verify analytics engine.
                            </p>
                        </div>

                        <button
                            onClick={() => seedDemoData()}
                            disabled={seeding}
                            className="group relative flex items-center gap-3 px-10 py-5 rounded-3xl bg-slate-950 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-900 transition-all disabled:opacity-50 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            {seeding ? <RefreshCcw className="animate-spin" /> : <Sparkles size={18} className="text-slate-400 group-hover:text-white transition-colors" />}
                            <span>Populate Records</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isEmpty && (
                <div className="space-y-12 pb-10">
                    {/* KPIs Section */}
                    <SalesKpis summary={summary} />

                    {/* Performance Charts */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <Filter size={16} className="text-slate-400" />
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Metric Visualization Index</h2>
                        </div>
                        <SalesCharts data={summary} />
                    </div>

                    {/* Operational Ledger */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <Activity size={16} className="text-slate-400" />
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Ledger (Live)</h2>
                        </div>
                        <OrdersTable orders={orders} />
                    </div>
                </div>
            )}
        </div>
    );
}

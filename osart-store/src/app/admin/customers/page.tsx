"use client";

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { ADMIN_CUSTOMERS } from '@/lib/graphql/adminQueries';
import CustomersTable from '@/components/admin/customers/CustomersTable';
import CustomerDrawer from '@/components/admin/customers/CustomerDrawer';
import { Search, UserPlus, Download, RefreshCcw, Users, Shield, Database, Activity } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { GlowButton } from '@/components/ui/GlowButton';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function CustomersPage() {
    const [search, setSearch] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { data, loading, refetch } = useQuery<any>(ADMIN_CUSTOMERS, {
        variables: { search },
        notifyOnNetworkStatusChange: true
    });

    const handleSelectCustomer = (id: string) => {
        setSelectedCustomerId(id);
        setIsDrawerOpen(true);
    };

    if (loading && !data) {
        return (
            <div className="space-y-12 p-8 animate-in fade-in duration-700">
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <div className="h-12 w-80 bg-slate-200 rounded-2xl animate-pulse" />
                        <div className="h-4 w-[500px] bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                </div>
                <TableSkeleton rows={10} />
            </div>
        );
    }

    const customers = data?.adminCustomers || [];

    return (
        <div className="min-h-screen bg-[#fafafa] p-8 lg:p-12 space-y-12 relative overflow-hidden">
            {/* Technical Background Element */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-100/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />

            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-slate-950 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full flex items-center gap-2 shadow-xl shadow-slate-950/20">
                            <Activity size={10} className="animate-pulse" />
                            Live Terminal Feed
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <Database size={10} />
                            User Registry v4.2
                        </span>
                    </div>
                    <h1 className="text-6xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
                        Base de Clientes
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-xl">
                        Monitoreo de terminales de usuario y métricas de LTV.
                        Sincronización forense de perfiles con la red de hardware OSART.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Search Terminal */}
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Identificar Usuario..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 transition-all text-slate-950 placeholder:text-slate-300 shadow-sm"
                        />
                    </div>

                    <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden xl:block" />

                    <button
                        onClick={() => refetch()}
                        className="p-4 rounded-[1.5rem] bg-white border-2 border-slate-100 text-slate-300 hover:text-slate-950 hover:border-slate-950 transition-all active:scale-90 shadow-sm"
                    >
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>

                    <button className="p-4 rounded-[1.5rem] bg-white border-2 border-slate-100 text-slate-300 hover:text-slate-950 hover:border-slate-950 transition-all active:scale-90 shadow-sm">
                        <Download size={20} />
                    </button>

                    <GlowButton
                        onClick={() => toast.info('Protocolo de Registro no autorizado')}
                        className="py-4 px-8 h-[5.5rem] text-[10px] rounded-[1.5rem]"
                    >
                        <UserPlus size={16} className="mr-3" />
                        ENROLAR NODO
                    </GlowButton>
                </div>
            </div>

            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative z-10"
            >
                <CustomersTable customers={customers} onSelect={handleSelectCustomer} />
            </motion.div>

            {/* Detail Drawer */}
            <CustomerDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                customerId={selectedCustomerId}
            />
        </div>
    );
}

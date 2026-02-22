"use client";

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { ADMIN_CUSTOMERS } from '@/lib/graphql/adminQueries';
import CustomersTable from '@/components/admin/customers/CustomersTable';
import CustomerDrawer from '@/components/admin/customers/CustomerDrawer';
import {
    Search,
    UserPlus,
    RefreshCcw,
    Download,
    Users,
    Database,
    Shield,
    Activity,
    History,
    BarChart3
} from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { GlowButton } from '@/components/ui/GlowButton';

import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import { StatCard } from '@/components/admin/ui/StatCard';

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
        <PageTransition>
            <div className="space-y-6 md:space-y-10 pb-20 px-4 md:px-0">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard
                        title="Nodos de Usuario"
                        value={customers.length}
                        icon={Users}
                        description="Terminales identificadas"
                    />
                    <StatCard
                        title="Tasa de Crecimiento"
                        value="+14.2%"
                        icon={Activity}
                        description="Últimos 30 ciclos"
                    />
                    <StatCard
                        title="Varianza de Valor"
                        value="$842"
                        icon={BarChart3}
                        description="Media de gasto"
                    />
                    <StatCard
                        title="Estado de Acceso"
                        value="Nominal"
                        icon={Shield}
                        description="Protocolo Auth v2"
                    />
                </div>

                {/* Controls Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1 lg:max-w-2xl">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="BUSCAR USUARIO..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white border border-zinc-100 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-zinc-950 transition-all shadow-sm placeholder:text-zinc-300"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <button
                            onClick={() => refetch()}
                            className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-zinc-950 hover:bg-white transition-all shadow-sm active:scale-95 touch-target"
                        >
                            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <div className="h-8 md:h-10 w-[1px] bg-zinc-100 mx-1" />
                        <GlowButton
                            onClick={() => toast.info('Protocolo de Registro no autorizado')}
                            className="flex-1 lg:flex-none py-4 px-8 h-14 text-[10px] rounded-2xl shadow-lg shadow-black/5"
                        >
                            <UserPlus size={16} className="mr-3" />
                            ENROLAR NODO
                        </GlowButton>
                    </div>
                </div>

                {/* Main Table Area */}
                <div className="bg-white border border-zinc-100 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                        <CustomersTable customers={customers} onSelect={handleSelectCustomer} />
                    </div>
                </div>
            </div>

            {/* Detail Drawer */}
            <CustomerDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                customerId={selectedCustomerId}
            />
        </PageTransition>
    );
}

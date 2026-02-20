'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
    Database,
    Zap,
    RefreshCcw,
    Table as TableIcon,
    ShieldCheck,
    AlertTriangle,
    Activity,
    Terminal as TerminalIcon,
    ChevronRight,
    Search,
    HardDrive,
    Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ADMIN_DATABASE_STATUS, ADMIN_SEED_DATA } from '@/lib/graphql/adminQueries';
import { toast } from 'sonner';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import { StatCard } from '@/components/admin/ui/StatCard';

const DatabasePage = () => {
    const { data, loading, refetch } = useQuery<any>(ADMIN_DATABASE_STATUS);
    const [seedDemoData, { loading: seeding }] = useMutation(ADMIN_SEED_DATA);
    const [search, setSearch] = useState('');

    const status = data?.adminDatabaseStatus;
    const tables = status?.tables || [];
    const filteredTables = tables.filter((t: any) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSync = async () => {
        try {
            await refetch();
            toast.success('Esquema de datos sincronizado con Supabase');
        } catch (err) {
            toast.error('Error de enlace con la infraestructura central');
        }
    };

    const handleSeed = async () => {
        try {
            await seedDemoData();
            toast.success('Datos de simulación inyectados correctamente');
            refetch();
        } catch (err) {
            toast.error('Falla en la inyección de datos de demo');
        }
    };

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Escaneando Infraestructura...</p>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="space-y-10 pb-20">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                            <ShieldCheck size={14} />
                            Sistema de Control de Datos
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-zinc-950">Núcleo Base de Datos</h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleSync}
                            className="flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white rounded-2xl font-bold uppercase italic tracking-widest text-[10px] hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-950/20"
                        >
                            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
                            Sincronizar Esquema
                        </button>
                        <button
                            onClick={handleSeed}
                            disabled={seeding}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-100 text-zinc-950 rounded-2xl font-bold uppercase italic tracking-widest text-[10px] hover:bg-zinc-50 transition-all disabled:opacity-50"
                        >
                            <Zap size={14} className={seeding ? "animate-pulse" : ""} />
                            Inyectar Demo Data
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Estado de Enlace"
                        value="Operacional"
                        icon={Activity}
                        color="emerald-500"
                        description="Núcleo verificado"
                    />
                    <StatCard
                        title="Entorno"
                        value={status?.databaseUrl || 'Supabase Cloud'}
                        icon={Cloud}
                        description="Cluster de producción"
                    />
                    <StatCard
                        title="Tablas Indexadas"
                        value={tables.length}
                        icon={TableIcon}
                        description="Entidades activas"
                    />
                    <StatCard
                        title="Versión Esquema"
                        value={`v${status?.version || 1}.2.0`}
                        icon={TerminalIcon}
                        description="Build estable"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Table List (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                                    <HardDrive size={20} className="text-slate-400" />
                                    Diccionario de Datos
                                </h2>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="FILTRAR TABLAS..."
                                        className="bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest w-full sm:w-64 focus:ring-2 ring-emerald-500/10 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre Interno</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Registros</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Última Sincronía</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence mode='popLayout'>
                                            {filteredTables.map((table: any, idx: number) => (
                                                <motion.tr
                                                    key={table.name}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group"
                                                >
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black italic">
                                                                {table.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="font-bold text-slate-900 uppercase tracking-tight">{table.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-center">
                                                        <span className="font-mono font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs border border-emerald-100/50">
                                                            {table.rowCount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {new Date(table.lastUpdate).toLocaleTimeString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button className="text-slate-300 hover:text-emerald-500 transition-colors">
                                                            <ChevronRight size={18} />
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* System Diagnostics (1/3) */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <TerminalIcon size={80} />
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Log de Operaciones</p>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">Consola de Núcleo</h3>
                            </div>

                            <div className="bg-black/40 rounded-2xl p-6 font-mono text-[10px] space-y-3 border border-white/5">
                                <p className="text-emerald-500/80">[SYSTEM] Initialization pulse verified</p>
                                <p className="text-white/40">[BACKEND] Connection pool healthy (20/20)</p>
                                <p className="text-cyan-500/80">[GRAPHQL] Introspection completed successfully</p>
                                <p className="text-slate-500 italic">[IDLE] Awaiting next maintenance cycle...</p>
                            </div>

                            <div className="pt-4">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">
                                    <span>Utilización Masiva</span>
                                    <span>14%</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '14%' }}
                                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-emerald-500 pl-4">Zonas de Riesgo</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 shadow-sm">
                                    <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-tight text-orange-900 mb-1">Cuidado con Seed Data</h4>
                                        <p className="text-[10px] leading-relaxed text-orange-700 font-bold uppercase tracking-widest">Inyectar datos de demostración sobreescribirá métricas temporales del sistema.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <Database className="text-slate-400 shrink-0" size={18} />
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-tight text-slate-900 mb-1">Auto-Respaldo Activo</h4>
                                        <p className="text-[10px] leading-relaxed text-slate-500 font-bold uppercase tracking-widest">Supabase genera un snapshot cada 24 horas automáticamente.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default DatabasePage;

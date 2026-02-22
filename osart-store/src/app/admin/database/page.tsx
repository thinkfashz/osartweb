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
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [search, setSearch] = useState('');

    const fetchStatus = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/system');
            const result = await res.json();
            setData({ adminDatabaseStatus: result });
        } catch (err) {
            toast.error('Error de enlace con la infraestructura central');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    const status = data?.adminDatabaseStatus;
    const tables = status?.tables || [];
    const filteredTables = tables.filter((t: any) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSync = async () => {
        toast.promise(fetchStatus(), {
            loading: 'Sincronizando esquema...',
            success: 'Esquema de datos sincronizado con Supabase',
            error: 'Falla en la sincronía'
        });
    };

    const handleSeed = async () => {
        setSeeding(true);
        try {
            const res = await fetch('/api/system', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'seed' })
            });
            if (res.ok) {
                toast.success('Datos de simulación inyectados correctamente');
                fetchStatus();
            } else {
                toast.error('Falla en la inyección de datos de demo');
            }
        } finally {
            setSeeding(false);
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
            <div className="space-y-6 md:space-y-10 pb-20">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 shadow-sm transition-all duration-300">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                            <ShieldCheck size={14} />
                            Sistema de Control de Datos
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter uppercase italic text-zinc-950 leading-tight">Núcleo Base de Datos</h1>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleSync}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-zinc-950 text-white rounded-xl md:rounded-2xl font-bold uppercase italic tracking-widest text-[10px] hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-950/20"
                        >
                            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
                            Sincronizar Esquema
                        </button>
                        <button
                            onClick={handleSeed}
                            disabled={seeding}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-zinc-100 text-zinc-950 rounded-xl md:rounded-2xl font-bold uppercase italic tracking-widest text-[10px] hover:bg-zinc-50 transition-all disabled:opacity-50"
                        >
                            <Zap size={14} className={seeding ? "animate-pulse" : ""} />
                            Inyectar Demo Data
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Table List (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                                    <HardDrive size={20} className="text-slate-400" />
                                    Diccionario de Datos
                                </h2>
                                <div className="relative group w-full md:w-auto">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="FILTRAR TABLAS..."
                                        className="bg-slate-50 border-none rounded-xl md:rounded-2xl py-3 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest w-full md:w-64 focus:ring-2 ring-emerald-500/10 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre Interno</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Registros</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Última Sincronía</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        <AnimatePresence mode='popLayout'>
                                            {filteredTables.map((table: any, idx: number) => (
                                                <motion.tr
                                                    key={table.name}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="hover:bg-slate-50/30 transition-colors group cursor-pointer"
                                                >
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[11px] font-black italic shadow-lg shadow-slate-950/10 group-hover:scale-110 duration-300 transition-transform">
                                                                {table.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{table.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <span className="font-mono font-black bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs border border-emerald-100/50">
                                                            {table.rowCount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                                                            {new Date(table.lastUpdate).toLocaleTimeString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-zinc-950 group-hover:text-white group-hover:scale-110 transition-all ml-auto">
                                                            <ChevronRight size={18} />
                                                        </div>
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
                    <div className="space-y-6 md:space-y-8">
                        <div className="bg-slate-950 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-2xl shadow-slate-950/20">
                            {/* Industrial overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)', backgroundSize: '4px 4px' }} />

                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Log de Operaciones</p>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Consola de Núcleo</h3>
                                </div>
                                <TerminalIcon size={24} className="text-slate-700" />
                            </div>

                            <div className="relative z-10 bg-black/60 rounded-2xl p-6 font-mono text-[9px] md:text-[10px] space-y-3 border border-white/5 shadow-inner">
                                <p className="text-emerald-500/80"><span className="opacity-40">08:00:01</span> [SYSTEM] Initialization pulse verified</p>
                                <p className="text-white/40"><span className="opacity-40">08:00:02</span> [BACKEND] Connection pool healthy (20/20)</p>
                                <p className="text-cyan-500/80"><span className="opacity-40">08:00:05</span> [GRAPHQL] Introspection completed</p>
                                <p className="text-slate-600 italic mt-4">[IDLE] Awaiting next maintenance cycle...</p>
                            </div>

                            <div className="relative z-10 pt-4">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">
                                    <span>Capacidad de Almacenamiento</span>
                                    <span className="font-mono text-emerald-500">14.2%</span>
                                </div>
                                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '14.2%' }}
                                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-l-4 border-emerald-500 pl-4 relative z-10">Zonas de Riesgo</h3>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-start gap-4 p-5 bg-orange-50/50 rounded-2xl border border-orange-100/50 shadow-sm">
                                    <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase tracking-tight text-orange-950 mb-1">Impacto de Seed Data</h4>
                                        <p className="text-[10px] leading-relaxed text-orange-800/80 font-bold uppercase tracking-tight">Sobreescribirá métricas temporales del sistema. Proceder con precaución en producción.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm">
                                    <Database className="text-slate-400 shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase tracking-tight text-slate-950 mb-1">Respaldos Críticos</h4>
                                        <p className="text-[10px] leading-relaxed text-slate-500 font-bold uppercase tracking-tight">Supabase genera snapshots automáticos cada 24 horas.</p>
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

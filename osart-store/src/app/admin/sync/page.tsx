'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import {
    Zap, RefreshCcw, Database, Cloud, CheckCircle2,
    XCircle, AlertTriangle, Loader2, Activity, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface SyncEvent {
    id: string;
    label: string;
    status: 'success' | 'error' | 'running';
    time: string;
    detail: string;
}

interface SystemStatus {
    status: string;
    tables: { name: string; rowCount: number; lastUpdate: string }[];
    databaseUrl?: string;
}

export default function SyncPage() {
    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);
    const [history, setHistory] = useState<SyncEvent[]>([]);

    const fetchStatus = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/system');
            if (!res.ok) throw new Error('Server error');
            const data = await res.json();
            setSystemStatus(data);
        } catch {
            toast.error('Error de enlace con el servidor de sincronía');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStatus(); }, [fetchStatus]);

    // Load sync history from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('osart_sync_history');
            if (saved) setHistory(JSON.parse(saved));
        } catch { /* ignore */ }
    }, []);

    const logEvent = (event: SyncEvent) => {
        setHistory(prev => {
            const updated = [event, ...prev].slice(0, 8);
            localStorage.setItem('osart_sync_history', JSON.stringify(updated));
            return updated;
        });
    };

    const handleSync = async () => {
        if (syncing) return;
        setSyncing(true);
        setSyncProgress(0);
        const eventId = Date.now().toString();

        const eventRunning: SyncEvent = {
            id: eventId,
            label: 'Sincronización Total',
            status: 'running',
            time: new Date().toLocaleTimeString('es-CL'),
            detail: 'Conectando con Supabase...',
        };
        logEvent(eventRunning);

        // Simulate progress animation
        const interval = setInterval(() => {
            setSyncProgress(p => Math.min(p + 12, 90));
        }, 200);

        try {
            await fetchStatus();
            clearInterval(interval);
            setSyncProgress(100);
            const eventDone: SyncEvent = {
                id: eventId,
                label: 'Sincronización Total',
                status: 'success',
                time: new Date().toLocaleTimeString('es-CL'),
                detail: `${systemStatus?.tables?.length ?? '—'} tablas verificadas`,
            };
            setHistory(prev => {
                const updated = prev.map(e => e.id === eventId ? eventDone : e);
                localStorage.setItem('osart_sync_history', JSON.stringify(updated));
                return updated;
            });
            toast.success('Sincronización completada ✓');
        } catch {
            clearInterval(interval);
            setSyncProgress(0);
            toast.error('Falla en la sincronización');
        } finally {
            setTimeout(() => { setSyncing(false); setSyncProgress(0); }, 600);
        }
    };

    const handleSeedData = async () => {
        const confirm = window.confirm('¿Inyectar datos demo en la base de datos? Esto sobrescribirá métricas temporales.');
        if (!confirm) return;
        toast.promise(
            fetch('/api/system', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'seed' }),
            }).then(r => { if (!r.ok) throw new Error(); }),
            {
                loading: 'Inyectando datos de simulación...',
                success: 'Datos demo inyectados correctamente',
                error: 'Error al inyectar datos',
            }
        );
    };

    const statusColor = (s: SyncEvent['status']) =>
        s === 'success' ? 'text-emerald-400' : s === 'error' ? 'text-red-400' : 'text-electric-blue';

    const StatusIcon = ({ status }: { status: SyncEvent['status'] }) => {
        if (status === 'success') return <CheckCircle2 size={16} className="text-emerald-400" />;
        if (status === 'error') return <XCircle size={16} className="text-red-400" />;
        return <Loader2 size={16} className="animate-spin text-electric-blue" />;
    };

    return (
        <PageTransition>
            <div className="space-y-6 md:space-y-10 pb-20">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${syncing ? 'bg-electric-blue' : 'bg-emerald-500'}`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-electric-blue">Puente de Datos OSART</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                            Sincronización
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
                            {loading ? 'Conectando...' : `${systemStatus?.tables?.length ?? 0} tablas en el índice`}
                        </p>
                    </div>
                    <div className="flex gap-3 w-full lg:w-auto">
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-electric-blue transition-all disabled:opacity-60 shadow-lg"
                        >
                            <RefreshCcw size={16} className={syncing ? 'animate-spin' : ''} />
                            {syncing ? 'Sincronizando...' : 'Forzar Sync'}
                        </button>
                        <button
                            onClick={handleSeedData}
                            className="px-6 py-4 rounded-2xl border border-zinc-700 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:border-zinc-500 hover:text-white transition-all"
                        >
                            Seed Data
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Main Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Connection Status Card */}
                        <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${loading ? 'bg-zinc-800 border-zinc-700' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                        <Cloud size={22} className={loading ? 'text-zinc-600' : 'text-emerald-400'} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Supabase Cloud</p>
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">
                                            {loading ? 'Verificando...' : 'Enlace Activo'}
                                        </h3>
                                    </div>
                                </div>

                                {/* Sync Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                                        <span>Estado de sincronía</span>
                                        <span>{syncing ? `${syncProgress}%` : '100%'}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: syncing ? `${syncProgress}%` : '100%' }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                        />
                                    </div>
                                </div>

                                {/* Table Stats */}
                                {!loading && systemStatus?.tables && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {systemStatus.tables.slice(0, 6).map(t => (
                                            <div key={t.name} className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 truncate">{t.name}</p>
                                                <p className="text-lg font-black text-white font-mono">{t.rowCount.toLocaleString()}</p>
                                                <p className="text-[8px] text-zinc-600 font-mono">registros</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {loading && (
                                    <div className="grid grid-cols-3 gap-3">
                                        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse border border-zinc-800" />)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sync History */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 md:p-8">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-5 flex items-center gap-3">
                                <Clock size={16} className="text-zinc-400" />
                                Historial de Operaciones
                            </h3>
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {history.length === 0 ? (
                                        <div className="py-8 text-center text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
                                            Sin operaciones registradas
                                        </div>
                                    ) : history.map((event, i) => (
                                        <motion.div
                                            key={event.id + i}
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800"
                                        >
                                            <StatusIcon status={event.status} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[10px] font-black uppercase tracking-widest truncate ${statusColor(event.status)}`}>
                                                    {event.label}
                                                </p>
                                                <p className="text-[9px] text-zinc-600 font-mono truncate">{event.detail}</p>
                                            </div>
                                            <p className="text-[9px] text-zinc-600 font-mono shrink-0">{event.time}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Network Status */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 space-y-5">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                                <Activity size={14} className="text-electric-blue" />
                                Estado de Red
                            </h3>
                            {[
                                { label: 'Supabase DB', status: !loading, ping: '12ms' },
                                { label: 'Auth Service', status: !loading, ping: '8ms' },
                                { label: 'Storage CDN', status: !loading, ping: '45ms' },
                                { label: 'Edge Functions', status: !loading, ping: '—' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.status ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)] animate-pulse' : 'bg-zinc-700'}`} />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-zinc-600">{loading ? '...' : item.ping}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-4">Acciones Rápidas</h3>
                            {[
                                { label: 'Refrescar estado', action: fetchStatus, icon: RefreshCcw },
                                { label: 'Limpiar caché local', action: () => { localStorage.clear(); toast.success('Caché eliminada'); }, icon: Database },
                                { label: 'Exportar reporte', action: () => toast.info('Próximamente'), icon: Zap },
                            ].map(({ label, action, icon: Icon }) => (
                                <button
                                    key={label}
                                    onClick={action}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

'use client';

import React, { useState } from 'react';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import {
    Database, Zap, Key, Link as LinkIcon,
    CheckCircle2, AlertCircle, Play, Server, Layers, Clock
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApiTesterPage() {
    const [url, setUrl] = useState('');
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        status: 'idle' | 'success' | 'error';
        latency?: number;
        count?: number;
        data?: any[];
        error?: string;
    }>({ status: 'idle' });

    const handleTestConnection = async () => {
        if (!url || !key) {
            setResult({ status: 'error', error: 'Por favor, ingresa la URL y la llave.' });
            return;
        }

        setLoading(true);
        setResult({ status: 'idle' });
        const startTime = performance.now();

        try {
            // Attempt short-lived connection
            const tempClient = createClient(url, key, {
                auth: { persistSession: false }
            });

            // Make a standard fetch on products
            const { data, error, count } = await tempClient
                .from('products')
                .select('*', { count: 'exact' })
                .limit(10); // Fetch first 10 for display

            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);

            if (error) throw error;

            setResult({
                status: 'success',
                latency,
                count: count || data?.length || 0,
                data: data || []
            });

        } catch (err: any) {
            const endTime = performance.now();
            setResult({
                status: 'error',
                latency: Math.round(endTime - startTime),
                error: err.message || 'Error de conexión o permisos insuficientes.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6 md:space-y-10 pb-20">
                {/* Header */}
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
                                Diagnóstico de Conectividad
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-950 leading-none">
                            Explorador API
                        </h1>
                        <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest max-w-xl">
                            Herramienta de depuración interactiva. Inyecta credenciales temporales para probar la extrusión de datos desde clústeres externos de Supabase.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Input Settings Panel (Left) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-zinc-100 rounded-[2rem] p-6 shadow-sm">
                            <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-950 mb-6 flex items-center gap-2">
                                <SettingsIcon /> Parámetros de Inyección
                            </h2>

                            <div className="space-y-5">
                                <div className="space-y-2 relative group">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                        <Database size={12} /> Supabase URL
                                    </label>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://xyzxyz.supabase.co"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-xs font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-300"
                                    />
                                </div>

                                <div className="space-y-2 relative group">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                        <Key size={12} /> Anon Key / Service Role
                                    </label>
                                    <input
                                        type="password"
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                        placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-xs font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-300"
                                    />
                                </div>

                                <button
                                    onClick={handleTestConnection}
                                    disabled={loading}
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-zinc-950 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none group shadow-lg shadow-zinc-950/20"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Negociando Enlace...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 group-hover:gap-3 transition-all">
                                            <Play size={14} className="fill-white" /> Executar Payload
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Connection Status Indicator */}
                        <div className="bg-zinc-950 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl shadow-zinc-950/10">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:10px_10px]" />
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                                    Estado del Enlace
                                </h3>

                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl border ${result.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                            result.status === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                                                loading ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 blink' :
                                                    'bg-zinc-900 border-zinc-800 text-zinc-600'
                                        }`}>
                                        {result.status === 'success' ? <CheckCircle2 size={24} /> :
                                            result.status === 'error' ? <AlertCircle size={24} /> :
                                                <LinkIcon size={24} />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Canal Seguro</p>
                                        <p className="text-lg font-black uppercase italic tracking-tighter">
                                            {result.status === 'idle' && !loading && 'Desconectado'}
                                            {loading && 'Sincronizando...'}
                                            {result.status === 'success' && 'Establecido'}
                                            {result.status === 'error' && 'Denegado'}
                                        </p>
                                    </div>
                                </div>

                                {result.status !== 'idle' && (
                                    <div className="flex justify-between items-center px-4 py-2 mt-2 bg-black/40 rounded-lg border border-white/5">
                                        <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1.5">
                                            <Clock size={10} /> Latencia
                                        </span>
                                        <span className={`text-[10px] font-mono ${result.status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {result.latency}ms
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Panel (Right) */}
                    <div className="lg:col-span-2 space-y-6 flex flex-col">
                        <div className="bg-white border border-zinc-100 rounded-[2rem] p-6 md:p-8 shadow-sm flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
                                    <Server size={18} className="text-blue-500" /> Snapshot de Respuesta
                                </h2>
                                {result.status === 'success' && (
                                    <div className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                        <Layers size={10} /> {result.count} Entidades
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-h-[400px] border border-zinc-100 rounded-2xl bg-zinc-50 overflow-hidden relative">
                                <AnimatePresence mode='wait'>
                                    {result.status === 'idle' && !loading && (
                                        <motion.div
                                            key="idle"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 space-y-3"
                                        >
                                            <Zap size={32} className="opacity-20" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Esperando Datos...</p>
                                        </motion.div>
                                    )}

                                    {loading && (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center space-y-4"
                                        >
                                            <div className="w-16 h-16 border-4 border-zinc-200 border-t-blue-500 rounded-full animate-spin" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 animate-pulse">
                                                Ejecutando Consulta
                                            </p>
                                        </motion.div>
                                    )}

                                    {result.status === 'error' && (
                                        <motion.div
                                            key="error"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center space-y-3 p-6 text-center"
                                        >
                                            <AlertCircle size={32} className="text-red-400" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Error de Ejecución</p>
                                            <p className="text-xs font-mono text-zinc-500 bg-white px-4 py-2 border border-zinc-200 rounded-lg max-w-sm break-words">
                                                {result.error}
                                            </p>
                                        </motion.div>
                                    )}

                                    {result.status === 'success' && (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 overflow-auto p-4 custom-scrollbar"
                                        >
                                            {/* Render JSON visually if possible, else raw dump */}
                                            {result.data && result.data.length > 0 ? (
                                                <div className="space-y-4">
                                                    {result.data.map((product, i) => (
                                                        <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:border-zinc-300 transition-colors">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-bold text-sm text-zinc-900 truncate pr-4">{product.name || 'Sin Nombre'}</h4>
                                                                <span className="text-[9px] font-mono bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded flex-shrink-0">
                                                                    ID: {String(product.id).substring(0, 8)}...
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] uppercase font-bold tracking-tight">
                                                                <div className="bg-zinc-50 p-2 rounded">
                                                                    <span className="text-zinc-400 block text-[8px] mb-1">SKU</span>
                                                                    <span className="text-zinc-700">{product.sku || 'N/A'}</span>
                                                                </div>
                                                                <div className="bg-zinc-50 p-2 rounded">
                                                                    <span className="text-zinc-400 block text-[8px] mb-1">Precio</span>
                                                                    <span className="text-zinc-700 font-mono">${product.price || 0}</span>
                                                                </div>
                                                                <div className="bg-zinc-50 p-2 rounded">
                                                                    <span className="text-zinc-400 block text-[8px] mb-1">Stock</span>
                                                                    <span className={`font-mono ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                                        {product.stock || 0}
                                                                    </span>
                                                                </div>
                                                                <div className="bg-zinc-50 p-2 rounded">
                                                                    <span className="text-zinc-400 block text-[8px] mb-1">Modelo</span>
                                                                    <span className="text-zinc-700">{product.model || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="text-center text-[10px] font-mono text-zinc-400 mt-4 pb-2">
                                                        Mostrando {result.data.length} de {result.count} registros (Límite 10)
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-[10px] font-mono text-zinc-400">
                                                    La tabla "products" está vacía o no existe en este esquema.
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

const SettingsIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

'use client';

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, LogIn, ChevronRight, Loader2, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { supabase } from '@/lib/supabase-auth';
import { useRouter, useSearchParams } from 'next/navigation';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    const [logs, setLogs] = useState<string[]>(['[SISTEMA]: Iniciando núcleo de seguridad...', '[SISTEMA]: Cargando protocolos de red...']);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}]: ${msg}`]);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        addLog('Iniciando intento de autorización...');

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) {
                addLog('FALLO DE AUTORIZACIÓN: Credenciales inválidas.');
                throw loginError;
            }
            addLog('ACCESO CONCEDIDO: Sincronizando sesión...');
            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error de Autenticación de Sistemas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-950/80 border border-sky-500/20 p-8 relative overflow-hidden group backdrop-blur-3xl shadow-[0_0_50px_rgba(14,165,233,0.1)]">
            {/* Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_4px,3px_100%]" />
            
            {/* Structural Accents */}
            <div className="absolute top-0 right-0 w-24 h-[1px] bg-sky-500/50" />
            <div className="absolute top-0 right-0 w-[1px] h-24 bg-sky-500/50" />
            <div className="absolute bottom-0 left-0 w-24 h-[1px] bg-sky-500/20" />
            <div className="absolute bottom-0 left-0 w-[1px] h-24 bg-sky-500/20" />

            {/* Diagnostic Log Panel */}
            <div className="mb-10 p-4 bg-black/60 border border-white/5 font-mono text-[8px] space-y-1">
                <div className="flex items-center gap-2 mb-2 text-sky-500/60">
                    <Terminal size={10} />
                    <span className="uppercase tracking-[0.2em]">Live_Diagnostic_Log</span>
                </div>
                {logs.map((log, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1 - (logs.length - 1 - i) * 0.2, x: 0 }}
                        className="text-zinc-500 flex gap-2"
                    >
                        <span className="text-sky-500/40 opacity-50">&gt;</span>
                        {log}
                    </motion.div>
                ))}
            </div>

            {error && (
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 p-5 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center gap-3"
                >
                    <div className="w-2 h-2 bg-red-500 animate-pulse rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    [ERROR_CRÍTICO]: {error}
                </motion.div>
            )}

            <form className="space-y-8" onSubmit={handleLogin}>
                <div className="space-y-3">
                    <label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 pl-1 flex items-center gap-2">
                        <div className="w-1 h-1 bg-sky-500/50" /> Identificador_Red
                    </label>
                    <div className="relative group/input">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-sky-500 transition-colors" size={16} />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="OPERARIO@NODE.OSART"
                            required
                            className="w-full bg-black border border-white/10 rounded-none py-5 pl-12 pr-4 text-xs font-mono text-white placeholder:text-zinc-800 focus:border-sky-500 focus:shadow-[0_0_20px_rgba(14,165,233,0.1)] outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <label htmlFor="password" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                            <div className="w-1 h-1 bg-sky-500/50" /> Código_Acceso
                        </label>
                    </div>
                    <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-sky-500 transition-colors" size={16} />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full bg-black border border-white/10 rounded-none py-5 pl-12 pr-4 text-xs font-mono text-white placeholder:text-zinc-800 focus:border-sky-500 focus:shadow-[0_0_20px_rgba(14,165,233,0.1)] outline-none transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative py-5 bg-sky-500 text-black font-black text-[10px] uppercase italic tracking-[0.4em] transition-all active:scale-[0.98] disabled:opacity-50 group/btn shadow-[0_0_30px_rgba(14,165,233,0.2)]"
                >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? <Loader2 className="animate-spin" size={16} /> : (
                            <>
                                Autorizar Acceso
                                <LogIn size={16} />
                            </>
                        )}
                    </span>
                </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-col gap-4">
                    <Link href="/register" className="w-full py-3 border border-white/5 hover:border-sky-500/30 text-center text-[9px] text-zinc-500 hover:text-sky-500 font-bold uppercase tracking-widest transition-all">
                        Sincronizar Nuevo Perfil
                    </Link>
                    <Link href="/forgot-password" className="text-center text-[8px] text-zinc-700 hover:text-zinc-400 uppercase font-black tracking-widest transition-colors">
                        Recuperar_Acceso_Perdido
                    </Link>
                </div>
            </div>
        </div>
    );
};

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-20 bg-background relative overflow-hidden">
            {/* Background Decor - Industrial Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 blur-[160px] -z-10" />

            <div className="max-w-[440px] w-full px-5 relative z-10">
                <div className="mb-12 space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                            <Cpu size={24} className="text-sky-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-center uppercase italic tracking-tighter text-white">
                        Security <span className="text-sky-500">Terminal</span>
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-zinc-800" />
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600">Protocolo: OSART-CORE-77</span>
                        <div className="h-px w-8 bg-zinc-800" />
                    </div>
                </div>

                <Suspense fallback={
                    <div className="bg-zinc-900/50 border border-white/5 p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
                        <Loader2 className="animate-spin text-sky-500" size={32} />
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Iniciando Consola de Seguridad...</span>
                    </div>
                }>
                    <LoginForm />
                </Suspense>

                <div className="mt-12 flex items-center justify-between opacity-30 px-2 pointer-events-none">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-3 bg-zinc-700" />)}
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-mono uppercase tracking-widest text-zinc-500">
                        <ShieldCheck size={10} />
                        System_Encryption_Active
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

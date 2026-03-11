'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase-auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Eye,
    EyeOff,
    LogIn,
    AlertTriangle,
    Loader2,
    Lock,
    Mail,
    Zap,
    Terminal
} from 'lucide-react';

export default function AdminLoginPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isUnauthorized = searchParams.get('error') === 'unauthorized';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(isUnauthorized ? 'No tienes permisos de administrador.' : null);

    // If already authenticated as admin, redirect to /admin
    useEffect(() => {
        if (authLoading || !user) return;
        const check = async () => {
            const { data } = await (supabase.from('profiles').select('role').eq('id', user.id).single() as any);
            if (data?.role === 'admin') router.replace('/admin');
        };
        check();
    }, [user, authLoading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) {
                setError('Credenciales inválidas. Acceso denegado.');
                setLoading(false);
                return;
            }

            // Check if user has admin role
            const { data: { user: signedInUser } } = await supabase.auth.getUser();
            if (!signedInUser) { setError('Error de sesión.'); setLoading(false); return; }

            const { data: profileData } = await (supabase
                .from('profiles')
                .select('role')
                .eq('id', signedInUser.id)
                .single() as any);

            if (profileData?.role !== 'admin') {
                await supabase.auth.signOut();
                setError('Acceso denegado. Esta terminal requiere privilegios de administrador.');
                setLoading(false);
                return;
            }

            router.push('/admin');
        } catch {
            setError('Error de conexión. Verifique el enlace de red.');
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-sky-500" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden p-4">
            {/* Animated background grid - Now Dots for SaaS feel */}
            <div
                className="absolute inset-0 opacity-[0.2] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#0ea5e9 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}
            />

            {/* Ambient glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-600/8 blur-[100px] pointer-events-none" />

            {/* Scanning line animation */}
            <motion.div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500/30 to-transparent pointer-events-none"
                animate={{ y: ['0vh', '100vh'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6 relative group">
                        <ShieldCheck size={36} className="text-sky-500" />
                        <div className="absolute inset-0 rounded-2xl border border-sky-500/20 animate-ping opacity-30" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Terminal size={12} className="text-zinc-500" />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Terminal Segura v1.0</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                        OSART <span className="text-sky-500">PRO</span>
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-2">
                        Núcleo de Administración — Acceso Restringido
                    </p>
                </div>

                {/* Card - SaaS Glass */}
                <div className="saas-glass-dark rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-sky-500/40 rounded-tl-3xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-sky-500/40 rounded-br-3xl" />

                    {/* Error banner */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 text-red-400"
                            >
                                <AlertTriangle size={16} className="shrink-0" />
                                <p className="text-[11px] font-bold uppercase tracking-wider">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 flex items-center gap-2">
                                <Mail size={10} />
                                Identificación de Operario
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@osart.cl"
                                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-sky-500 rounded-xl px-4 py-4 text-sm text-white placeholder-zinc-600 outline-none transition-all font-mono"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 flex items-center gap-2">
                                <Lock size={10} />
                                Código de Acceso
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••••"
                                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-sky-500 rounded-xl px-4 py-4 pr-12 text-sm text-white placeholder-zinc-600 outline-none transition-all font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit - Premium Neon Button Style */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 flex items-center justify-center gap-3 py-4 bg-sky-500 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-sky-600 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-sky-500/20 disabled:opacity-60"
                        >
                            <div className="absolute inset-0 bg-sky-500 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? (
                                    <><Loader2 size={16} className="animate-spin" /> Verificando...</>
                                ) : (
                                    <><LogIn size={16} /> Acceder al Sistema</>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Info footer */}
                    <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Zap size={10} className="text-sky-500" />
                            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Sistema Activo</span>
                        </div>
                        <a href="/" className="text-[9px] font-mono text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">
                            ← Tienda
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

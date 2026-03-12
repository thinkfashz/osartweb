'use client';

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;
            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Credenciales no autorizadas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-8"
        >
            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] text-center mb-6"
                        >
                            {error}
                        </motion.div>
                    )}
                    {message === 'check-email' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.2em] text-center mb-6"
                        >
                            Verifica tu bandeja para confirmar acceso
                        </motion.div>
                    )}
                </AnimatePresence>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 transition-colors group-focus-within:text-sky-500 ml-1">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="usuario@osart.com"
                                className="w-full bg-transparent border-b border-zinc-800 py-4 px-1 text-sm font-medium text-white placeholder:text-zinc-700 focus:border-sky-500 outline-none transition-all duration-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 transition-colors group-focus-within:text-sky-500">
                                Contraseña
                            </label>
                            <Link href="/forgot-password" className="text-[9px] text-zinc-700 hover:text-sky-500 transition-colors uppercase tracking-widest font-bold">
                                Olvidé mi código
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-transparent border-b border-zinc-800 py-4 px-1 text-sm font-medium text-white placeholder:text-zinc-700 focus:border-sky-500 outline-none transition-all duration-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-white text-black text-[11px] font-black uppercase italic tracking-[0.4em] rounded-full hover:bg-sky-500 transition-all duration-500 active:scale-[0.98] disabled:opacity-30 relative overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-sky-400 opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? <Loader2 className="animate-spin" size={16} /> : "Autorizar Acceso"}
                            </span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">¿Nuevo operario?</span>
                <Link 
                    href="/register" 
                    className="text-[11px] font-black uppercase italic tracking-[0.3em] text-white hover:text-sky-500 transition-colors group"
                >
                    Sincronizar Perfil
                    <div className="h-px w-0 bg-sky-500 group-hover:w-full transition-all duration-500 mt-1" />
                </Link>
            </div>
        </motion.div>
    );
};

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Zen Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 blur-[180px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-lg relative z-10 flex flex-col items-center space-y-16">
                {/* Branding minimalista */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <div className="p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl">
                        <ShieldCheck size={32} className="text-sky-500" strokeWidth={1} />
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter sm:text-6xl">
                            OSART <span className="text-sky-400">ID</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 mt-2">Acceso Premium al Sistema</p>
                    </div>
                </motion.div>

                <Suspense fallback={
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-sky-500" size={32} />
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Iniciando Protocolo...</span>
                    </div>
                }>
                    <LoginForm />
                </Suspense>

                {/* Footer Decorativo Minimalista */}
                <div className="flex items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
                    <div className="h-px w-10 bg-zinc-800" />
                    <span className="text-[8px] font-mono uppercase tracking-[0.8em] text-zinc-500">Security Core v24.1</span>
                    <div className="h-px w-10 bg-zinc-800" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

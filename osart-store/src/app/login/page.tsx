'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Mail, Lock, LogIn, ChevronRight, Loader2 } from 'lucide-react';
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
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass p-8 border-white/10 ring-1 ring-white/5">
            {message === 'check-email' && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-lg">
                    Registro exitoso. Revisa tu email para confirmar tu cuenta.
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider rounded-lg">
                    {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tunombre@ejemplo.com"
                            required
                            className="w-full bg-zinc-950 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm focus:border-electric-blue/40 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contraseña</label>
                        <Link href="/forgot-password" className="text-[10px] text-electric-blue hover:underline uppercase font-bold tracking-tighter">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Lock size={18} />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full bg-zinc-950 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm focus:border-electric-blue/40 outline-none transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="neon-button w-full flex items-center justify-center gap-2 py-3 mt-4 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>
                            Iniciar Sesión
                            <LogIn size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    ¿Aún no tienes cuenta?
                    <Link href="/register" className="text-electric-blue font-bold hover:underline flex items-center">
                        Regístrate
                        <ChevronRight size={14} />
                    </Link>
                </p>
            </div>
        </div>
    );
};

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-20 bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-electric-blue/5 blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-blue-600/5 blur-[80px] -z-10" />

            <div className="max-w-md w-full px-5 animate-fade">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold mb-3">Bienvenido a <span className="neon-text">OSART</span></h1>
                    <p className="text-muted-foreground text-sm">Ingresa a tu cuenta para gestionar tus pedidos y acceder a precios exclusivos.</p>
                </div>

                <Suspense fallback={
                    <div className="glass p-8 border-white/10 ring-1 ring-white/5 flex items-center justify-center min-h-[400px]">
                        <Loader2 className="animate-spin text-electric-blue" size={32} />
                    </div>
                }>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
};

export default LoginPage;

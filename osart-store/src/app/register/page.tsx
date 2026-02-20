'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) throw error;
            router.push('/login?message=check-email');
        } catch (err: any) {
            setError(err.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-20 bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-electric-blue/5 blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-600/5 blur-[80px] -z-10" />

            <div className="max-w-md w-full px-5 animate-fade">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold mb-3">Únete a <span className="neon-text">OSART</span></h1>
                    <p className="text-muted-foreground text-sm">Crea tu cuenta para acceder a seguimiento de pedidos, historial y beneficios exclusivos.</p>
                </div>

                <div className="glass p-8 border-white/10 ring-1 ring-white/5">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider rounded-lg">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleRegister}>
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Juan Pérez"
                                    required
                                    className="w-full bg-zinc-950 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm focus:border-electric-blue/40 outline-none transition-all"
                                />
                            </div>
                        </div>

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
                                    placeholder="juan@ejemplo.com"
                                    required
                                    className="w-full bg-zinc-950 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm focus:border-electric-blue/40 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
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

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="neon-button w-full flex items-center justify-center gap-2 py-3 mt-4 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                    <>
                                        Crear Cuenta
                                        <UserPlus size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                            ¿Ya tienes una cuenta?
                            <Link href="/login" className="text-electric-blue font-bold hover:underline flex items-center">
                                <ChevronLeft size={14} />
                                Inicia Sesión
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-[10px] text-muted-foreground text-center uppercase tracking-widest">
                    Al registrarte, aceptas nuestros Términos de Servicio y Políticas de Privacidad.
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

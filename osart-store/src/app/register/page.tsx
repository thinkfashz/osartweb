'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus, ChevronLeft, Loader2, ShieldCheck, Cpu, Terminal } from 'lucide-react';
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
            setError(err.message || 'Fallo en la Creación de Operario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-20 bg-background relative overflow-hidden">
            {/* Background Decor - Industrial Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 blur-[160px] -z-10" />

            <div className="max-w-[440px] w-full px-5 relative z-10">
                <div className="mb-12 space-y-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                            <UserPlus size={24} className="text-sky-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-white">
                        Protocolo <span className="text-sky-500">Registro</span>
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-zinc-800" />
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600">Task: NEW_OPERARIO_INIT</span>
                        <div className="h-px w-8 bg-zinc-800" />
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-8 relative overflow-hidden group">
                    {/* Structural Accents */}
                    <div className="absolute top-0 right-0 w-16 h-[1px] bg-sky-500/30" />
                    <div className="absolute top-0 right-0 w-[1px] h-16 bg-sky-500/30" />

                    <div className="flex items-center gap-3 mb-10 opacity-60">
                        <Terminal size={12} className="text-sky-500" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">Node_Provisioning_V1.0</span>
                    </div>

                    {error && (
                        <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] italic">
                            [ALERT]: {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div className="space-y-3">
                            <label htmlFor="fullName" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 pl-1 flex items-center gap-2">
                                <div className="w-1 h-1 bg-zinc-700" /> Identidad_Operario
                            </label>
                            <div className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-sky-500 transition-colors" size={16} />
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="NOMBRE_REFERENCIAL"
                                    required
                                    className="w-full bg-zinc-950 border border-white/5 rounded-none py-4 pl-12 pr-4 text-xs font-mono text-white placeholder:text-zinc-800 focus:border-sky-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 pl-1 flex items-center gap-2">
                                <div className="w-1 h-1 bg-zinc-700" /> Enlace_Comunicación
                            </label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-sky-500 transition-colors" size={16} />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="EMAIL@SISTEMA.CL"
                                    required
                                    className="w-full bg-zinc-950 border border-white/5 rounded-none py-4 pl-12 pr-4 text-xs font-mono text-white placeholder:text-zinc-800 focus:border-sky-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="password" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 pl-1 flex items-center gap-2">
                                <div className="w-1 h-1 bg-zinc-700" /> Hash_Protección
                            </label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-sky-500 transition-colors" size={16} />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="MIN_8_CARACTERES"
                                    required
                                    className="w-full bg-zinc-950 border border-white/5 rounded-none py-4 pl-12 pr-4 text-xs font-mono text-white placeholder:text-zinc-800 focus:border-sky-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative py-4 bg-zinc-100 text-black font-black text-[10px] uppercase italic tracking-[0.3em] hover:bg-sky-500 transition-all active:scale-[0.98] disabled:opacity-50 group/btn"
                            >
                                <div className="absolute inset-0 bg-sky-500 opacity-0 group-hover/btn:opacity-20 blur-xl transition-opacity" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                        <>
                                            Iniciar Registro
                                            <UserPlus size={16} />
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <Link href="/login" className="text-[10px] text-zinc-500 hover:text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                            <ChevronLeft size={14} />
                            Regresar a Terminal de Acceso
                        </Link>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-4 opacity-30 pointer-events-none">
                    <p className="text-[8px] text-zinc-600 text-center uppercase font-mono tracking-widest leading-loose">
                        Al ejecutar registro, usted acepta los protocolos de datos y términos de operación OSART-PRO-V1.
                    </p>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-1 h-2 bg-zinc-700" />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

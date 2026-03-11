'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, Loader2, ChevronRight, Terminal, Cpu } from 'lucide-react';
import { supabase } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.updateUser({
                password: password,
            });

            if (resetError) throw resetError;
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Error en Protocolo de Re-encriptación');
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
                            <Lock size={24} className="text-sky-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-white">
                        Reset <span className="text-sky-500">Protocol</span>
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-zinc-800" />
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600">Task: RE_ENCRYPT_USER</span>
                        <div className="h-px w-8 bg-zinc-800" />
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-8 relative overflow-hidden group">
                    {/* Structural Accents */}
                    <div className="absolute top-0 right-0 w-16 h-[1px] bg-sky-500/30" />
                    <div className="absolute top-0 right-0 w-[1px] h-16 bg-sky-500/30" />

                    <div className="flex items-center gap-3 mb-10 opacity-60">
                        <Terminal size={12} className="text-sky-500" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">Credential_Update_V1.0</span>
                    </div>

                    {success ? (
                        <div className="space-y-8 animate-fade text-center">
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                                    Protocolo Completo. Código de acceso actualizado satisfactoriamente.
                                </p>
                            </div>
                            <p className="text-[9px] font-mono text-zinc-500 uppercase animate-pulse">
                                Redireccionando a Terminal de Acceso...
                            </p>
                        </div>
                    ) : (
                        <form className="space-y-8" onSubmit={handleReset}>
                            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider leading-relaxed text-center">
                                Defina su nuevo Hash de Protección para restaurar la sincronización del nodo.
                            </p>

                            {error && (
                                <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] italic">
                                    [ALERT]: {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <label htmlFor="password" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 pl-1 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-zinc-700" /> Nuevo_Código_Acceso
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative py-4 bg-zinc-100 text-black font-black text-[10px] uppercase italic tracking-[0.3em] hover:bg-sky-500 transition-all active:scale-[0.98] disabled:opacity-50 group/btn"
                            >
                                <div className="absolute inset-0 bg-sky-500 opacity-0 group-hover/btn:opacity-20 blur-xl transition-opacity" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                        <>
                                            Aplicar Cambios
                                            <ShieldCheck size={16} />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-12 flex items-center justify-between opacity-30 px-2 pointer-events-none">
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-zinc-700" />)}
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-mono uppercase tracking-widest text-zinc-500">
                        <Cpu size={10} />
                        Identity_Safe_Guard
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

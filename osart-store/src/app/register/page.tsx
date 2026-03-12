'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { UserPlus, ChevronLeft, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterForm = () => {
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
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signUpError) throw signUpError;
            router.push('/login?message=check-email');
        } catch (err: any) {
            setError(err.message || 'Fallo en la creación de perfil');
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
            <AnimatePresence mode="wait">
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] text-center mb-6"
                    >
                        [ERROR]: {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleRegister}>
                <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 transition-colors group-focus-within:text-sky-500 ml-1">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. Alex Rivera"
                        className="w-full bg-transparent border-b border-zinc-800 py-4 px-1 text-sm font-medium text-white placeholder:text-zinc-700 focus:border-sky-500 outline-none transition-all duration-500"
                        required
                    />
                </div>

                <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 transition-colors group-focus-within:text-sky-500 ml-1">
                        Correo de Operación
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="usuario@osart.com"
                        className="w-full bg-transparent border-b border-zinc-800 py-4 px-1 text-sm font-medium text-white placeholder:text-zinc-700 focus:border-sky-500 outline-none transition-all duration-500"
                        required
                    />
                </div>

                <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 transition-colors group-focus-within:text-sky-500 ml-1">
                        Código de Acceso
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full bg-transparent border-b border-zinc-800 py-4 px-1 text-sm font-medium text-white placeholder:text-zinc-700 focus:border-sky-500 outline-none transition-all duration-500"
                        required
                    />
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-white text-black text-[11px] font-black uppercase italic tracking-[0.4em] rounded-full hover:bg-sky-500 transition-all duration-500 active:scale-[0.98] disabled:opacity-30 relative overflow-hidden group/btn"
                    >
                        <div className="absolute inset-0 bg-sky-400 opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {loading ? <Loader2 className="animate-spin" size={16} /> : "Crear Perfil OSART"}
                        </span>
                    </button>
                </div>
            </form>

            <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                <Link 
                    href="/login" 
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group"
                >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Volver a Identificación
                </Link>
            </div>
        </motion.div>
    );
};

const RegisterPage = () => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full" />
            </div>

            <div className="w-full max-w-lg relative z-10 flex flex-col items-center space-y-16">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <div className="p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl">
                        <UserPlus size={32} className="text-sky-500" strokeWidth={1} />
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter sm:text-6xl">
                            REGISTRO <span className="text-sky-400">CORE</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 mt-2">Unirse a la Red OSART</p>
                    </div>
                </motion.div>

                <Suspense fallback={
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-sky-500" size={32} />
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Cargando Protocolos...</span>
                    </div>
                }>
                    <RegisterForm />
                </Suspense>

                <div className="text-[8px] text-zinc-700 text-center uppercase font-mono tracking-[0.3em] max-w-[280px] leading-relaxed">
                    Al unirse, usted acepta los protocolos de tratamiento de datos cifrados de OSART Industrial.
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

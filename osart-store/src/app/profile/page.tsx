'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    Activity,
    Zap,
    Package,
    Shield,
    ChevronRight,
    ArrowUpRight,
    History,
    User as UserIcon,
    Settings,
    LogOut,
    Award,
    Cpu,
    Box
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase-auth';
// Redesigned to work without external date-fns dependency for maximum performance

interface ProfileData {
    full_name: string;
    email: string;
    role: string;
    knowledge_points: number;
}

interface Order {
    id: string;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
    payment_status: string;
}

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function fetchProfileData() {
            setLoading(true);
            try {
                // Fetch Profile
                const { data: pData, error: pError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user!.id)
                    .single();

                if (pError) {
                    console.error('Profile fetch error:', pError.message, pError.code);
                } else {
                    setProfile(pData);
                }
            } catch (err: any) {
                console.error('Unexpected profile error:', err?.message || err);
            }

            // Fetch Orders - separate try/catch so it doesn't kill the profile
            try {
                const res = await fetch(`/api/orders?userId=${user?.id}`);
                if (res.ok) {
                    const oData = await res.json();
                    if (Array.isArray(oData)) setOrders(oData);
                } else {
                    console.warn('Orders API returned status', res.status);
                }
            } catch (err: any) {
                console.warn('Orders fetch failed (non-critical):', err?.message || err);
            } finally {
                setLoading(false);
            }
        }

        fetchProfileData();
    }, [user]);

    if (!user && !loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="max-w-md w-full relative z-10">
                    <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 mb-10 mx-auto animate-pulse">
                        <Shield size={48} />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter text-white mb-4">
                        Acceso <span className="text-rose-500">Denegado</span>
                    </h1>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase mb-12 tracking-[0.3em] leading-loose">
                        [ERROR_403]: SESIÓN NO DETECTADA EN EL NODO ACTUAL.<br />
                        SE REQUIERE AUTORIZACIÓN NIVEL 1 PARA ACCEDER AL PANEL.
                    </p>
                    <Link href="/login" className="group relative px-12 py-5 bg-white text-black font-black uppercase italic tracking-[0.2em] overflow-hidden transition-all hover:bg-sky-500 block w-full text-center">
                        <div className="absolute inset-0 bg-sky-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10">Sincronizar Credenciales</span>
                    </Link>
                </div>
            </div>
        );
    }

    const xpProgress = profile ? (profile.knowledge_points % 1000) / 10 : 0;
    const currentLevel = profile ? Math.floor(profile.knowledge_points / 1000) + 1 : 1;

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-sky-500/5 blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-600/5 blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Dashboard Header */}
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Terminal de Operario Activa</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter text-white leading-[0.8]">
                            Panel de <br /> <span className="text-sky-500">Control</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-6 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-md">
                        <div className="w-16 h-16 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-white/50 relative group">
                            <UserIcon size={32} />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-sky-500 rounded-lg flex items-center justify-center text-[10px] font-black text-background">
                                {currentLevel}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xl font-black uppercase italic text-white tracking-tighter">
                                {profile?.full_name || 'Operario_Anonimo'}
                            </div>
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                UID: {user?.id.slice(0, 12).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {/* XP Visualization */}
                    <div className="lg:col-span-2 p-8 bg-zinc-900 border border-white/10 rounded-2xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Award size={120} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Progreso de Conocimiento (XP)</h3>
                                <div className="text-2xl font-black text-white italic tracking-tighter">NIVEL {currentLevel} - OPERARIO SENIOR</div>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black text-sky-500 tracking-tighter">{(profile?.knowledge_points || 0).toLocaleString()}</span>
                                <span className="text-[10px] font-mono text-white/20 ml-2">XP_TOT</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-4 bg-zinc-800 rounded-full overflow-hidden border border-white/5 p-0.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${xpProgress}%` }}
                                    className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full relative shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                                >
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                </motion.div>
                            </div>
                            <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
                                <span>{profile?.knowledge_points || 0} XP</span>
                                <span>{(Math.floor((profile?.knowledge_points || 0) / 1000) + 1) * 1000} XP</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="space-y-2">
                                <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Misiones</div>
                                <div className="text-lg font-black text-white tracking-tighter">12/20</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Badge</div>
                                <div className="text-lg font-black text-emerald-500 tracking-tighter uppercase">Alpha</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Ranking</div>
                                <div className="text-lg font-black text-zinc-400 tracking-tighter uppercase">Top 5%</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="p-8 bg-zinc-900 border border-white/10 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-sky-500">
                                <Cpu size={20} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Sincronización Total</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Pedidos Totales</span>
                                    <span className="text-2xl font-black text-white italic tracking-tighter">{orders.length}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Inversión HW</span>
                                    <span className="text-2xl font-black text-white italic tracking-tighter">
                                        ${(orders.reduce((acc, o) => acc + (o.total || 0), 0)).toLocaleString('es-CL')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center justify-center gap-2 py-4 mt-8 rounded-xl border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500/5 transition-all"
                        >
                            <LogOut size={14} />
                            DESCONECTAR TERMINAL
                        </button>
                    </div>
                </div>

                {/* Order History */}
                <div className="space-y-8">
                    <div className="flex items-end justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">LOG_DE_SISTEMA</span>
                            </div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Historial de Despachos</h2>
                        </div>
                        <Link href="/catalog" className="hidden sm:flex items-center gap-2 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">
                            ADQUIRIR MÁS HW <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-24 bg-zinc-900 animate-pulse rounded-2xl border border-white/5" />
                            ))
                        ) : orders.length === 0 ? (
                            <div className="py-20 text-center bg-zinc-900 border border-white/10 rounded-2xl border-dashed">
                                <Box className="mx-auto text-zinc-700 mb-6" size={48} />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Ningún componente registrado en el historial</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group bg-zinc-900 border border-white/5 hover:border-white/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-sky-500 border border-white/10">
                                            <History size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                                ORD_{order.order_number || order.id.slice(0, 8).toUpperCase()}
                                            </div>
                                            <div className="text-sm font-black text-white uppercase italic tracking-tight">
                                                {new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
                                                    .format(new Date(order.created_at))
                                                    .toUpperCase()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="space-y-1 text-right">
                                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Inversión</div>
                                            <div className="text-xl font-black text-white tracking-tighter">
                                                ${(order.total || 0).toLocaleString('es-CL')}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                                order.status === 'completed'
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            )}>
                                                {order.status === 'completed' ? 'Sincronizado' : 'En Tránsito'}
                                            </div>
                                            <button className="p-3 bg-white/5 border border-white/10 rounded-lg text-white/40 group-hover:text-sky-500 group-hover:border-sky-500/40 transition-all">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


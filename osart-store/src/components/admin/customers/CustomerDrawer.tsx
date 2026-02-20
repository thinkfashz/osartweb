"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Mail,
    Phone,
    Calendar,
    ShoppingBag,
    MapPin,
    CreditCard,
    Shield,
    Activity,
    Zap,
    ShieldAlert,
    CheckCircle2,
    ExternalLink,
    Clock
} from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { ADMIN_CUSTOMER_DETAIL } from '@/lib/graphql/adminQueries';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { cn } from '@/lib/utils';

interface CustomerDrawerProps {
    customerId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

interface AdminCustomerData {
    adminCustomer: any;
}

export default function CustomerDrawer({ customerId, isOpen, onClose }: CustomerDrawerProps) {
    const { data, loading } = useQuery<AdminCustomerData>(ADMIN_CUSTOMER_DETAIL, {
        variables: { id: customerId },
        skip: !customerId,
    });

    const customer = data?.adminCustomer;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val || 0);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).toUpperCase();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                        className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-100 overflow-hidden"
                    >
                        {/* Ambient Header Background */}
                        <div className="absolute top-0 right-0 w-full h-80 bg-slate-50 -z-10 opacity-50" style={{ backgroundImage: 'linear-gradient(to bottom, transparent 90%, white), radial-gradient(circle at 100% 0%, #cbd5e1 0%, transparent 40%)' }} />

                        {/* Top Bar */}
                        <div className="flex items-center justify-between p-8 border-b border-slate-100/50 bg-white/40 backdrop-blur-xl relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-950 text-white rounded-2xl shadow-xl shadow-slate-900/20">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Terminal Diagnostics</h2>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none mt-1">Status: Operational // Data Link Active</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:bg-slate-950 hover:text-white transition-all active:scale-90"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-12 pb-32">
                            {loading ? (
                                <div className="space-y-8 p-4">
                                    <div className="h-40 w-full bg-slate-50 rounded-[2.5rem] animate-pulse" />
                                    <TableSkeleton rows={5} />
                                </div>
                            ) : customer ? (
                                <>
                                    {/* Profile Hero */}
                                    <div className="flex flex-col items-center text-center space-y-6">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-blue-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                            <div className="w-32 h-32 rounded-[2.5rem] bg-slate-950 flex items-center justify-center text-white text-4xl font-black italic relative border-4 border-white shadow-2xl">
                                                {customer.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl border-4 border-white shadow-xl">
                                                <Shield size={20} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-4xl font-black text-slate-950 tracking-tighter uppercase italic leading-none mb-2">{customer.fullName}</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] font-mono">UID: {customer.id}</p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 w-full">
                                            {[
                                                { label: 'Órdenes', value: customer.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-600' },
                                                { label: 'Inversión', value: formatCurrency(customer.totalSpent), icon: CreditCard, color: 'text-emerald-600' },
                                                { label: 'XP Points', value: '2,450', icon: Zap, color: 'text-amber-500' },
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100/50 text-center space-y-1 hover:bg-white hover:border-slate-200 hover:shadow-lg transition-all">
                                                    <stat.icon size={16} className={cn("mx-auto mb-2", stat.color)} />
                                                    <div className="text-sm font-black text-slate-950 italic">{stat.value}</div>
                                                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Technical Specs */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                                            <div className="w-1.5 h-4 bg-slate-950 rounded-full" />
                                            Especificaciones del Nodo
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <Mail size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Enlace Digital</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-950 truncate">{customer.email}</p>
                                            </div>
                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <Phone size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Línea de Voz</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-950">{customer.phone || 'NO REGISTRADO'}</p>
                                            </div>
                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 col-span-2 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-slate-400">
                                                        <Calendar size={16} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Ciclo de Vida</span>
                                                    </div>
                                                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase">Activo</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-950">ENROLADO: {formatDate(customer.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Sequence */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                                                <div className="w-1.5 h-4 bg-slate-950 rounded-full" />
                                                Secuencia de Órdenes
                                            </h4>
                                            <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:underline">
                                                Ver Todos
                                                <ExternalLink size={12} />
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {customer.orders?.length > 0 ? (
                                                customer.orders.map((order: any) => (
                                                    <div key={order.id} className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-900/5 transition-all">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors">
                                                                    <ShoppingBag size={18} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-[10px] font-black text-slate-950 uppercase tracking-tight">#{order.id.substring(0, 12)}</div>
                                                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(order.createdAt)}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm font-black text-slate-950 italic">{formatCurrency(order.total)}</div>
                                                                <div className={cn(
                                                                    "text-[8px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full inline-block border",
                                                                    order.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                                                )}>
                                                                    {order.status}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-wrap text-[9px] font-bold text-slate-400 uppercase tracking-tight opacity-50">
                                                            <span>{order.itemCount || 0} Ítems</span>
                                                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                            <span>Metodo: {order.paymentMethod || 'SYSTEM'}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-20 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-100 rounded-[2.5rem] opacity-30">
                                                    <ShieldAlert size={32} />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sin registros históricos</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">
                                    <p className="text-xs font-bold uppercase tracking-widest">Protocolo de Error: Cliente no encontrado</p>
                                </div>
                            )}
                        </div>

                        {/* Action Dock */}
                        <div className="p-8 border-t border-slate-100 bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.02)] flex gap-4">
                            <button className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-950/20 hover:scale-[1.02] active:scale-95 transition-all">
                                <Mail size={16} />
                                Notificación PUSH
                            </button>
                            <button className="px-6 py-5 rounded-2xl border-2 border-slate-100 text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all">
                                <ShieldAlert size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

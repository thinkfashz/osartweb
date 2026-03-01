'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import {
    Settings, Shield, Zap, Database, Save, Bell, Globe,
    Moon, Loader2, Check, ChevronRight, User, Lock, RefreshCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface ToggleProps {
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}

function Toggle({ checked, onChange, disabled }: ToggleProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 shrink-0 disabled:opacity-50 ${checked ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-zinc-700'}`}
        >
            <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`w-4 h-4 bg-white rounded-full shadow-md ${checked ? 'translate-x-6' : 'translate-x-0'}`}
            />
        </button>
    );
}

interface SettingRow {
    label: string;
    description: string;
    key: string;
}

const SECURITY_SETTINGS: SettingRow[] = [
    { label: 'Autenticación Multifactor', description: 'Requerido para administradores', key: 'mfa' },
    { label: 'Log de Accesos', description: 'Registrar todos los inicios de sesión', key: 'access_log' },
    { label: 'IP Allowlist', description: 'Restringir acceso a IPs autorizadas', key: 'ip_allowlist' },
];

const PERFORMANCE_SETTINGS: SettingRow[] = [
    { label: 'Caché de Productos', description: 'Almacenar catálogo en memoria', key: 'product_cache' },
    { label: 'Notificaciones Push', description: 'Alertas de stock en tiempo real', key: 'push_notifications' },
    { label: 'Modo Compacto', description: 'Reducir animaciones en tablas grandes', key: 'compact_mode' },
];

export default function SettingsPage() {
    const { user } = useAuth();
    const [settings, setSettings] = useState<Record<string, any>>({
        mfa: true,
        access_log: true,
        ip_allowlist: false,
        product_cache: true,
        push_notifications: false,
        compact_mode: false,
        osart_data_mode: 'database', // 'local' | 'database'
        osart_custom_db_url: '',
        osart_custom_db_key: ''
    });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);

    const toggle = (key: string) => (val: boolean) => {
        setSettings(s => ({ ...s, [key]: val }));
        setDirty(true);
        setSaved(false);
    };

    const handleTextChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(s => ({ ...s, [key]: e.target.value }));
        setDirty(true);
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulate a config save (could write to localStorage or a settings API)
        await new Promise(r => setTimeout(r, 600));
        localStorage.setItem('osart_admin_settings', JSON.stringify(settings));
        setSaving(false);
        setSaved(true);
        setDirty(false);
        toast.success('Configuración guardada en el sistema');
        setTimeout(() => setSaved(false), 3000);
    };

    // Load saved settings on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('osart_admin_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                setSettings(prev => ({ ...prev, ...parsed }));
            }
        } catch { /* ignore */ }
    }, []);

    const SettingGroup = ({ title, icon: Icon, color, rows }: { title: string; icon: any; color: string; rows: SettingRow[] }) => (
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 md:p-8 space-y-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={16} />
                </div>
                {title}
            </h3>
            <div className="space-y-3">
                {rows.map(row => (
                    <div key={row.key} className="flex items-center justify-between bg-zinc-950/60 rounded-2xl px-5 py-4 border border-zinc-800/50 hover:border-zinc-700 transition-all">
                        <div className="min-w-0 pr-4">
                            <p className="text-sm font-black text-white uppercase italic tracking-tight">{row.label}</p>
                            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">{row.description}</p>
                        </div>
                        <Toggle checked={settings[row.key]} onChange={toggle(row.key)} />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <PageTransition>
            <div className="space-y-6 md:space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-electric-blue">Panel de Control</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                            Configuración
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
                            Ajustes del núcleo operativo OSART
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving || !dirty}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg disabled:opacity-40 ${dirty ? 'bg-white text-black hover:bg-electric-blue' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" />
                            : saved ? <Check size={16} className="text-emerald-500" />
                                : <Save size={16} />}
                        {saving ? 'Guardando...' : saved ? 'Guardado ✓' : 'Guardar Configuración'}
                    </button>
                </div>

                {/* User info card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 flex items-center gap-5">
                    <div className="w-14 h-14 bg-zinc-800 rounded-2xl grid place-items-center border border-zinc-700 shrink-0">
                        <User size={24} className="text-electric-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-black text-white uppercase italic text-lg tracking-tighter truncate">
                            {user?.email?.split('@')[0] || 'Admin'}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest truncate">{user?.email}</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Admin
                    </div>
                </div>

                {/* Custom Data Source Block */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 md:p-8 space-y-5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-zinc-800 text-zinc-300">
                            <Database size={16} />
                        </div>
                        Origen de Datos del Catálogo
                    </h3>

                    <div className="flex flex-col sm:flex-row items-center justify-between bg-zinc-950/60 rounded-2xl px-5 py-4 border border-zinc-800/50">
                        <div className="min-w-0 pr-4 mb-4 sm:mb-0">
                            <p className="text-sm font-black text-white uppercase italic tracking-tight">Modo de Catálogo</p>
                            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
                                {settings.osart_data_mode === 'local' ? 'Usando lista local (Demo)' : 'Conectado a Base de Datos'}
                            </p>
                        </div>
                        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 shrink-0">
                            <button
                                onClick={() => { setSettings(s => ({ ...s, osart_data_mode: 'local' })); setDirty(true); setSaved(false); }}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${settings.osart_data_mode === 'local' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Demo (Local)
                            </button>
                            <button
                                onClick={() => { setSettings(s => ({ ...s, osart_data_mode: 'database' })); setDirty(true); setSaved(false); }}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${settings.osart_data_mode === 'database' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Base de Datos
                            </button>
                        </div>
                    </div>

                    {settings.osart_data_mode === 'database' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-zinc-950/60 rounded-2xl p-5 border border-zinc-800/50 space-y-4"
                        >
                            <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest leading-relaxed">
                                Deja los campos en blanco para usar la base de datos por defecto del proyecto. Completa para enlazar tu propia base Supabase temporalmente.
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Supabase URL Personalizada</label>
                                    <input
                                        type="text"
                                        value={settings.osart_custom_db_url || ''}
                                        onChange={handleTextChange('osart_custom_db_url')}
                                        placeholder="https://tuid.supabase.co"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Supabase Anon/Service Key</label>
                                    <input
                                        type="password"
                                        value={settings.osart_custom_db_key || ''}
                                        onChange={handleTextChange('osart_custom_db_key')}
                                        placeholder="eyJh..."
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-white focus:ring-1 focus:ring-white transition-all outline-none font-mono"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <SettingGroup
                        title="Seguridad y Accesos"
                        icon={Shield}
                        color="bg-emerald-500/20 text-emerald-400"
                        rows={SECURITY_SETTINGS}
                    />
                    <SettingGroup
                        title="Rendimiento y Notificaciones"
                        icon={Zap}
                        color="bg-electric-blue/20 text-electric-blue"
                        rows={PERFORMANCE_SETTINGS}
                    />
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-6 md:p-8 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 flex items-center gap-2">
                        <Lock size={14} />
                        Zona Restringida
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950 rounded-2xl p-5 border border-red-500/10">
                        <div>
                            <p className="font-black text-white uppercase italic text-sm tracking-tight">Borrar caché del sistema</p>
                            <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mt-1">Elimina todos los datos en memoria local</p>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('osart_admin_settings');
                                localStorage.removeItem('osart_products_cache');
                                toast.success('Caché del sistema borrada');
                            }}
                            className="px-5 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all whitespace-nowrap shrink-0"
                        >
                            Borrar Caché
                        </button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

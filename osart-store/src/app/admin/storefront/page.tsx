"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Layout,
    Type,
    Image as ImageIcon,
    Palette,
    Save,
    Eye,
    RotateCcw,
    Sparkles,
    CheckCircle2,
    Info
} from 'lucide-react';
import { useStorefront } from '@/context/StorefrontContext';
import { toast } from 'sonner';
import Link from 'next/link';

export default function StorefrontPage() {
    const { settings, loading, updateSettings } = useStorefront();
    const [isSaving, setIsSaving] = useState(false);

    // Local state for the form
    const [formData, setFormData] = useState({
        hero_title: '',
        hero_subtitle: '',
        primary_color: '',
        secondary_color: ''
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                hero_title: settings.hero_title,
                hero_subtitle: settings.hero_subtitle,
                primary_color: settings.primary_color,
                secondary_color: settings.secondary_color
            });
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings(formData);
            toast.success('Cambios publicados con éxito');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Error al guardar los cambios');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <RotateCcw className="animate-spin text-sky-500" size={40} />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Cargando Configuración...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full">
                        <Layout size={12} className="text-sky-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Personalizador de Tienda</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter">
                        Diseña tu <span className="text-sky-500 italic">Storefront</span>.
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-xl">
                        Ajusta la apariencia visual de tu tienda en tiempo real. Los cambios se aplicarán instantáneamente a todos los clientes.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        target="_blank"
                        className="px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-2"
                    >
                        <Eye size={16} />
                        Vista Previa
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-sky-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <RotateCcw size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        Publicar Cambios
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Configuration Sections */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero Section Configuration */}
                    <section className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 p-8 md:p-10 space-y-8 relative overflow-hidden group shadow-sm transition-all hover:shadow-2xl hover:shadow-sky-500/5">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-2xl text-sky-500">
                                <Type size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Encabezado Principal (Hero)</h3>
                                <p className="text-xs text-zinc-500">Controla el mensaje principal que ven tus clientes al entrar.</p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Título del Hero</label>
                                <input
                                    type="text"
                                    name="hero_title"
                                    value={formData.hero_title}
                                    onChange={handleChange}
                                    placeholder="Ej: La Energía que Mueve tus Reparaciones."
                                    className="w-full bg-zinc-100 dark:bg-zinc-950 border border-transparent focus:border-sky-500/50 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white font-bold transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Subtítulo Descriptivo</label>
                                <textarea
                                    name="hero_subtitle"
                                    rows={3}
                                    value={formData.hero_subtitle}
                                    onChange={handleChange}
                                    placeholder="Breve descripción de tu tienda..."
                                    className="w-full bg-zinc-100 dark:bg-zinc-950 border border-transparent focus:border-sky-500/50 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white font-medium transition-all outline-none resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Featured Background Configuration */}
                    <section className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 p-8 md:p-10 space-y-8 relative overflow-hidden group shadow-sm transition-all hover:shadow-2xl hover:shadow-cyan-500/5">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-2xl text-cyan-500">
                                <ImageIcon size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Fondo & Media</h3>
                                <p className="text-xs text-zinc-500">Gestiona los elementos visuales dinámicos del fondo.</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px] p-6 bg-zinc-100 dark:bg-zinc-950 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-3 group/upload cursor-not-allowed opacity-50">
                                <div className="p-3 bg-white dark:bg-zinc-900 rounded-full shadow-lg">
                                    <ImageIcon size={24} className="text-zinc-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Subida de Imagen (Próximamente)</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Summaries & Settings */}
                <div className="space-y-8">
                    {/* Theme Pallete */}
                    <section className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <Palette size={18} className="text-sky-500" />
                            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest">Identidad Visual</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Color Primario</label>
                                <div className="flex items-center gap-3 p-4 bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-transparent focus-within:border-sky-500/30 transition-all">
                                    <input
                                        type="color"
                                        name="primary_color"
                                        value={formData.primary_color}
                                        onChange={handleChange}
                                        className="w-10 h-10 rounded-full bg-transparent border-none cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        name="primary_color"
                                        value={formData.primary_color}
                                        onChange={handleChange}
                                        className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-zinc-600 dark:text-zinc-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Color Secundario</label>
                                <div className="flex items-center gap-3 p-4 bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-transparent focus-within:border-cyan-500/30 transition-all">
                                    <input
                                        type="color"
                                        name="secondary_color"
                                        value={formData.secondary_color}
                                        onChange={handleChange}
                                        className="w-10 h-10 rounded-full bg-transparent border-none cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        name="secondary_color"
                                        value={formData.secondary_color}
                                        onChange={handleChange}
                                        className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-zinc-600 dark:text-zinc-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Status Card */}
                    <div className="bg-sky-500 text-white rounded-[2.5rem] p-8 space-y-4 shadow-2xl shadow-sky-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Sparkles size={100} />
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Sincronización Activa</span>
                        </div>
                        <h4 className="text-xl font-black tracking-tight leading-tight">Tu tienda es 100% personalizable</h4>
                        <p className="text-xs font-medium opacity-80 leading-relaxed">
                            Cualquier cambio guardado aquí se verá reflejado en la tienda pública de inmediato gracias a Supabase.
                        </p>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-zinc-50 dark:bg-zinc-900/30 rounded-[2rem] border border-zinc-200 dark:border-zinc-800">
                        <Info size={18} className="text-zinc-400 mt-1 shrink-0" />
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            <span className="font-bold text-zinc-900 dark:text-white">Tip de Experto:</span> Una vez guardados, los cambios son definitivos para todos tus clientes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

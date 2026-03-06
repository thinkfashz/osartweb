'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, RefreshCcw, Edit2, Trash2, Tag,
    X, Loader2, ChevronRight, Package, FolderOpen, Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import { AdminCategory } from '@/types/admin';

interface CategoryFormData {
    name: string;
    description: string;
    image_url: string;
    parent_id: string;
}

const EMPTY_FORM: CategoryFormData = { name: '', description: '', image_url: '', parent_id: '' };

// ─── Category Form Modal ────────────────────────────────────────────────────
function CategoryModal({
    isOpen,
    onClose,
    onSave,
    editing,
    categories,
    isSaving,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CategoryFormData) => void;
    editing: AdminCategory | null;
    categories: AdminCategory[];
    isSaving: boolean;
}) {
    const [form, setForm] = useState<CategoryFormData>(EMPTY_FORM);

    useEffect(() => {
        if (editing) {
            setForm({
                name: editing.name,
                description: editing.description ?? '',
                image_url: editing.image_url ?? '',
                parent_id: editing.parent_id ?? '',
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [editing, isOpen]);

    const set = (k: keyof CategoryFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) { toast.error('El nombre es requerido'); return; }
        onSave(form);
    };

    const parentOptions = categories.filter(c => c.id !== editing?.id);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-electric-blue/40 rounded-tl-3xl" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-electric-blue/40 rounded-br-3xl" />

                        <div className="p-8 space-y-6">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-electric-blue">
                                        <Tag size={12} />
                                        {editing ? 'Editar Categoría' : 'Nueva Categoría'}
                                    </div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                                        {editing ? editing.name : 'Registrar Clase'}
                                    </h3>
                                </div>
                                <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Nombre *</label>
                                    <input
                                        type="text" value={form.name} onChange={set('name')} required
                                        placeholder="Ej: Microcontroladores"
                                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-electric-blue rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                                    />
                                    {form.name && (
                                        <p className="text-[9px] text-zinc-600 font-mono px-1">
                                            slug: {form.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Descripción</label>
                                    <textarea
                                        value={form.description} onChange={set('description')}
                                        placeholder="Descripción de la categoría..."
                                        rows={2}
                                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-electric-blue rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Parent Category */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Categoría Padre (opcional)</label>
                                    <select
                                        value={form.parent_id} onChange={set('parent_id')}
                                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-electric-blue rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                                    >
                                        <option value="">— Sin categoría padre —</option>
                                        {parentOptions.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Image URL */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">URL de Imagen</label>
                                    <input
                                        type="url" value={form.image_url} onChange={set('image_url')}
                                        placeholder="https://..."
                                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-electric-blue rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={onClose}
                                        className="flex-1 py-3 rounded-xl border border-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={isSaving}
                                        className="flex-1 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-electric-blue hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                                        {isSaving ? 'Guardando...' : (editing ? 'Actualizar' : 'Crear')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
import { useCategories } from '@/hooks/useShop';

export default function CategoriesPage() {
    const { data, loading: hookLoading, isValidating, mutate } = useCategories();
    const categories = data?.categories || [];
    const loading = hookLoading && categories.length === 0;

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const openCreate = () => { setEditingCategory(null); setIsModalOpen(true); };
    const openEdit = (cat: AdminCategory) => { setEditingCategory(cat); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingCategory(null); };

    const handleSave = async (formData: CategoryFormData) => {
        setIsSaving(true);
        try {
            const isEdit = !!editingCategory;
            const body = isEdit
                ? { id: editingCategory!.id, ...formData }
                : formData;

            const res = await fetch('/api/categories', {
                method: isEdit ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const dataResp = await res.json();

            if (!res.ok) { toast.error(dataResp.error || 'Error al guardar'); return; }

            toast.success(isEdit ? `"${dataResp.name}" actualizado ✓` : `"${dataResp.name}" creado ✓`);
            closeModal();
            mutate();
        } catch {
            toast.error('Error de conexión');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (cat: AdminCategory) => {
        if (!confirm(`¿Eliminar "${cat.name}"? Los productos en esta categoría quedarán sin clasificar.`)) return;
        setDeletingId(cat.id);
        try {
            const res = await fetch(`/api/categories?id=${cat.id}`, { method: 'DELETE' });
            if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error al eliminar'); return; }
            toast.success(`"${cat.name}" eliminado`);
            mutate();
        } catch {
            toast.error('Error de conexión');
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = categories.filter((c: AdminCategory) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.description ?? '').toLowerCase().includes(search.toLowerCase())
    );

    const parentMap = Object.fromEntries(categories.map((c: AdminCategory) => [c.id, c.name]));

    return (
        <PageTransition>
            <div className="space-y-6 md:space-y-10 pb-20">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-electric-blue">Sistema de Clasificación</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                            Categorías
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
                            {categories.length} clases registradas en el índice de hardware
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 lg:w-64 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
                            <input
                                type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="BUSCAR..."
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-2xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest outline-none transition-all text-white placeholder:text-zinc-600"
                            />
                        </div>
                        {/* Refresh */}
                        <button onClick={mutate}
                            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-all active:scale-95 shrink-0">
                            <RefreshCcw size={18} className={isValidating ? 'animate-spin' : ''} />
                        </button>
                        {/* Create */}
                        <button onClick={openCreate}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-electric-blue transition-colors shadow-lg shrink-0">
                            <Plus size={16} />
                            <span className="hidden sm:inline">Nueva</span>
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Categorías', value: categories.length, icon: Layers },
                        { label: 'Con Subcategorías', value: categories.filter((c: AdminCategory) => c.parent_id).length, icon: FolderOpen },
                        { label: 'Productos Indexados', value: categories.reduce((a: number, c: AdminCategory) => a + (c.productCount || 0), 0), icon: Package },
                    ].map(stat => (
                        <div key={stat.label} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-electric-blue shrink-0">
                                <stat.icon size={18} />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-white">{stat.value}</div>
                                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Categories Table */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
                        <div className="col-span-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Categoría</div>
                        <div className="col-span-3 text-[9px] font-black uppercase tracking-widest text-zinc-500 hidden md:block">Descripción</div>
                        <div className="col-span-2 text-[9px] font-black uppercase tracking-widest text-zinc-500 hidden sm:block text-center">Padre</div>
                        <div className="col-span-2 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">Productos</div>
                        <div className="col-span-1 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-right">·</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-zinc-800/50">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="px-6 py-5 grid grid-cols-12 gap-4 animate-pulse">
                                    <div className="col-span-4 h-5 bg-zinc-800 rounded-lg" />
                                    <div className="col-span-3 h-4 bg-zinc-800/70 rounded-lg hidden md:block" />
                                    <div className="col-span-2 h-4 bg-zinc-800/50 rounded-lg hidden sm:block" />
                                    <div className="col-span-2 h-5 bg-zinc-800/50 rounded-lg" />
                                </div>
                            ))
                        ) : filtered.length === 0 ? (
                            <div className="py-16 text-center">
                                <Tag className="mx-auto text-zinc-700 mb-4" size={40} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                    {search ? 'Sin resultados para la búsqueda' : 'No hay categorías registradas'}
                                </p>
                                {!search && (
                                    <button onClick={openCreate}
                                        className="mt-4 px-6 py-3 rounded-xl bg-electric-blue/10 text-electric-blue text-[10px] font-black uppercase tracking-widest hover:bg-electric-blue/20 transition-all">
                                        Crear primera categoría
                                    </button>
                                )}
                            </div>
                        ) : (
                            <AnimatePresence>
                                {filtered.map((cat: AdminCategory, i: number) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="grid grid-cols-12 px-6 py-4 items-center hover:bg-zinc-800/30 transition-colors group"
                                    >
                                        {/* Name + Slug */}
                                        <div className="col-span-4 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-zinc-800 rounded-xl flex items-center justify-center text-electric-blue shrink-0 text-[11px] font-black border border-zinc-700">
                                                    {cat.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-white uppercase italic tracking-tighter truncate">{cat.name}</p>
                                                    <p className="text-[9px] text-zinc-600 font-mono truncate">{cat.slug}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="col-span-3 hidden md:block pr-4">
                                            <p className="text-[10px] text-zinc-500 truncate">
                                                {cat.description || <span className="text-zinc-700 italic">Sin descripción</span>}
                                            </p>
                                        </div>

                                        {/* Parent */}
                                        <div className="col-span-2 hidden sm:flex justify-center">
                                            {cat.parent_id ? (
                                                <span className="px-3 py-1 rounded-full bg-electric-blue/10 text-electric-blue text-[9px] font-black uppercase tracking-wider border border-electric-blue/20">
                                                    {parentMap[cat.parent_id] || '—'}
                                                </span>
                                            ) : (
                                                <span className="text-zinc-700 text-[9px] font-mono">—</span>
                                            )}
                                        </div>

                                        {/* Product count */}
                                        <div className="col-span-2 flex justify-center">
                                            <span className="px-3 py-1.5 rounded-xl bg-zinc-800 text-white text-[10px] font-black border border-zinc-700">
                                                {cat.productCount || 0}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(cat)}
                                                className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(cat)}
                                                disabled={deletingId === cat.id}
                                                className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50">
                                                {deletingId === cat.id
                                                    ? <Loader2 size={14} className="animate-spin" />
                                                    : <Trash2 size={14} />}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>

            {/* Create / Edit Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSave}
                editing={editingCategory}
                categories={categories}
                isSaving={isSaving}
            />
        </PageTransition>
    );
}

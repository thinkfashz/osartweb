"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    Check,
    Package,
    FileText,
    Image as ImageIcon,
    Settings,
    Eye,
    Zap,
    Cpu,
    Database,
    ShieldCheck,
    Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useMutation } from '@apollo/client/react';
import { CREATE_PRODUCT, ADMIN_PRODUCTS } from '@/lib/graphql/stockQueries';

const STEPS = [
    { id: 'identity', name: 'Identidad Técnica', icon: FileText, desc: 'Metadatos base' },
    { id: 'specs', name: 'Dimensiones', icon: Settings, desc: 'Hardware Specs' },
    { id: 'media', name: 'Activos Visuales', icon: ImageIcon, desc: 'Despliegue UI' },
    { id: 'deploy', name: 'Despliegue', icon: Zap, desc: 'Verificación Final' },
];

export default function ProductWizard() {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [formData, setFormData] = React.useState({
        name: '',
        sku: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: '',
        specifications: [] as { key: string; value: string }[],
        images: [] as string[]
    });

    const [createProduct] = useMutation(CREATE_PRODUCT, {
        refetchQueries: [{ query: ADMIN_PRODUCTS }]
    });

    const isLastStep = currentStep === STEPS.length - 1;

    const next = () => {
        if (!isLastStep) setCurrentStep(c => c + 1);
        else handleSubmit();
    };

    const back = () => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
    };

    const handleSubmit = async () => {
        const loadingToast = toast.loading('Sincronizando unidad con la malla global...');

        try {
            await createProduct({
                variables: {
                    input: {
                        name: formData.name,
                        sku: formData.sku,
                        description: formData.description,
                        price: formData.price,
                        stock: formData.stock,
                        isActive: true,
                        // categoryId will be added when we have the category selector
                        specs: formData.specifications.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})
                    }
                }
            });

            toast.success('UNIDAD DESPLEGADA EXITOSAMENTE', {
                id: loadingToast,
                description: `Sincronización de hardware completada.`
            });
        } catch (error: any) {
            toast.error('FALLO EN EL DESPLIEGUE', {
                id: loadingToast,
                description: error.message || 'Error de comunicación de red'
            });
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Step Indicator - High Precision */}
            <div className="grid grid-cols-4 gap-4 mb-14">
                {STEPS.map((step, idx) => {
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;
                    return (
                        <div key={step.id} className="relative">
                            <div className={cn(
                                "h-1.5 rounded-full transition-all duration-700 mb-4",
                                isCompleted ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                                    isActive ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" :
                                        "bg-slate-100"
                            )}>
                                {isActive && (
                                    <motion.div
                                        layoutId="step-glow"
                                        className="absolute top-0 h-1.5 w-full bg-blue-400 blur-sm opacity-50"
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                    isActive ? "bg-slate-950 text-white rotate-3 scale-110 shadow-xl shadow-slate-950/20" :
                                        isCompleted ? "bg-emerald-50 text-emerald-600" :
                                            "bg-slate-50 text-slate-300"
                                )}>
                                    {isCompleted ? <Check size={18} /> : <step.icon size={18} />}
                                </div>
                                <div className="hidden lg:block">
                                    <p className={cn(
                                        "text-[10px] font-black uppercase tracking-widest leading-none mb-1",
                                        isActive ? "text-slate-950" : "text-slate-400"
                                    )}>{step.name}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter opacity-50">{step.desc}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Terminal Frame */}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-900/5 min-h-[600px] flex flex-col overflow-hidden relative">
                {/* Decorative Terminal Header */}
                <div className="h-14 border-b border-slate-50 flex items-center justify-between px-10 bg-slate-50/50">
                    <div className="flex items-center gap-6">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Cpu size={14} className="text-slate-400" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment System v4.2.1</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">
                        <Activity size={14} className="text-emerald-500 animate-pulse" />
                        Sincronización Activa
                    </div>
                </div>

                <div className="p-12 flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4 }}
                            className="h-full"
                        >
                            {currentStep === 0 && (
                                <div className="space-y-10">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Información <span className="text-slate-400">Base</span></h2>
                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-wide">Identificación única y descripción técnica de la unidad.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nombre Comercial de Unidad</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. CORE-NODE X1"
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-5 px-8 font-black text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-slate-950 transition-all outline-none italic"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Serial de Inventario (SKU)</label>
                                            <input
                                                type="text"
                                                placeholder="OS-UNIT-XXXX"
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-5 px-8 font-mono font-black text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-slate-950 transition-all outline-none"
                                                value={formData.sku}
                                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3 md:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Especificación Descriptiva</label>
                                            <textarea
                                                rows={4}
                                                placeholder="Detalles técnicos y operativos..."
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-[2rem] py-6 px-8 font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-slate-950 transition-all outline-none resize-none"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Costo Unitario (CLP)</label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">$</span>
                                                <input
                                                    type="number"
                                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-5 pl-12 pr-8 font-mono font-black text-slate-900 focus:bg-white focus:border-slate-950 transition-all outline-none no-spinner"
                                                    value={isNaN(formData.price) ? "" : formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value === "" ? NaN : parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Stock Inicial de Despliegue</label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-5 px-8 font-mono font-black text-slate-900 focus:bg-white focus:border-slate-950 transition-all outline-none no-spinner"
                                                value={isNaN(formData.stock) ? "" : formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value === "" ? NaN : parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-10 h-full flex flex-col">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Hardware <span className="text-slate-400">Specs</span></h2>
                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-wide">Definición de parámetros técnicos y dimensiones.</p>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50 p-12 text-center group">
                                        <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl shadow-slate-900/5 flex items-center justify-center text-slate-300 group-hover:text-slate-900 group-hover:rotate-90 transition-all duration-500 mb-6">
                                            <Settings size={32} />
                                        </div>
                                        <p className="text-xl font-black text-slate-900 tracking-tight italic uppercase mb-2">Configuración de Atributos</p>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-xs mb-8">Añade claves y valores técnicos (e.g. Peso, Voltaje, Color, Material).</p>
                                        <button className="px-10 py-4 rounded-2xl bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-950/20">
                                            Inyectar Parámetro
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-10">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Activos <span className="text-slate-400">Visuales</span></h2>
                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-wide">Documentación fotográfica para el Catálogo Público.</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="border-4 border-dashed border-slate-100 rounded-[3rem] p-16 flex flex-col items-center justify-center gap-6 hover:border-slate-900 hover:bg-slate-50 transition-all cursor-pointer group">
                                            <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-950 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                                                <ImageIcon size={32} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-black text-slate-950 italic uppercase tracking-tighter">Cargar Evidencia</p>
                                                <p className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase mt-1">Formatos: JPG, PNG, WEBP (Max 5MB)</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50/50 rounded-[3rem] p-12 flex flex-col items-center justify-center border border-slate-100 italic font-bold text-slate-300 text-sm">
                                            <p>No se han cargado activos visuales.</p>
                                            <p className="text-[10px] uppercase tracking-widest mt-2">La unidad se desplegará con icono genérico.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-10">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase text-blue-600">Verificación <span className="text-slate-400">Final</span></h2>
                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-wide">Auditoría previa al despliegue en la red de producción.</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 space-y-6">
                                            <div className="bg-slate-50 p-8 rounded-[2.5rem] flex items-center gap-8 group">
                                                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-slate-200 group-hover:text-slate-900 transition-colors shadow-inner">
                                                    <Package size={48} strokeWidth={1} />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-3xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">{formData.name || 'UNIDAD SIN NOMBRE'}</h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-mono font-black text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-100 uppercase">SKU: {formData.sku || 'PENDIENTE'}</span>
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validado</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Inversión Técnica</span>
                                                    <p className="text-2xl font-black text-slate-950 tracking-tighter italic">${formData.price}</p>
                                                </div>
                                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Carga de Stock</span>
                                                    <p className="text-2xl font-black text-slate-950 tracking-tighter italic">{formData.stock} Unidades</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl shadow-slate-950/20 relative overflow-hidden">
                                            <div className="space-y-6 relative z-10">
                                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 mb-2">
                                                    <ShieldCheck size={28} />
                                                </div>
                                                <p className="text-sm font-black uppercase tracking-widest italic opacity-60">Reporte de Salud</p>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-2">
                                                        <span className="text-white/40">Integridad Datos</span>
                                                        <span className="text-emerald-400">Pass</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-2">
                                                        <span className="text-white/40">Sincronización</span>
                                                        <span className="text-emerald-400">Ready</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                                        <span className="text-white/40">Autenticación</span>
                                                        <span className="text-emerald-400">Root</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-[9px] font-bold uppercase tracking-tight text-white/30 italic mt-8 relative z-10">
                                                Confirmación de despliegue sujeta a términos de seguridad OSART PRO.
                                            </p>

                                            <Database size={120} className="absolute -bottom-10 -right-10 text-white/[0.03] rotate-12" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Industrial Action Bar */}
                <div className="h-28 border-t border-slate-100 flex items-center justify-between px-12 bg-slate-50/30">
                    <button
                        onClick={back}
                        disabled={currentStep === 0}
                        className={cn(
                            "flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                            currentStep === 0 ? "text-slate-200 cursor-not-allowed opacity-50" : "text-slate-500 hover:text-slate-950 hover:bg-white hover:shadow-lg"
                        )}
                    >
                        <ChevronLeft size={20} />
                        <span>Retroceder</span>
                    </button>

                    <button
                        onClick={next}
                        className={cn(
                            "flex items-center gap-4 px-10 py-5 rounded-[1.5rem] font-black uppercase italic tracking-[0.2em] text-xs shadow-2xl transition-all hover:scale-[1.03] active:scale-95",
                            isLastStep ?
                                "bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700" :
                                "bg-slate-950 text-white shadow-slate-950/20 hover:bg-slate-800"
                        )}
                    >
                        <span>{isLastStep ? 'Iniciar Despliegue' : 'Siguiente Módulo'}</span>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

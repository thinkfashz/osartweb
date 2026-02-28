'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CreditCard, CheckCircle, Package, ArrowRight, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SatelliteLink } from '@/components/checkout/SatelliteLink';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const steps = [
    { id: 'shipping', title: 'Distribución', icon: Truck },
    { id: 'payment', title: 'Transacción', icon: CreditCard },
    { id: 'confirmation', title: 'Certificación', icon: CheckCircle },
];

export default function CheckoutPage() {
    const { items, subtotal, discount, total, refetch, couponData } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [orderLoading, setOrderLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: 'Chile',
    });

    // Prefill user data if available
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.full_name || prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    const handleNext = async () => {
        if (currentStep === 1) {
            setOrderLoading(true);
            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user?.id,
                        shippingAddress: formData,
                        couponCode: couponData?.code || null,
                    }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'ERROR_PROTO_ST4: FALLO_TRANSACCION');
                }

                const data = await response.json();
                setOrderId(data.orderId);
                setCurrentStep(2);
                toast.success('ORDEN PROCESADA EXITOSAMENTE');
                refetch();
            } catch (e: any) {
                toast.error(e.message);
            } finally {
                setOrderLoading(false);
            }
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleLocationFound = (address: string, city: string) => {
        setFormData(prev => ({
            ...prev,
            address: `${address} `,
            city: city
        }));
        toast.info('COORDENADAS SINCRONIZADAS');
    };

    if (items.length === 0 && currentStep < 2) {
        return (
            <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center px-6">
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 rotate-45">
                    <Package className="w-10 h-10 text-zinc-700 -rotate-45" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-zinc-100 mb-2">Inventario Vacío</h1>
                <p className="text-zinc-500 font-mono text-sm mb-8 text-center max-w-xs">No se han detectado componentes en el búfer de salida.</p>
                <button
                    onClick={() => router.push('/catalog')}
                    className="group relative px-8 py-4 bg-transparent border border-electric-blue text-electric-blue font-black uppercase tracking-widest overflow-hidden transition-all hover:text-black"
                >
                    <div className="absolute inset-0 bg-electric-blue translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                        Retornar al Catálogo <ArrowRight className="w-4 h-4" />
                    </span>
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-24 safe-area-pt safe-area-pb px-4 sm:px-6 bg-black">
            <div className="max-w-5xl mx-auto">
                {/* Stepper Industrial */}
                <div className="relative flex justify-between items-center mb-16 overflow-hidden">
                    <div className="absolute top-5 left-0 w-full h-px bg-zinc-800 -z-10" />
                    {steps.map((step, idx) => (
                        <div key={step.id} className="flex flex-col items-center relative z-10 bg-black px-4">
                            <motion.div
                                initial={false}
                                animate={{
                                    borderColor: idx <= currentStep ? 'var(--electric-blue)' : 'var(--zinc-800)',
                                    color: idx <= currentStep ? 'var(--electric-blue)' : 'var(--zinc-600)',
                                    backgroundColor: idx <= currentStep ? 'rgba(0, 243, 255, 0.05)' : 'rgba(0, 0, 0, 0)'
                                }}
                                className={cn(
                                    "w-12 h-12 rounded-none flex items-center justify-center border-2 transition-all",
                                    idx < currentStep && "bg-electric-blue text-black border-electric-blue"
                                )}
                            >
                                {idx < currentStep ? <CheckCircle className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                            </motion.div>
                            <span className={cn(
                                "text-[10px] uppercase mt-3 tracking-[0.15em] font-black font-mono",
                                idx <= currentStep ? 'text-electric-blue' : 'text-zinc-600'
                            )}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Flow Content */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {currentStep === 0 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="h-px flex-1 bg-zinc-800" />
                                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 font-mono">Logística de Despacho</h2>
                                        <div className="h-px flex-1 bg-zinc-800" />
                                    </div>

                                    <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-none space-y-6">
                                        <SatelliteLink onLocationFound={handleLocationFound} />

                                        <div className="grid grid-cols-1 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Receptor</label>
                                                <input
                                                    type="text"
                                                    placeholder="NOMBRE COMPLETO"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                                    className="w-full bg-black border border-zinc-800 p-4 rounded-none text-white focus:border-electric-blue outline-none transition-colors font-mono text-sm placeholder:text-zinc-700"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Contacto Digital</label>
                                                <input
                                                    type="email"
                                                    placeholder="EMAIL@DOMAIN.COM"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-black border border-zinc-800 p-4 rounded-none text-white focus:border-electric-blue outline-none transition-colors font-mono text-sm placeholder:text-zinc-700"
                                                />
                                            </div>
                                            <div className="space-y-1.5 relative">
                                                <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Punto de Entrega</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="CALLE, NUMERACIÓN, DEPTO"
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value.toUpperCase() })}
                                                        className="w-full bg-black border border-zinc-800 p-4 rounded-none text-white focus:border-electric-blue outline-none transition-colors font-mono text-sm placeholder:text-zinc-700 pl-12"
                                                    />
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Región / Comuna</label>
                                                <input
                                                    type="text"
                                                    placeholder="SANTIAGO, CHILE"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value.toUpperCase() })}
                                                    className="w-full bg-black border border-zinc-800 p-4 rounded-none text-white focus:border-electric-blue outline-none transition-colors font-mono text-sm placeholder:text-zinc-700"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        disabled={!formData.name || !formData.address || !formData.email}
                                        className="group w-full py-5 bg-electric-blue text-black font-black uppercase tracking-[0.25em] transition-all disabled:opacity-30 flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        Proceder al Pago <ArrowRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}

                            {currentStep === 1 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-4 mb-2">
                                        <button onClick={() => setCurrentStep(0)} className="text-zinc-500 hover:text-white transition-colors">
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <div className="h-px flex-1 bg-zinc-800" />
                                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 font-mono">Pasarela de Pago</h2>
                                        <div className="h-px flex-1 bg-zinc-800" />
                                    </div>

                                    <div className="bg-zinc-900/30 border border-zinc-800 p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center">
                                                    <ShieldCheck className="w-6 h-6 text-electric-blue" />
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase tracking-widest text-sm">Transacción Encriptada</p>
                                                    <p className="text-[10px] font-mono text-zinc-500">ST-PAYMENT SENSOR: ACTIVE</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 border border-zinc-800 bg-black/50 space-y-4">
                                            <div className="flex justify-between items-center text-xs font-mono">
                                                <span className="text-zinc-500">PROVEEDOR:</span>
                                                <span className="text-white">STRIPE_SANDBOX</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs font-mono">
                                                <span className="text-zinc-500">DIVISA:</span>
                                                <span className="text-white">CLP (PESOS CHILENOS)</span>
                                            </div>
                                        </div>

                                        <div className="text-[10px] text-zinc-600 font-mono leading-relaxed border-l-2 border-zinc-800 pl-4 uppercase">
                                            Al finalizar, confirmas que has verificado la compatibilidad técnica de los componentes seleccionados.
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        disabled={orderLoading}
                                        className="group w-full py-5 bg-electric-blue text-black font-black uppercase tracking-[0.25em] transition-all disabled:opacity-30 relative overflow-hidden active:scale-[0.98]"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            {orderLoading ? 'Sincronizando...' : 'Finalizar Transacción'}
                                            {!orderLoading && <CheckCircle className="w-5 h-5" />}
                                        </span>
                                    </button>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step3"
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-16 bg-zinc-900/20 border border-zinc-800/50"
                                >
                                    <div className="relative w-24 h-24 mx-auto mb-8">
                                        <div className="absolute inset-0 bg-electric-blue/20 rounded-full blur-2xl animate-pulse" />
                                        <div className="relative w-full h-full bg-black border-2 border-electric-blue flex items-center justify-center">
                                            <CheckCircle className="w-12 h-12 text-electric-blue" />
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-black uppercase tracking-[0.2em] text-white mb-4">Misión Cumplida</h2>
                                    <div className="inline-block px-6 py-2 bg-zinc-900 border border-zinc-800 font-mono text-[10px] uppercase text-zinc-400 mb-12 tracking-widest">
                                        Código de Operación: {orderId?.toUpperCase() || 'SYNCHRONIZING...'}
                                    </div>

                                    <div className="max-w-xs mx-auto space-y-4">
                                        <Link
                                            href="/catalog"
                                            className="block w-full py-4 bg-electric-blue text-black font-black uppercase tracking-widest text-xs transition-transform hover:scale-105"
                                        >
                                            Nueva Operación
                                        </Link>
                                        <Link
                                            href="/admin"
                                            className="block w-full py-4 border border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-colors"
                                        >
                                            Estado de Pedidos
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Industrial Summary Sidebar */}
                    {currentStep < 2 && (
                        <div className="lg:col-span-5 space-y-6">
                            <div className="p-8 bg-zinc-900/50 border border-zinc-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-zinc-700" />
                                <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-zinc-700" />

                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-8 font-mono flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-electric-blue" /> Búfer de Orden
                                </h3>

                                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map((it: any) => (
                                        <div key={it.id || it.productId} className="flex gap-4 group">
                                            <div className="w-12 h-12 bg-black border border-zinc-800 flex-shrink-0 flex items-center justify-center p-1">
                                                {it.product.imageUrl ? (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img src={it.product.imageUrl} alt="" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                                ) : (
                                                    <Package className="w-4 h-4 text-zinc-700" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-300 truncate font-mono">
                                                    {it.product.name}
                                                </p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-[10px] font-mono text-zinc-600">QTY: {it.quantity}</span>
                                                    <span className="text-xs font-mono text-white">${(it.product.price * it.quantity).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-8 border-t border-zinc-800 border-dashed space-y-3">
                                    <div className="flex justify-between text-[11px] font-mono">
                                        <span className="text-zinc-500">SUBTOTAL</span>
                                        <span className="text-zinc-300">${subtotal.toLocaleString()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-[11px] font-mono">
                                            <span className="text-electric-blue">DESCUENTO (CUPÓN)</span>
                                            <span className="text-electric-blue">-${discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[11px] font-mono">
                                        <span className="text-zinc-500">ENVÍO</span>
                                        <span className="text-zinc-300">$0 (GRATUITO)</span>
                                    </div>
                                    <div className="pt-4 flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-electric-blue tracking-widest font-mono">TOTAL_FINAL</span>
                                        </div>
                                        <span className="text-2xl font-black font-mono text-white tracking-tighter">
                                            <span className="text-sm mr-1 text-zinc-600">$</span>
                                            {total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="p-4 bg-zinc-900/20 border border-zinc-800/50 flex items-center gap-3">
                                <ShieldCheck className="w-4 h-4 text-zinc-600" />
                                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                                    Protocolo de seguridad SSL v3.4 activado
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

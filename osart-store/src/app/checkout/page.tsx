'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CreditCard, CheckCircle, Package } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SatelliteLink } from '@/components/checkout/SatelliteLink';
import { useAuth } from '@/context/AuthContext';

const steps = [
    { id: 'shipping', title: 'Envío', icon: Truck },
    { id: 'payment', title: 'Pago', icon: CreditCard },
    { id: 'confirmation', title: 'Éxito', icon: CheckCircle },
];

export default function CheckoutPage() {
    const { items, subtotal, refetch } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [orderLoading, setOrderLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: 'Chile',
    });

    const handleNext = async () => {
        if (currentStep === 1) {
            // Place Order via REST API
            setOrderLoading(true);
            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user?.id,
                        shippingAddress: formData,
                        couponCode: couponCode || null,
                    }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Fallo al procesar la orden');
                }

                const data = await response.json();
                setOrderId(data.orderId);
                setCurrentStep(2);
                refetch();
            } catch (e: any) {
                alert('Error al procesar la orden: ' + e.message);
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
            address: `${address} `, // Leave a space for the number
            city: city
        }));
    };

    if (items.length === 0 && currentStep < 2) {
        return (
            <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center">
                <Package className="w-16 h-16 text-zinc-800 mb-4" />
                <h1 className="text-2xl font-bold uppercase tracking-widest text-zinc-100">Carrito Vacío</h1>
                <button
                    onClick={() => router.push('/catalog')}
                    className="mt-6 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase"
                >
                    Volver al Catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Stepper */}
                <div className="flex justify-between items-center mb-12">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${idx <= currentStep ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' : 'border-zinc-800 text-zinc-600'
                                }`}>
                                <step.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] uppercase mt-2 tracking-tighter font-bold ${idx <= currentStep ? 'text-cyan-400' : 'text-zinc-600'
                                }`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Flow */}
                    <div className="md:col-span-2">
                        <AnimatePresence mode="wait">
                            {currentStep === 0 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-6 flex items-center gap-3">
                                        Información de Envío
                                        <div className="h-px flex-1 bg-white/5" />
                                    </h2>

                                    <div className="mb-6">
                                        <SatelliteLink onLocationFound={handleLocationFound} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Nombre Completo"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded text-white focus:border-cyan-400 transition-colors"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Correo Electrónico"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded text-white focus:border-cyan-400 transition-colors"
                                        />
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Dirección Calle #123"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded text-white focus:border-cyan-400 transition-colors"
                                            />
                                            {formData.address && formData.address.length > 5 && (
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-electric-blue tracking-widest animate-pulse">
                                                    Sincronizado
                                                </span>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Ciudad / Comuna"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded text-white focus:border-cyan-400 transition-colors"
                                        />
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        disabled={!formData.name || !formData.address}
                                        className="w-full py-4 bg-zinc-100 hover:bg-white text-black font-black uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        Continuar al Pago
                                    </button>
                                </motion.div>
                            )}

                            {currentStep === 1 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-6">Metodo de Pago (Simulación)</h2>
                                    <div className="p-6 border border-zinc-800 bg-zinc-900/50 rounded flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <CreditCard className="text-cyan-400" />
                                            <div>
                                                <p className="font-bold">Pago Seguro con Tarjeta</p>
                                                <p className="text-xs text-zinc-500">Demo Mode Active</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-5 bg-zinc-800 rounded"></div>
                                            <div className="w-8 h-5 bg-zinc-800 rounded"></div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        disabled={orderLoading}
                                        className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest transition-all shadow-glow"
                                    >
                                        {orderLoading ? 'Procesando...' : 'Finalizar Compra'}
                                    </button>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step3"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 bg-cyan-400/10 border border-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-cyan-400" />
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-wider text-white mb-2">Orden Confirmada</h2>
                                    <p className="text-zinc-400 mb-8 font-mono">Nº de Seguimiento: {orderId?.slice(0, 12)}</p>
                                    <Link
                                        href="/admin"
                                        className="px-10 py-4 border border-zinc-700 hover:bg-zinc-800 transition-colors uppercase font-bold text-sm tracking-widest inline-block"
                                    >
                                        Ver Mis Pedidos
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Summary Sidebar */}
                    {currentStep < 2 && (
                        <div className="space-y-6">
                            <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded backdrop-blur">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 font-mono">Resumen</h3>
                                <div className="space-y-4">
                                    {items.map((it: any) => (
                                        <div key={it.id || it.productId} className="flex justify-between text-sm">
                                            <span className="text-zinc-500">{it.quantity}x {it.product.name}</span>
                                            <span className="font-mono">${(it.product.price * it.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-zinc-800 flex justify-between">
                                        <span className="text-cyan-400 font-bold uppercase tracking-widest">Total</span>
                                        <span className="text-white font-black font-mono text-lg">${subtotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded backdrop-blur">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 font-mono">Cupón</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="CÓDIGO"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="flex-1 bg-black border border-zinc-800 p-2 rounded text-xs font-mono uppercase text-cyan-400"
                                    />
                                    <button className="px-4 py-2 bg-zinc-800 text-xs font-bold uppercase hover:bg-zinc-700 transition-all">
                                        Ok
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Package,
    Truck,
    Search,
    Settings,
    ShieldAlert,
    Clock,
    ArrowRight,
    HeadphonesIcon,
    CheckCircle2,
    Box
} from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
    const services = [
        {
            id: 'encargos',
            title: "Encargos Especiales",
            subtitle: "Personalized Sourcing",
            icon: <Search className="text-electric-blue" size={32} />,
            description: "¿Buscas un componente específico que no está en stock? Nuestro equipo de sourcing global lo encuentra por ti. Accedemos a inventarios industriales en Asia, Europa y Norteamérica.",
            features: ["Búsqueda de componentes obsoletos", "Importación directa garantizada", "Verificación técnica de compatibilidad"]
        },
        {
            id: 'logistica',
            title: "Puerta a Puerta",
            subtitle: "Last-Mile Logistics",
            icon: <Truck className="text-electric-blue" size={32} />,
            description: "No importa dónde estés. Llevamos tus repuestos directamente a tu hogar o taller técnico con seguimiento en tiempo real y embalaje anti-estático profesional.",
            features: ["Envío nacional e internacional", "Seguro de carga incluido", "Embalaje grado industrial"]
        },
        {
            id: 'asesoria',
            title: "Asesoría Técnica",
            subtitle: "Hardware Consulting",
            icon: <Settings className="text-electric-blue" size={32} />,
            description: "Nuestros expertos en hardware te ayudan a identificar el fallo y seleccionar el repuesto exacto que tu equipo necesita para volver a la vida.",
            features: ["Soporte vía WhatsApp Pro", "Manuales de instalación", "Garantía de juste perfecto"]
        }
    ];

    return (
        <div className="flex flex-col w-full bg-background overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32 border-b border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric-blue/5 blur-[150px] -mr-40 -mt-40 rounded-full" />

                <div className="max-w-[1200px] mx-auto px-5 relative z-10">
                    <div className="max-w-3xl space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <span className="text-xs font-bold uppercase tracking-[0.5em] text-electric-blue inline-flex items-center gap-2">
                                <Box size={14} /> Soluciones de Hardware
                            </span>
                            <h1 className="text-5xl lg:text-8xl font-black tracking-tighter uppercase italic leading-none text-white">
                                Servicios de <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-cyan-400">Alta Precisión</span>
                            </h1>
                        </motion.div>

                        <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed">
                            Más que una tienda, somos tu infraestructura logística. Desde encargos personalizados hasta la entrega final en tu puerta, optimizamos cada paso del proceso.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 lg:py-40 bg-zinc-950/50">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {services.map((service, i) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="glass group p-10 flex flex-col h-full border-white/5 hover:border-electric-blue/30 transition-all duration-500"
                            >
                                <div className="mb-8 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-electric-blue/10 transition-colors">
                                    {service.icon}
                                </div>

                                <div className="space-y-2 mb-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{service.subtitle}</span>
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">{service.title}</h3>
                                </div>

                                <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                                    {service.description}
                                </p>

                                <ul className="space-y-4 mb-10 text-sm">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-zinc-400">
                                            <CheckCircle2 size={16} className="text-electric-blue flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={`/contact?service=${service.id}`}
                                    className="flex items-center justify-between w-full py-4 border-t border-white/10 group-hover:text-electric-blue transition-colors text-xs font-black uppercase tracking-widest text-zinc-500"
                                >
                                    Solicitar este servicio <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Logistics Deep Dive */}
            <section className="py-24 lg:py-40 relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="absolute inset-0 bg-electric-blue/10 blur-[80px] rounded-full" />
                            <div className="glass border-white/10 aspect-video lg:aspect-square flex items-center justify-center relative overflow-hidden">
                                {/* Decorative radar/logistic animation elements */}
                                <div className="absolute inset-4 border border-white/5 rounded-full animate-pulse" />
                                <div className="absolute inset-20 border border-electric-blue/20 rounded-full" />
                                <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent top-1/2 -translate-y-1/2 animate-scan" />

                                <div className="text-center z-10 px-8">
                                    <Package size={60} className="text-white opacity-20 mx-auto mb-6" />
                                    <h4 className="text-2xl font-black uppercase tracking-tighter text-white mb-2 italic">Logística Proactiva</h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest leading-relaxed">
                                        Cada paquete es sellado al vacío y protegido contra ESD (Descarga Electrostática) siguiendo estándares ISO.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 space-y-10">
                            <div className="space-y-4">
                                <span className="text-xs font-bold uppercase tracking-[0.4em] text-electric-blue">Eficiencia Operativa</span>
                                <h2 className="text-4xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">
                                    Tus Repuestos, <br /> Don de sea.
                                </h2>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 text-electric-blue border border-white/10">
                                        <Clock size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-bold uppercase italic text-white">Velocidad de Respuesta</h4>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Procesamos tus encargos especiales en menos de 24 horas hábiles enviando cotización formal.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 text-electric-blue border border-white/10">
                                        <ShieldAlert size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-bold uppercase italic text-white">Garantía de Recepción</h4>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Si el repuesto llega dañado o no es el solicitado, ejecutamos el protocolo de retorno inmediato sin costo para ti.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support CTA */}
            <section className="py-24 bg-zinc-950 border-y border-white/5">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="glass p-12 lg:p-20 relative overflow-hidden border-electric-blue/20">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <HeadphonesIcon size={120} className="text-electric-blue" />
                        </div>

                        <div className="max-w-2xl space-y-8 relative z-10">
                            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-tight text-white">
                                ¿Necesitas un <span className="text-electric-blue">encargo</span> especial?
                            </h2>
                            <p className="text-muted-foreground text-lg italic">
                                Habla directamente con uno de nuestros gestores de inventario. Te ayudamos a importar la pieza exacta.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href="https://wa.me/56979346165"
                                    target="_blank"
                                    className="neon-button px-10 py-4 text-sm uppercase tracking-widest font-black italic"
                                >
                                    Consultar por WhatsApp
                                </Link>
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                                    <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-electric-blue" /> Atención 1 a 1</span>
                                    <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-electric-blue" /> Respuesta Inmediata</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

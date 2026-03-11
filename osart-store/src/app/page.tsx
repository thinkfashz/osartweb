'use client';

import React, { useState, useEffect, useRef } from 'react';
import Hero from "@/components/layout/Hero";
import ProductCard from "@/components/shop/ProductCard";
import FeaturedBanner from "@/components/shop/FeaturedBanner";
import { Loader2, Zap, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useProducts } from '@/hooks/useShop';
import { OfferLinks } from '@/components/shop/OfferLinks';

// ─── Animate on scroll — uses native IntersectionObserver to avoid Turbopack HMR issues ───
function AnimateIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: '-80px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { data, loading } = useProducts();
  const products = data?.products || [];

  // Format them for the frontend expectations (Hero expects `title` instead of `name`, standardizing it)
  const displayProducts = products.map((p) => ({ ...p, title: p.name }));

  // Find featured, or fallback to the first 3 active products
  const featuredProducts = displayProducts.filter(p => (p as any).metadata?.is_featured).length > 0
    ? displayProducts.filter(p => (p as any).metadata?.is_featured)
    : displayProducts.slice(0, 3);

  const CATEGORY_CARDS = [
    { title: "Pantallas Originales", desc: "Máxima resolución y respuesta táctil garantizada para dispositivos de gama alta.", href: "/catalog?category=pantallas", tag: "LCD_PRO_LEVEL" },
    { title: "Micro-Soldadura", desc: "Circuitos integrados y componentes SMD para reparaciones críticas de placa madre.", href: "/catalog?category=micro-soldadura", tag: "SMD_INFRA" },
    { title: "Baterías High-Caps", desc: "Celdas de alta densidad para restaurar la autonomía original de cualquier equipo.", href: "/catalog?category=baterias", tag: "PWR_CELL_V2" },
  ];

  return (
    <div className="flex flex-col w-full">

      {/* ── Featured Banner / Hero ── */}
      {!loading && featuredProducts.length > 0 && <FeaturedBanner products={featuredProducts} />}
      {!loading && featuredProducts.length === 0 && <Hero />}
      {loading && (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-zinc-950">
          <Loader2 className="animate-spin text-sky-500 mb-4" size={40} />
          <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Inicializando Motor de Catálogo...</p>
        </div>
      )}

      {/* ── Falabella-Style Utility Layers ── */}
      <OfferLinks />

      {/* ── Mobile Advantage Bar ── */}
      <div className="lg:hidden bg-zinc-950 py-4 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-5 flex justify-between overflow-x-auto gap-8 no-scrollbar">
          {[
            { icon: ShieldCheck, label: 'Garantía Real' },
            { icon: Zap, label: 'Envío Express' },
            { icon: CreditCard, label: 'Pago Seguro' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 flex-shrink-0">
              <Icon size={14} className="text-sky-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Products Grid ── */}
      <section className="py-24 lg:py-32 bg-white dark:bg-zinc-950 relative overflow-hidden">
        {/* Modern Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#0ea5e9 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(14, 165, 233, 0.05), transparent)' }} />

        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <AnimateIn className="flex flex-col md:flex-row md:items-end justify-between mb-20 px-4 sm:px-0 gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Catálogo Dinámico</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
                Lo Último en <span className="text-sky-500 italic">Inventario</span>.
              </h2>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
              Explorar Todo <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimateIn>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-sky-500" size={48} />
              <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Sincronizando Inventario...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.slice(0, 8).map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
              {displayProducts.length === 0 && (
                <div className="col-span-full py-20 bg-zinc-900/50 rounded-[40px] border border-dashed border-white/10 text-center">
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">El inventario se encuentra vacío.</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-12 sm:hidden text-center">
            <Link href="/catalog" className="neon-button inline-flex py-4 px-12 text-sm">
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Category Highlights ── */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950 border-y border-zinc-200/50 dark:border-zinc-800/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.3] dark:opacity-[0.1] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#0ea5e9 0.5px, transparent 0.5px)', backgroundSize: '48px 48px' }} />
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0ea5e9 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <AnimateIn className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500 block mb-4">Segmentos de Hardware</span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">Zonas del Sistema</h2>
          </AnimateIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORY_CARDS.map((cat, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl h-full p-12 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 hover:border-sky-500/30 transition-all group relative overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-sky-500/5">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 p-6 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="text-[8px] font-black text-sky-500 uppercase tracking-[0.3em] rotate-90 origin-right whitespace-nowrap">NODE_SYSTEM_{i + 1}</div>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500/60 mb-6 block">{cat.tag}</span>
                  <h3 className="text-2xl font-black mb-4 tracking-tighter text-zinc-900 dark:text-white group-hover:text-sky-500 transition-colors">{cat.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 font-medium">{cat.desc}</p>
                  <Link href={cat.href} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white flex items-center gap-3 group/link">
                    Acceder al Nodo <ChevronRight size={14} className="text-sky-500 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Proposition ── */}
      <section className="py-24 lg:py-40 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#0ea5e9 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <AnimateIn className="space-y-10">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-sky-500">¿Por qué OSART?</span>
                <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-zinc-900 dark:text-white">
                  El Estándar <span className="text-sky-500 italic">Premium</span> en Repuestos.
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed lg:max-w-xl">
                No somos solo una tienda. Somos tu brazo logístico para asegurar que cada reparación que sale de tu taller sea perfecta.
                Respaldamos cada pieza con soporte técnico especializado.
              </p>

              <div className="grid sm:grid-cols-2 gap-8 pt-6">
                {[
                  { icon: ShieldCheck, title: 'Garantía Real', desc: '6 meses de garantía directa en todos nuestros componentes.' },
                  { icon: Zap, title: 'Envío Express', desc: 'Despacho en menos de 2 horas en la Región Metropolitana.' },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-5 group p-6 bg-zinc-50 dark:bg-white/5 rounded-3xl border border-transparent hover:border-sky-500/20 transition-all"
                  >
                    <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-sky-500 border border-sky-500/20 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-lg shadow-sky-500/10">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-tight mb-1 text-foreground">{title}</h4>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimateIn>

            <AnimateIn delay={0.15} className="relative">
              {/* Glow halo */}
              <div className="absolute -inset-10 bg-sky-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-2xl aspect-video lg:aspect-square flex items-center justify-center relative border border-zinc-200 dark:border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl">

                <div className="text-center p-14 relative z-10">
                  <CreditCard size={80} className="text-sky-500 opacity-10 mx-auto mb-8" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-sky-500 block mb-6">Partner Tecnológico</span>
                  <h3 className="text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-tight">Precios <br /><span className="text-sky-500 uppercase italic">Mayoristas</span></h3>
                  <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400 font-medium">Regístrate como servicio técnico y accede a nuestra lista de precios exclusiva para profesionales.</p>
                  <Link href="/register" className="inline-flex mt-10 px-12 py-4 bg-sky-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-sky-500/30 hover:bg-sky-600 hover:scale-105 transition-all">
                    Aplicar Cuenta Pro
                  </Link>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </div>
  );
}

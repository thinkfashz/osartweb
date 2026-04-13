'use client';

import React, { useState, useEffect, useRef } from 'react';
import Hero from "@/components/layout/Hero";
import ProductCard from "@/components/shop/ProductCard";
import FeaturedBanner from "@/components/shop/FeaturedBanner";
import { Loader2, Zap, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import GsapReveal from "@/components/ui/GsapReveal";

import { useProducts } from '@/hooks/useShop';
import { OfferLinks } from '@/components/shop/OfferLinks';

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
        <div className="w-full h-[60vh] flex flex-col items-center justify-center" style={{ background: '#0a0a0f' }}>
          <Loader2 className="animate-spin text-violet-500 mb-4" size={40} />
          <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Inicializando Motor de Catálogo...</p>
        </div>
      )}

      {/* ── Falabella-Style Utility Layers ── */}
      <OfferLinks />

      {/* ── Mobile Advantage Bar ── */}
      <div className="lg:hidden py-4 border-b border-violet-500/10" style={{ background: '#0a0a0f' }}>
        <div className="max-w-[1200px] mx-auto px-5 flex justify-between overflow-x-auto gap-8 no-scrollbar">
          {[
            { icon: ShieldCheck, label: 'Garantía Real' },
            { icon: Zap, label: 'Envío Express' },
            { icon: CreditCard, label: 'Pago Seguro' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 flex-shrink-0">
              <Icon size={14} className="text-violet-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Products Grid ── */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#0a0a0f' }}>
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#8b5cf6 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(139, 92, 246, 0.06), transparent)' }} />

        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <GsapReveal className="flex flex-col md:flex-row md:items-end justify-between mb-20 px-4 sm:px-0 gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">Catálogo Dinámico</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-white leading-none">
                Lo Último en <span className="text-violet-400 italic">Inventario</span>.
              </h2>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-violet-300 transition-colors group">
              Explorar Todo <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </GsapReveal>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-violet-500" size={48} />
              <p className="text-sm text-zinc-500 uppercase font-bold tracking-widest">Sincronizando Inventario...</p>
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
                <div className="col-span-full py-20 bg-[#111118] rounded-[2rem] border border-dashed border-violet-500/20 text-center">
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">El inventario se encuentra vacío.</p>
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
      <section className="py-24 border-y border-violet-500/10 relative overflow-hidden" style={{ background: '#0d0d18' }}>
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#8b5cf6 0.5px, transparent 0.5px)', backgroundSize: '48px 48px' }} />

        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <GsapReveal className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400 block mb-4">Segmentos de Hardware</span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white uppercase italic">Zonas del Sistema</h2>
          </GsapReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORY_CARDS.map((cat, i) => (
              <GsapReveal key={i} delay={i * 0.1}>
                <div className="bg-[#111118] h-full p-12 rounded-[2rem] border border-violet-500/20 hover:border-violet-500/50 transition-all group relative overflow-hidden cursor-pointer shadow-xl hover:shadow-violet-500/10">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-70 transition-opacity">
                    <div className="text-[8px] font-black text-violet-400 uppercase tracking-[0.3em] rotate-90 origin-right whitespace-nowrap">NODE_SYSTEM_{i + 1}</div>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500/50 mb-6 block">{cat.tag}</span>
                  <h3 className="text-2xl font-black mb-4 tracking-tighter text-white group-hover:text-violet-300 transition-colors">{cat.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-10 font-medium">{cat.desc}</p>
                  <Link href={cat.href} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 flex items-center gap-3 group/link">
                    Acceder al Nodo <ChevronRight size={14} className="text-violet-400 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Proposition ── */}
      <section className="py-24 lg:py-40 relative overflow-hidden" style={{ background: '#0a0a0f' }}>
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#8b5cf6 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <GsapReveal className="space-y-10">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-violet-400">¿Por qué OSART?</span>
                <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-white">
                  El Estándar <span className="text-violet-400 italic">Premium</span> en Repuestos.
                </h2>
              </div>
              <p className="text-zinc-400 text-lg leading-relaxed lg:max-w-xl">
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
                    className="flex gap-5 group p-6 bg-[#111118] rounded-3xl border border-violet-500/10 hover:border-violet-500/30 transition-all"
                  >
                    <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-violet-400 border border-violet-500/20 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-lg shadow-violet-500/10">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-tight mb-1 text-white">{title}</h4>
                      <p className="text-xs text-zinc-500">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GsapReveal>

            <GsapReveal delay={0.15} className="relative">
              <div className="absolute -inset-10 bg-violet-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
              <div className="bg-[#111118] backdrop-blur-2xl aspect-video lg:aspect-square flex items-center justify-center relative border border-violet-500/20 rounded-[3rem] overflow-hidden shadow-2xl shadow-violet-500/5">
                <div className="text-center p-14 relative z-10">
                  <CreditCard size={80} className="text-violet-500 opacity-10 mx-auto mb-8" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-violet-400 block mb-6">Partner Tecnológico</span>
                  <h3 className="text-4xl lg:text-5xl font-black tracking-tighter text-white leading-tight">Precios <br /><span className="text-violet-400 uppercase italic">Mayoristas</span></h3>
                  <p className="mt-6 text-sm text-zinc-500 font-medium">Regístrate como servicio técnico y accede a nuestra lista de precios exclusiva para profesionales.</p>
                  <Link href="/register" className="inline-flex mt-10 px-12 py-4 bg-violet-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-violet-600/30 hover:bg-violet-500 hover:scale-105 transition-all">
                    Aplicar Cuenta Pro
                  </Link>
                </div>
              </div>
            </GsapReveal>
          </div>
        </div>
      </section>
    </div>
  );
}

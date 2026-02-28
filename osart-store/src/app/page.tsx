'use client';

import React, { useState, useEffect, useRef } from 'react';
import Hero from "@/components/layout/Hero";
import ProductCard from "@/components/shop/ProductCard";
import FeaturedBanner from "@/components/shop/FeaturedBanner";
import { supabase } from "@/lib/supabase-auth";
import { Loader2, Zap, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: featuredData } = await supabase
          .from('products')
          .select('*, category:categories(name)')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        const formattedData = (featuredData || []).map((p: any) => {
          const images = p.image_url ? [{ url: p.image_url, position: 0 }] : [];
          return { ...p, images, image_url: p.image_url || null, title: p.name };
        });

        const featured = (featuredData || []).filter((p: any) => p.metadata?.is_featured === true);
        setFeaturedProducts(featured.length > 0 ? featured : formattedData.slice(0, 3));
        setProducts(formattedData || []);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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

      {/* ── Mobile Advantage Bar ── */}
      <div className="lg:hidden bg-zinc-950 py-4 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-5 flex justify-between overflow-x-auto gap-8 no-scrollbar">
          {[
            { icon: ShieldCheck, label: 'Garantía Real' },
            { icon: Zap, label: 'Envío Express' },
            { icon: CreditCard, label: 'Pago Seguro' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 flex-shrink-0">
              <Icon size={14} className="text-electric-blue" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Products Grid ── */}
      <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
        {/* Retro background for this section */}
        <div className="absolute inset-0 retro-grid opacity-60 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 100%, hsl(var(--electric-blue) / 0.04), transparent)' }} />

        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <AnimateIn className="flex items-end justify-between mb-16 px-4 sm:px-0">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-electric-blue">Potencia tus reparaciones</span>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase italic text-foreground leading-none">Catálogo Industrial</h2>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
              Explorar Todo <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimateIn>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-electric-blue" size={48} />
              <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Sincronizando Inventario...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any, i: number) => (
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
              {products.length === 0 && (
                <div className="col-span-full py-20 bg-zinc-900/50 rounded-[40px] border border-dashed border-white/10 text-center">
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">No se encontraron productos en el inventario.</p>
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
      <section className="py-24 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 retro-grid pointer-events-none" />
        <div className="absolute inset-0 retro-glow-bg opacity-50 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <AnimateIn className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-electric-blue block mb-3">Segmentos de Hardware</span>
            <h2 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter text-white">Zonas del Sistema</h2>
          </AnimateIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORY_CARDS.map((cat, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="glass h-full p-10 hover:border-electric-blue/30 transition-all group relative overflow-hidden cursor-pointer">
                  {/* Corner scanline accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-[7px] font-mono text-electric-blue/40 uppercase tracking-[0.3em] rotate-90 origin-right whitespace-nowrap">SEC_ZONE_{i + 1}</div>
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-electric-blue/60 mb-4 block">{cat.tag}</span>
                  <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter text-white group-hover:text-electric-blue transition-colors">{cat.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-8">{cat.desc}</p>
                  <Link href={cat.href} className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3 group/link">
                    Acceder a Nodo <ChevronRight size={14} className="text-electric-blue group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Proposition ── */}
      <section className="py-24 lg:py-40 bg-background relative overflow-hidden">
        <div className="absolute inset-0 retro-grid opacity-50 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <AnimateIn className="space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-electric-blue">¿Por qué OSART?</span>
                <h2 className="text-4xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none text-foreground">El Estándar Industrial en Repuestos</h2>
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
                    className="flex gap-4 group"
                  >
                    <div className="w-12 h-12 bg-electric-blue/10 rounded-xl flex items-center justify-center flex-shrink-0 text-electric-blue border border-electric-blue/20 group-hover:bg-electric-blue/20 transition-all">
                      <Icon size={22} />
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
              <div className="absolute -inset-10 bg-electric-blue/15 blur-[100px] rounded-full -z-10 animate-pulse-glow" />
              <div className="glass aspect-video lg:aspect-square flex items-center justify-center relative border-electric-blue/10 overflow-hidden">
                {/* Shimmer */}
                <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />
                <div className="absolute inset-0 retro-scanlines opacity-30 pointer-events-none" />

                <div className="text-center p-12 relative z-10">
                  <CreditCard size={80} className="text-white opacity-10 mx-auto mb-6" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-electric-blue block mb-4">Partner Tecnológico</span>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Precios Mayoristas</h3>
                  <p className="mt-4 text-sm text-muted-foreground">Regístrate como servicio técnico y accede a nuestra lista de precios exclusiva para profesionales.</p>
                  <Link href="/register" className="neon-button inline-flex mt-8 uppercase tracking-widest text-[10px] font-black italic">
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

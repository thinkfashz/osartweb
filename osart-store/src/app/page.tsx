'use client';

import React, { useState, useEffect } from 'react';
import Hero from "@/components/layout/Hero";
import ProductCard from "@/components/shop/ProductCard";
import FeaturedBanner from "@/components/shop/FeaturedBanner";
import { supabase } from "@/lib/supabase-auth";
import { Loader2, Zap, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch featured products for the banner
        const { data: featuredData } = await supabase
          .from('products')
          .select('*, category:categories(name)')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // In a real scenario, we might have a specific flag for is_featured in metadata
        // For now, we take products that have 'featured' in metadata or just the latest ones
        const featured = (featuredData || []).filter((p: any) => p.metadata?.is_featured === true);

        // If no products are explicitly featured, take the 3 latest ones
        setFeaturedProducts(featured.length > 0 ? featured : (featuredData || []).slice(0, 3));

        // Fetch products for the grid (latest 8)
        setProducts(featuredData || []);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Featured Banner with Transitions */}
      {!loading && featuredProducts.length > 0 && (
        <FeaturedBanner products={featuredProducts} />
      )}

      {/* Hero section if no featured products or as secondary */}
      {!loading && featuredProducts.length === 0 && <Hero />}

      {/* Industrial Advantage Bar (Mobile only or hidden if banner exists) */}
      <div className="lg:hidden bg-zinc-950 py-4 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-5 flex justify-between overflow-x-auto gap-8 no-scrollbar">
          <div className="flex items-center gap-2 flex-shrink-0">
            <ShieldCheck size={14} className="text-electric-blue" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Garantía Real</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Zap size={14} className="text-electric-blue" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Envío Express</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <CreditCard size={14} className="text-electric-blue" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pago Seguro</span>
          </div>
        </div>
      </div>

      {/* Main Products Grid */}
      <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <div className="flex items-end justify-between mb-16 px-4 sm:px-0">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-electric-blue">Potencia tus reparaciones</span>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase italic text-white leading-none">Catálogo Industrial</h2>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors group">
              Explorar Todo <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-electric-blue" size={48} />
              <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Sincronizando Inventario...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
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

      {/* Categories Highlights Section */}
      <section className="py-20 bg-zinc-950 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass p-8 hover:border-electric-blue/30 transition-all group">
              <h3 className="text-xl font-bold mb-4 uppercase italic tracking-tight text-white">Pantallas Originales</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">Máxima resolución y respuesta táctil garantizada para dispositivos de gama alta.</p>
              <Link href="/catalog?category=pantallas" className="text-xs font-bold uppercase tracking-widest text-electric-blue flex items-center gap-2">
                Ver Selección <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="glass p-8 hover:border-electric-blue/30 transition-all group">
              <h3 className="text-xl font-bold mb-4 uppercase italic tracking-tight text-white">Micro-Soldadura</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">Circuitos integrados y componentes SMD para reparaciones críticas de placa madre.</p>
              <Link href="/catalog?category=micro-soldadura" className="text-xs font-bold uppercase tracking-widest text-electric-blue flex items-center gap-2">
                Ver Selección <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="glass p-8 hover:border-electric-blue/30 transition-all group">
              <h3 className="text-xl font-bold mb-4 uppercase italic tracking-tight text-white">Baterías High-Caps</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">Celdas de alta densidad para restaurar la autonomía original de cualquier equipo.</p>
              <Link href="/catalog?category=baterias" className="text-xs font-bold uppercase tracking-widest text-electric-blue flex items-center gap-2">
                Ver Selección <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop / Benefits */}
      <section className="py-24 lg:py-40 bg-background relative">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-electric-blue">¿Por qué OSART?</span>
                <h2 className="text-4xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">El Estándar Industrial en Repuestos</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed lg:max-w-xl">
                No somos solo una tienda. Somos tu brazo logístico para asegurar que cada reparación que sale de tu taller sea perfecta. Respaldamos cada pieza con soporte técnico especializado.
              </p>

              <div className="grid sm:grid-cols-2 gap-8 pt-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 text-electric-blue border border-white/10">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-tight mb-1 text-white">Garantía Real</h4>
                    <p className="text-xs text-muted-foreground">6 meses de garantía directa en todos nuestros componentes.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 text-electric-blue border border-white/10">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-tight mb-1 text-white">Envío Express</h4>
                    <p className="text-xs text-muted-foreground">Despacho en menos de 2 horas en la Región Metropolitana.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-electric-blue/20 blur-[120px] rounded-full -z-10 animate-pulse" />
              <div className="glass aspect-video lg:aspect-square flex items-center justify-center relative border-white/10">
                <div className="text-center p-12">
                  <CreditCard size={80} className="text-white opacity-10 mx-auto mb-6" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-electric-blue block mb-4">Partner Tecnológico</span>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Precios Mayoristas</h3>
                  <p className="mt-4 text-sm text-muted-foreground">Regístrate como servicio técnico y accede a nuestra lista de precios exclusiva para profesionales.</p>
                  <Link href="/register" className="neon-button inline-flex mt-8 uppercase tracking-widest text-[10px] font-black italic">Aplicar Cuenta Pro</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

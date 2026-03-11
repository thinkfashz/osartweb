import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const NAV = [
    { label: 'Catálogo', href: '/catalog' },
    { label: 'Servicios', href: '/services' },
    { label: 'Nosotros', href: '/about' },
    { label: 'Contacto', href: 'mailto:ventas@osart.cl' },
];

const SOCIAL = [
    { icon: Instagram, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Facebook, href: '#' },
];

const Footer = () => (
    <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl py-12">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
                <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white capitalize">Osart</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] group-hover:scale-150 transition-transform duration-300" />
            </Link>

            {/* Nav links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                {NAV.map(({ label, href }) => (
                    <Link
                        key={label}
                        href={href}
                        className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-sky-500 transition-colors"
                    >
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Social + copyright */}
            <div className="flex flex-col md:flex-row items-center gap-8 shrink-0">
                <div className="flex items-center gap-4">
                    {SOCIAL.map(({ icon: Icon, href }, i) => (
                        <Link
                            key={i}
                            href={href}
                            className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                        >
                            <Icon size={18} />
                        </Link>
                    ))}
                </div>
                <div className="flex flex-col items-center md:items-end">
                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} OSART DIGITAL
                    </span>
                    <span className="text-[9px] text-zinc-500 font-medium">Sincronizado vía Supabase Cloud</span>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;

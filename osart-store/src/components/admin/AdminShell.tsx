"use client";
// Forced rebuild - Apollo Import fix v2

import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Loader2, ShieldAlert } from 'lucide-react';

const GET_MY_ROLE = gql`
    query GetMyRole {
        me {
            id
            role
        }
    }
`;

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Guard Logic
    const { data: roleData, loading: roleLoading, error: roleError } = useQuery(GET_MY_ROLE, {
        skip: !user,
        fetchPolicy: 'network-only'
    });

    React.useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const isAdmin = roleData?.me?.role === 'admin';
    const isVerifying = authLoading || roleLoading;

    if (isVerifying) {
        return (
            <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-electric-blue" size={40} />
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Verificando credenciales de acceso...</p>
            </div>
        );
    }

    if (!user || (!isAdmin && !roleLoading)) {
        return (
            <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
                    <ShieldAlert className="text-red-500" size={32} />
                </div>
                <h1 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Acceso Restringido</h1>
                <p className="text-sm text-zinc-400 max-w-md mb-8">No tiene los permisos de nivel de sistema necesarios para acceder al núcleo de administración.</p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-white text-black font-black text-xs uppercase italic tracking-widest rounded-xl hover:bg-zinc-200 transition-all"
                >
                    Regresar al Inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#050505] text-foreground light-admin font-inter overflow-hidden relative">
            {/* Sidebar Overlay (Mobile) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <AdminTopbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 bg-[#FAFAFA]/50 custom-scrollbar safe-area-pb relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-7xl mx-auto space-y-8 relative z-10"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Aesthetic Background Accents */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-electric-blue/5 blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-900/5 blur-[100px] -z-10 pointer-events-none" />
            </div>
        </div>
    );
}

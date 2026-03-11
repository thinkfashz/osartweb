"use client";

import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminBottomNav from './AdminBottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase-auth';

// Module-level role cache — persists across navigations within the same session.
// Keyed by userId so switching accounts invalidates it automatically.
let cachedRole: { userId: string; role: string } | null = null;

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Seed initial state from cache to avoid any loading flash on back-navigations
    const [role, setRole] = React.useState<string | null>(() =>
        cachedRole && user && cachedRole.userId === user.id ? cachedRole.role : null
    );
    const [roleLoading, setRoleLoading] = React.useState<boolean>(() =>
        !(cachedRole && user && cachedRole.userId === user.id)
    );

    // Step 1: Fetch role from Supabase once per session (cached thereafter)
    React.useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace('/admin/login');
            return;
        }

        // Cache hit — use stored value, no network call
        if (cachedRole && cachedRole.userId === user.id) {
            setRole(cachedRole.role);
            setRoleLoading(false);
            return;
        }

        // Cache miss — fetch from Supabase once
        let cancelled = false;
        const fetchRole = async () => {
            setRoleLoading(true);
            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single() as unknown as { data: { role: string } | null; error: unknown };

            if (cancelled) return;

            const fetchedRole = data?.role ?? null;
            if (fetchedRole) {
                cachedRole = { userId: user.id, role: fetchedRole };
            }
            setRole(fetchedRole);
            setRoleLoading(false);
        };

        fetchRole();
        return () => { cancelled = true; };
    }, [user, authLoading, router]);

    // Step 2: Redirect if not admin (after role is resolved)
    React.useEffect(() => {
        if (!roleLoading && role !== null && role !== 'admin') {
            cachedRole = null;
            router.replace('/admin/login?error=unauthorized');
        }
    }, [role, roleLoading, router]);

    // Step 3: Clear cache when user logs out
    React.useEffect(() => {
        if (!authLoading && !user) {
            cachedRole = null;
        }
    }, [user, authLoading]);

    // Show spinner only on first load — not on subsequent in-app navigations
    if (authLoading || roleLoading) {
        return (
            <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center gap-6">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 w-16 h-16 border-2 border-zinc-800 border-t-sky-500 rounded-2xl animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-sky-500" />
                    </div>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    Verificando credenciales de acceso...
                </p>
            </div>
        );
    }

    // Prevent flash of admin content for non-admins while redirect happens
    if (role !== 'admin') return null;

    return (
        <div className="flex h-screen bg-[#F8F9FE] dark:bg-[#050505] text-zinc-900 dark:text-white font-inter overflow-hidden relative">

            {/* Rondón Animado: Background logic */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-sky-200/40 dark:bg-sky-900/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[10%] right-[5%] w-[35%] h-[35%] bg-cyan-200/30 dark:bg-cyan-900/10 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-blue-100/20 dark:bg-blue-900/5 blur-[150px] rounded-full"
                />
            </div>

            {/* Mobile sidebar backdrop */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main column */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <AdminTopbar
                    onMenuClick={() => setIsSidebarOpen(true)}
                    userEmail={user?.email}
                />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10 custom-scrollbar pb-24 lg:pb-10">
                    <AnimatePresence mode="sync">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="max-w-7xl mx-auto space-y-8"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile bottom navigation */}
            <AdminBottomNav onMenuClick={() => setIsSidebarOpen(true)} />
        </div>
    );
}

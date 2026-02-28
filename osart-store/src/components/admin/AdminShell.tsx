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
                    <div className="absolute inset-0 w-16 h-16 border-2 border-zinc-800 border-t-electric-blue rounded-2xl animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-electric-blue" />
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
        <div className="flex h-screen bg-[#050505] text-white font-inter overflow-hidden relative">

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
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <AdminTopbar
                    onMenuClick={() => setIsSidebarOpen(true)}
                    userEmail={user?.email}
                />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 bg-zinc-950/50 custom-scrollbar pb-24 lg:pb-8">
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

                {/* Ambient glows */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-electric-blue/5 blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-900/5 blur-[100px] -z-10 pointer-events-none" />
            </div>

            {/* Mobile bottom navigation */}
            <AdminBottomNav onMenuClick={() => setIsSidebarOpen(true)} />
        </div>
    );
}

"use client";

import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-background text-foreground light-admin font-inter overflow-hidden">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <AdminTopbar />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 bg-[#FAFAFA]/50 custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-7xl mx-auto space-y-8"
                    >
                        {children}
                    </motion.div>
                </main>

                {/* Aesthetic Background Accents */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-electric-blue/5 blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-900/5 blur-[100px] -z-10 pointer-events-none" />
            </div>
        </div>
    );
}

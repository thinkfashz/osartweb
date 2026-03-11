'use client';

import React, { useState } from 'react';
import { Ticket, Send, Loader2 } from 'lucide-react';

interface CouponBoxProps {
    onApply: (code: string) => boolean;
    appliedCoupon: { code: string; discount: number } | null;
}

const CouponBox: React.FC<CouponBoxProps> = ({ onApply, appliedCoupon }) => {
    const [code, setCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setIsApplying(true);
        // Simulate API delay
        setTimeout(() => {
            const success = onApply(code);
            if (success) setCode('');
            setIsApplying(false);
        }, 600);
    };

    return (
        <div className="glass p-5 bg-zinc-900/40 border-white/5 mt-4">
            <div className="flex items-center gap-2 mb-4">
                <Ticket size={16} className="text-sky-500" />
                <span className="text-xs font-bold uppercase tracking-widest italic">Códigos de Descuento</span>
            </div>

            {appliedCoupon ? (
                <div className="flex items-center justify-between bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
                    <span className="text-xs font-black text-sky-500 uppercase">{appliedCoupon.code}</span>
                    <span className="text-[10px] font-bold text-green-500">APLICADO (-{(appliedCoupon.discount * 100)}%)</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="CÓDIGO"
                        className="flex-grow bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs font-mono uppercase focus:border-sky-500 outline-none transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={isApplying || !code.trim()}
                        className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-lg px-4 flex items-center justify-center transition-colors"
                    >
                        {isApplying ? <Loader2 size={16} className="animate-spin text-sky-500" /> : <Send size={16} />}
                    </button>
                </form>
            )}
            <p className="text-[9px] text-muted-foreground mt-3 uppercase tracking-widest font-bold">
                Prueba con: <span className="text-white">OSART10</span> o <span className="text-white">INDUSTRIAL</span>
            </p>
        </div>
    );
};

export default CouponBox;

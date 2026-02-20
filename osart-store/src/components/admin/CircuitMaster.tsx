'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, CheckCircle2, AlertCircle, RefreshCcw, Info, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Component {
    id: string;
    type: 'resistor' | 'led' | 'capacitor' | 'ic';
    value: string;
    description: string;
    colorCode?: string[]; // For resistors
    icon: React.ReactNode;
}

interface Pin {
    id: string;
    x: number;
    y: number;
    requiredType: string;
    requiredValue: string;
    placedComponentId: string | null;
}

const COMPONENTS: Component[] = [
    {
        id: 'r1',
        type: 'resistor',
        value: '10kΩ',
        description: 'Limita el flujo de corriente en el circuito.',
        colorCode: ['brown', 'black', 'orange', 'gold'],
        icon: <div className="w-8 h-2 bg-amber-200 rounded-full flex gap-1 px-1">
            <div className="w-1 h-full bg-amber-800" />
            <div className="w-1 h-full bg-black" />
            <div className="w-1 h-full bg-orange-500" />
        </div>
    },
    {
        id: 'l1',
        type: 'led',
        value: 'Red LED',
        description: 'Diodo emisor de luz. Requiere polaridad correcta.',
        icon: <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
    },
    {
        id: 'c1',
        type: 'capacitor',
        value: '100µF',
        description: 'Almacena energía eléctrica temporalmente.',
        icon: <div className="w-4 h-6 bg-slate-400 rounded-sm" />
    },
    {
        id: 'ic1',
        type: 'ic',
        value: 'NE555',
        description: 'Circuito integrado temporizador muy versátil.',
        icon: <div className="w-8 h-10 bg-slate-800 rounded-sm flex flex-col justify-between p-1">
            <div className="flex justify-between"><div className="w-1 h-1 bg-slate-600" /><div className="w-1 h-1 bg-slate-600" /></div>
            <div className="text-[6px] text-white text-center">555</div>
            <div className="flex justify-between"><div className="w-1 h-1 bg-slate-600" /><div className="w-1 h-1 bg-slate-600" /></div>
        </div>
    }
];

export default function CircuitMaster({ onComplete }: { onComplete: (xp: number) => void }) {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [selectedComp, setSelectedComp] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);
    const [board, setBoard] = useState<Pin[]>([
        { id: 'p1', x: 100, y: 100, requiredType: 'resistor', requiredValue: '10kΩ', placedComponentId: null },
        { id: 'p2', x: 200, y: 150, requiredType: 'led', requiredValue: 'Red LED', placedComponentId: null },
        { id: 'p3', x: 150, y: 250, requiredType: 'capacitor', requiredValue: '100µF', placedComponentId: null },
        { id: 'p4', x: 300, y: 100, requiredType: 'ic', requiredValue: 'NE555', placedComponentId: null },
    ]);
    const [gameOver, setGameOver] = useState(false);

    const handlePinClick = (pinId: string) => {
        if (!selectedComp || gameOver) return;

        const pin = board.find(p => p.id === pinId);
        const comp = COMPONENTS.find(c => c.id === selectedComp);

        if (!pin || !comp) return;

        if (pin.requiredType === comp.type && pin.requiredValue === comp.value) {
            setBoard(prev => prev.map(p => p.id === pinId ? { ...p, placedComponentId: selectedComp } : p));
            setScore(prev => prev + 100);
            setMessage({ text: `¡Correcto! ${comp.description}`, type: 'success' });
            setSelectedComp(null);
        } else {
            setScore(prev => Math.max(0, prev - 50));
            setMessage({ text: "Componente incorrecto para este socket.", type: 'error' });
        }
    };

    useEffect(() => {
        if (board.every(p => p.placedComponentId !== null)) {
            setGameOver(true);
            const finalXp = score + 500;
            onComplete(finalXp);
        }
    }, [board, score, onComplete]);

    const resetGame = () => {
        setBoard(prev => prev.map(p => ({ ...p, placedComponentId: null })));
        setScore(0);
        setGameOver(false);
        setMessage(null);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <Cpu className="text-emerald-500 animate-pulse" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">OSART Circuit Master</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nivel {level}: Fundamentos de Hardware</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PUNTUACIÓN</span>
                        <span className="text-xl font-black text-emerald-400 font-mono tracking-tighter">{score}</span>
                    </div>
                    <button onClick={resetGame} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all text-slate-400 hover:text-white">
                        <RefreshCcw size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* PCB Board */}
                <div className="lg:col-span-2 relative aspect-[4/3] bg-[#072a1a] rounded-2xl border-4 border-[#0b3d26] overflow-hidden shadow-inner group">
                    {/* Grid texture */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                    {/* Solder Traces (Decorative) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                        <path d="M 100 100 L 200 150 L 150 250 L 300 100" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" />
                        <path d="M 50 50 L 100 100 M 400 400 L 300 100" fill="none" stroke="#22c55e" strokeWidth="2" />
                    </svg>

                    {/* Sockets/Pins */}
                    {board.map((pin) => (
                        <motion.button
                            key={pin.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlePinClick(pin.id)}
                            className={cn(
                                "absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center transition-all z-10",
                                pin.placedComponentId
                                    ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                    : "bg-slate-900/50 border-slate-700 hover:border-emerald-500/50"
                            )}
                            style={{ left: `${(pin.x / 400) * 100}%`, top: `${(pin.y / 300) * 100}%` }}
                        >
                            {pin.placedComponentId ? (
                                COMPONENTS.find(c => c.id === pin.placedComponentId)?.icon
                            ) : (
                                <Zap size={14} className="text-slate-600 group-hover:text-emerald-500/50" />
                            )}

                            {/* Component Tooltip if incomplete */}
                            {!pin.placedComponentId && (
                                <div className="absolute top-14 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900/90 border border-slate-800 rounded text-[8px] font-black uppercase text-slate-400 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                                    Requerido: {pin.requiredValue}
                                </div>
                            )}
                        </motion.button>
                    ))}

                    <AnimatePresence>
                        {gameOver && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-50"
                            >
                                <Trophy size={64} className="text-amber-400 mb-4" />
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">¡DIAGNÓSTICO COMPLETADO!</h3>
                                <p className="text-slate-400 text-sm max-w-sm mb-6">
                                    Has reparado la unidad con éxito. El sistema está operativo y has desbloqueado nuevos conocimientos técnicos.
                                </p>
                                <div className="flex gap-4">
                                    <div className="px-6 py-3 bg-emerald-500 rounded-xl text-slate-950 font-black uppercase tracking-widest text-xs">
                                        +{score + 500} XP GANADOS
                                    </div>
                                    <button onClick={resetGame} className="px-6 py-3 bg-white text-slate-950 rounded-xl font-black uppercase tracking-widest text-xs">
                                        Jugar de Nuevo
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar / Tools */}
                <div className="flex flex-col gap-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">CAJA DE COMPONENTES</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {COMPONENTS.map((comp) => (
                                <button
                                    key={comp.id}
                                    onClick={() => setSelectedComp(comp.id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2",
                                        selectedComp === comp.id
                                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                            : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                                    )}
                                >
                                    {comp.icon}
                                    <span className="text-[10px] font-black uppercase tracking-tight">{comp.value}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <Info size={14} className="text-blue-400" />
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">REGISTRO TÉCNICO</h3>
                        </div>
                        <div className="flex-1 space-y-4">
                            {message ? (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "p-4 rounded-xl border text-xs font-bold leading-relaxed",
                                        message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                            message.type === 'error' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                                                "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                    )}
                                >
                                    {message.text}
                                </motion.div>
                            ) : (
                                <p className="text-xs text-slate-600 italic">
                                    Selecciona un componente y haz clic en el socket correspondiente en la placa base para instalarlo.
                                </p>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <div className="flex items-center justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                <span>Voltaje: 5.0V</span>
                                <span>Corriente: 20mA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

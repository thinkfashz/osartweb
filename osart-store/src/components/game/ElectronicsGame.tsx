'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, 
    Cpu, 
    Award, 
    RefreshCcw, 
    ChevronRight, 
    Terminal,
    Trophy,
    CheckCircle2,
    XCircle,
    Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase-auth';
import { useAuth } from '@/context/AuthContext';

// Dataset educacional de componentes electrónicos
const ELECTRONIC_COMPONENTS = [
    {
        id: 'resistor',
        name: 'Resistencia',
        description: 'Limita el flujo de corriente eléctrica en un circuito. ¡Es el freno de los electrones!',
        imageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400',
        hint: 'Tiene bandas de colores que indican su valor en Ohmios.'
    },
    {
        id: 'capacitor',
        name: 'Capacitor',
        description: 'Almacena energía en un campo eléctrico. Actúa como una pequeña batería temporal.',
        imageUrl: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=400',
        hint: 'Suelen ser cilíndricos y filtran el ruido en la alimentación.'
    },
    {
        id: 'transistor',
        name: 'Transistor',
        description: 'El interruptor del siglo XXI. Puede amplificar señales o actuar como puerta lógica.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400',
        hint: 'Tiene tres terminales: Emisor, Base y Colector.'
    },
    {
        id: 'diode',
        name: 'Diodo',
        description: 'Permite que la corriente fluya en una sola dirección. Es como una válvula de no retorno.',
        imageUrl: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=400',
        hint: 'Los LEDs son un tipo especial que emite luz.'
    },
    {
        id: 'microcontroller',
        name: 'Microcontrolador',
        description: 'El cerebro de la operación. Una computadora completa en un solo chip.',
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400',
        hint: 'Aquí es donde vive el código que controla todo.'
    }
];

type GameState = 'start' | 'playing' | 'result' | 'saving';

const ElectronicsGame = () => {
    const { user } = useAuth();
    const [gameState, setGameState] = useState<GameState>('start');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [attempts, setAttempts] = useState(0);
    const [currentComponent, setCurrentComponent] = useState(ELECTRONIC_COMPONENTS[0]);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong', message: string } | null>(null);
    const [savingStatus, setSavingStatus] = useState<string>('');

    const generateRound = useCallback(() => {
        const randomComp = ELECTRONIC_COMPONENTS[Math.floor(Math.random() * ELECTRONIC_COMPONENTS.length)];
        setCurrentComponent(randomComp);
        
        // Mezclar opciones
        const otherOptions = ELECTRONIC_COMPONENTS
            .filter(c => c.id !== randomComp.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2)
            .map(c => c.name);
            
        const allOptions = [...otherOptions, randomComp.name].sort(() => 0.5 - Math.random());
        setOptions(allOptions);
        setFeedback(null);
    }, []);

    const startGame = () => {
        setScore(0);
        setLevel(1);
        setAttempts(0);
        setGameState('playing');
        generateRound();
    };

    const handleAnswer = (answer: string) => {
        if (answer === currentComponent.name) {
            const nextScore = score + 100 * level;
            setScore(nextScore);
            setFeedback({ type: 'correct', message: '¡Identificación Exitosa! +100 XP' });
            
            if (attempts + 1 >= 5) {
                finishGame(nextScore);
            } else {
                setAttempts(prev => prev + 1);
                setTimeout(generateRound, 1500);
            }
        } else {
            setFeedback({ type: 'wrong', message: `Incorrecto. Este componente es un ${currentComponent.name}.` });
            if (attempts + 1 >= 5) {
                finishGame(score);
            } else {
                setAttempts(prev => prev + 1);
                setTimeout(generateRound, 2000);
            }
        }
    };

    const finishGame = async (finalScore: number) => {
        setGameState('result');
        if (user) {
            setSavingStatus('Enviando datos al registro central...');
            try {
                const { error } = await supabase.from('game_scores').insert({
                    user_id: user.id,
                    score: finalScore,
                    level: level,
                    component_identified: 'Session_Full'
                } as any);
                
                if (error) throw error;
                setSavingStatus('Sincronización de XP completada.');
            } catch (err) {
                setSavingStatus('Error en sincronización. Reintentando offline...');
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 bg-zinc-900/50 border border-white/5 rounded-3xl backdrop-blur-xl relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

            <AnimatePresence mode="wait">
                {gameState === 'start' && (
                    <motion.div 
                        key="start"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="py-12 text-center space-y-8"
                    >
                        <div className="relative inline-block">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 mb-6 mx-auto">
                                <Cpu size={64} strokeWidth={1} className="animate-pulse" />
                            </div>
                            <div className="absolute -top-4 -right-4 bg-sky-500 text-black p-2 rounded-lg font-black text-xs rotate-12">
                                +XP
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-white">
                                Master <span className="text-sky-500">Electronic</span>
                            </h1>
                            <p className="text-zinc-500 max-w-md mx-auto text-xs sm:text-sm font-bold uppercase tracking-[0.2em] leading-relaxed">
                                Identifica los componentes clave de la industria OSART y acumula puntos de conocimiento.
                            </p>
                        </div>

                        <button 
                            onClick={startGame}
                            className="group relative px-10 py-5 bg-sky-500 text-black font-black uppercase italic tracking-tighter transition-all hover:scale-105 active:scale-95 rounded-xl shadow-[0_0_30px_rgba(14,165,233,0.3)]"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Iniciar Manifiesto
                                <ChevronRight size={20} />
                            </span>
                        </button>
                    </motion.div>
                )}

                {gameState === 'playing' && (
                    <motion.div 
                        key="playing"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {/* HUD */}
                        <div className="flex justify-between items-center border-b border-white/5 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">XP_CURRENT</span>
                                    <span className="text-2xl font-black text-white italic tracking-tighter font-mono">{score.toString().padStart(5, '0')}</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/5" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">ROUND</span>
                                    <span className="text-2xl font-black text-sky-500 italic tracking-tighter font-mono">{attempts + 1}/05</span>
                                </div>
                            </div>
                            <Terminal size={24} className="text-zinc-700" />
                        </div>

                        {/* Round Content */}
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="relative aspect-square bg-zinc-800 rounded-2xl overflow-hidden border border-white/10 group">
                                <img 
                                    src={currentComponent.imageUrl} 
                                    alt="Componente" 
                                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-start gap-3">
                                    <Info size={16} className="text-sky-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
                                        Pista: {currentComponent.hint}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em]">Análisis Requerido:</span>
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">¿Qué componente es este?</h3>
                                </div>

                                <div className="grid gap-3">
                                    {options.map((option, idx) => (
                                        <button
                                            key={option}
                                            onClick={() => handleAnswer(option)}
                                            disabled={!!feedback}
                                            className={`w-full p-5 rounded-xl border font-black uppercase italic tracking-tighter text-left transition-all ${
                                                feedback?.message.includes(option) || (feedback?.type === 'correct' && option === currentComponent.name)
                                                    ? 'bg-emerald-500 border-emerald-400 text-black translate-x-2'
                                                    : feedback?.type === 'wrong' && option === currentComponent.name
                                                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-400'
                                                    : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:border-white/10'
                                            } disabled:cursor-not-allowed`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span>{idx + 1}. {option}</span>
                                                {feedback?.type === 'correct' && option === currentComponent.name && <CheckCircle2 size={20} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Feedback Message */}
                                <AnimatePresence>
                                    {feedback && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-xl flex items-center gap-3 ${
                                                feedback.type === 'correct' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                            }`}
                                        >
                                            {feedback.type === 'correct' ? <Zap size={18} /> : <XCircle size={18} />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{feedback.message}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}

                {gameState === 'result' && (
                    <motion.div 
                        key="result"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-12 text-center space-y-8"
                    >
                        <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mb-6 mx-auto shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                            <Trophy size={48} strokeWidth={1} />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-white">
                                Manifiesto <span className="text-sky-500">Completado</span>
                            </h2>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Puntaje Final de Conocimiento:</span>
                                <span className="text-6xl font-black text-white italic tracking-tighter pulse-glow">
                                    {score.toLocaleString()} <span className="text-sky-500 text-sm align-middle ml-2">XP</span>
                                </span>
                            </div>
                        </div>

                        <div className="max-w-xs mx-auto p-4 bg-zinc-900 border border-white/5 rounded-2xl">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                                {savingStatus}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={startGame}
                                className="px-10 py-5 bg-white text-black font-black uppercase italic tracking-tighter transition-all hover:bg-sky-500 rounded-xl"
                            >
                                Reintentar Desafío
                            </button>
                            <button 
                                onClick={() => setGameState('start')}
                                className="px-10 py-5 bg-zinc-800 text-white font-black uppercase italic tracking-tighter transition-all hover:bg-zinc-700 rounded-xl border border-white/5"
                            >
                                Finalizar Sesión
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ElectronicsGame;

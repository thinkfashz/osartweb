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
    Info,
    Code2,
    CircuitBoard,
    Layout
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
        <div className="w-full max-w-5xl mx-auto md:p-8 bg-zinc-900/40 md:border border-white/5 md:rounded-[2.5rem] backdrop-blur-3xl relative overflow-hidden min-h-[600px] flex flex-col">
            {/* Background PCB Pattern & Tech Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] overflow-hidden" 
                style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
                <svg width="100%" height="100%" className="absolute inset-0">
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-sky-500/20" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Circuit Decorations */}
            <div className="absolute top-0 right-0 p-4 opacity-20 hidden md:block">
                <CircuitBoard size={120} strokeWidth={0.5} className="text-sky-500" />
            </div>

            {/* Mobile Header / Status Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-black/40 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-sky-500" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500">osart_training_v2.0</span>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-sky-500/30" />)}
                </div>
            </div>

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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col p-6 md:p-0 space-y-6 md:space-y-8 relative z-10"
                    >
                        {/* HUD Superior - Diseño de Código */}
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div className="flex items-center gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] font-mono leading-none">XP_BUFFER</span>
                                    </div>
                                    <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter font-mono block">
                                        {score.toString().padStart(5, '0')}
                                    </span>
                                </div>
                                <div className="h-12 w-px bg-white/10 rotate-12" />
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] font-mono leading-none block">ITERATION</span>
                                    <span className="text-3xl md:text-5xl font-black text-sky-500 italic tracking-tighter font-mono block">
                                        0{attempts + 1}<span className="text-zinc-700 text-xl">/05</span>
                                    </span>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-col items-end gap-1 opacity-40">
                                <div className="flex gap-1 text-sky-500">
                                    <Layout size={12} /> <Code2 size={12} /> <Terminal size={12} />
                                </div>
                                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">protocol_active_hw_id</span>
                            </div>
                        </div>

                        {/* Contenido Principal con Enfoque de Análisis */}
                        <div className="grid lg:grid-cols-12 gap-8 flex-1">
                            {/* Visualizador de Hardware */}
                            <div className="lg:col-span-12 relative group rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-950/50 p-2 md:p-4 transition-all hover:border-sky-500/20">
                                <div className="relative aspect-video lg:aspect-auto lg:h-[300px] overflow-hidden rounded-[1.5rem]">
                                    <motion.img 
                                        key={currentComponent.id}
                                        initial={{ scale: 1.1, filter: 'grayscale(1) brightness(0.5)' }}
                                        animate={{ scale: 1, filter: 'grayscale(0) brightness(1)' }}
                                        src={currentComponent.imageUrl} 
                                        alt="Componente" 
                                        className="w-full h-full object-cover transition-all duration-1000"
                                    />
                                    
                                    {/* Overlay de Diagnóstico */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                                    
                                    {/* Scanning Line Animation */}
                                    <motion.div 
                                        animate={{ top: ['0%', '100%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                        className="absolute left-0 right-0 h-px bg-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.8)] z-10"
                                    />

                                    <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                                        <div className="flex items-start gap-4 max-w-md">
                                            <div className="p-3 bg-sky-500 text-black rounded-xl">
                                                <Info size={16} />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest block">Sugerencia del Sistema</span>
                                                <p className="text-[11px] md:text-xs text-zinc-300 font-bold uppercase tracking-wider leading-relaxed italic">
                                                    {currentComponent.hint}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Panel de Decisiones (Código) */}
                            <div className="lg:col-span-12 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-white/5" />
                                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] font-mono">Input_Selection_Required</h3>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {options.map((option, idx) => {
                                        const isCorrect = feedback?.message.includes(option) || (feedback?.type === 'correct' && option === currentComponent.name);
                                        const isWrong = feedback?.type === 'wrong' && option !== currentComponent.name && feedback.message.includes(option); // Este check es complejo, mejor simplificar
                                        
                                        return (
                                            <button
                                                key={option}
                                                onClick={() => handleAnswer(option)}
                                                disabled={!!feedback}
                                                className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                                                    isCorrect
                                                        ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                                                        : feedback?.type === 'wrong' && option === currentComponent.name
                                                        ? 'bg-sky-500/20 border-sky-500/50 text-sky-400'
                                                        : 'bg-zinc-950/50 border-white/5 text-zinc-400 hover:border-sky-500/50 hover:bg-zinc-900'
                                                } disabled:cursor-not-allowed overflow-hidden active:scale-95`}
                                            >
                                                {/* Button Number Indicator */}
                                                <span className={`absolute top-3 left-4 text-[9px] font-mono leading-none ${isCorrect ? 'text-black/50' : 'text-zinc-600'}`}>
                                                    0{idx + 1}
                                                </span>
                                                
                                                <div className="flex flex-col items-center gap-2 pt-2">
                                                    <span className="text-lg font-black uppercase tracking-tighter italic">{option}</span>
                                                    <div className={`h-1 w-8 rounded-full transition-all ${isCorrect ? 'bg-black/20' : 'bg-transparent group-hover:bg-sky-500/30'}`} />
                                                </div>

                                                {isCorrect && (
                                                    <motion.div 
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -right-4 -bottom-4 opacity-20"
                                                    >
                                                        <CheckCircle2 size={80} />
                                                    </motion.div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Dynamic Error/Success UI Overlay */}
                                <AnimatePresence>
                                    {feedback && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className={`relative mt-4 p-6 rounded-2xl border overflow-hidden ${
                                                feedback.type === 'correct' 
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                            }`}
                                        >
                                            {/* Glitch Effect Background on Error */}
                                            {feedback.type === 'wrong' && (
                                                <motion.div 
                                                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                                                    transition={{ duration: 0.2, repeat: Infinity }}
                                                    className="absolute inset-0 bg-rose-500/5"
                                                />
                                            )}
                                            
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                    feedback.type === 'correct' ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-black'
                                                }`}>
                                                    {feedback.type === 'correct' ? <Zap size={24} /> : <XCircle size={24} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">
                                                        {feedback.type === 'correct' ? 'Transacción_Exitosa' : 'Fallo_de_Sincronización'}
                                                    </span>
                                                    <span className="text-sm font-black uppercase tracking-widest">{feedback.message}</span>
                                                </div>
                                            </div>
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

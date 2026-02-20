'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cloud,
    Sun,
    CloudRain,
    CloudLightning,
    Clock,
    MapPin,
    Check,
    Navigation2,
    Wind,
    Thermometer,
    Satellite,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';

interface SatelliteLinkProps {
    onLocationFound: (address: string, city: string) => void;
}

interface WeatherData {
    temp: number;
    code: number;
    description: string;
}

export const SatelliteLink: React.FC<SatelliteLinkProps> = ({ onLocationFound }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [location, setLocation] = useState<{ street: string; city: string; country: string } | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'ready' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <Sun className="w-6 h-6 text-yellow-400" />;
        if (code <= 3) return <Cloud className="w-6 h-6 text-zinc-400" />;
        if (code <= 67) return <CloudRain className="w-6 h-6 text-blue-400" />;
        return <CloudLightning className="w-6 h-6 text-purple-400" />;
    };

    const fetchWithTimeout = async (url: string, options: any = {}, timeout: number = 8000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    };

    const handleAction = () => {
        if (!navigator.geolocation) {
            setErrorMessage('Geolocalización no soportada en este navegador');
            setStatus('error');
            return;
        }

        setIsConnecting(true);
        setStatus('scanning');
        setErrorMessage(null);

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude: lat, longitude: lon } = pos.coords;

            // 1. Fetch Location
            try {
                const geoRes = await fetchWithTimeout(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
                    { headers: { 'Accept-Language': 'es', 'User-Agent': 'OSART-Store-Checkout' } }
                );

                if (!geoRes.ok) throw new Error('Servidor de mapas fuera de línea');

                const geoData = await geoRes.json();
                if (geoData.address) {
                    setLocation({
                        street: geoData.address.road || geoData.address.suburb || 'Ubicación Detectada',
                        city: geoData.address.city || geoData.address.town || geoData.address.village || '',
                        country: geoData.address.country || 'Chile'
                    });
                }
            } catch (err: any) {
                console.error('Geo error:', err);
                setErrorMessage(err.name === 'AbortError' ? 'Tiempo de espera agotado en mapas' : 'Error al conectar con servidor de mapas');
            }

            // 2. Fetch Weather (independent)
            try {
                const weatherRes = await fetchWithTimeout(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
                );
                const weatherData = await weatherRes.json();
                if (weatherData.current_weather) {
                    setWeather({
                        temp: weatherData.current_weather.temperature,
                        code: weatherData.current_weather.weathercode,
                        description: 'Sincronizado'
                    });
                }
            } catch (err) {
                console.error('Weather error:', err);
                // We keep going even if weather fails
            }

            // Final check
            if (location || status === 'scanning') {
                setTimeout(() => {
                    setStatus(location ? 'ready' : 'error');
                    if (!location && !errorMessage) setErrorMessage('No se pudo resolver la dirección técnica');
                }, 1500);
            }
        }, (geoErr) => {
            console.error('Browser Geo error:', geoErr);
            setErrorMessage('Permiso de ubicación denegado o señal débil');
            setStatus('error');
        }, { timeout: 10000 });
    };

    const applyLocation = () => {
        if (location) {
            onLocationFound(location.street, location.city);
            setIsConnecting(false);
            setStatus('idle');
        }
    };

    return (
        <div className="w-full space-y-4">
            <AnimatePresence mode="wait">
                {status === 'idle' ? (
                    <motion.button
                        key="btn-idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={handleAction}
                        className="group relative w-full py-6 glass border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center gap-4 transition-all hover:border-electric-blue/40"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/0 via-electric-blue/5 to-electric-blue/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <Satellite className="w-5 h-5 text-zinc-500 group-hover:text-electric-blue group-hover:rotate-12 transition-all" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 group-hover:text-white">Establecer Enlace de Precisión</span>
                    </motion.button>
                ) : (
                    <motion.div
                        key="panel-active"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`glass border ${status === 'error' ? 'border-red-500/30' : 'border-electric-blue/30'} rounded-2xl p-6 relative overflow-hidden bg-zinc-950/40 backdrop-blur-xl shadow-2xl`}
                    >
                        {/* Status Bar */}
                        <div className="flex justify-between items-center mb-6 pt-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${status === 'scanning' ? 'bg-yellow-400 animate-pulse' :
                                        status === 'error' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' :
                                            'bg-green-500 shadow-[0_0_10px_#22c55e]'
                                    }`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                    {status === 'scanning' ? 'Orbital Scan Active' :
                                        status === 'error' ? 'Connection Error' : 'Link Synchronized'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80 font-mono text-sm font-bold">
                                <Clock className="w-4 h-4 text-electric-blue" />
                                {currentTime}
                            </div>
                        </div>

                        {/* Error Handling UI */}
                        {status === 'error' ? (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                                <div className="text-center">
                                    <p className="text-xs text-white font-bold uppercase tracking-widest mb-1">Error de Sincronización</p>
                                    <p className="text-[10px] text-zinc-500 uppercase">{errorMessage || 'Fallo desconocido en la red satelital'}</p>
                                </div>
                                <button
                                    onClick={handleAction}
                                    className="flex items-center gap-2 px-6 py-2 border border-zinc-800 rounded text-[10px] font-black text-white hover:bg-white/5 transition-all"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    Reintentar Enlace
                                </button>
                            </div>
                        ) : (
                            /* Main Grid */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Location Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-electric-blue" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ubicación Actual</span>
                                    </div>
                                    <div className="pl-8">
                                        <AnimatePresence mode="wait">
                                            {status === 'scanning' ? (
                                                <motion.div key="loc-scan" className="space-y-2">
                                                    <div className="h-4 w-3/4 bg-zinc-800/50 animate-pulse rounded" />
                                                    <div className="h-3 w-1/2 bg-zinc-800/50 animate-pulse rounded" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="loc-ready"
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    className="space-y-1"
                                                >
                                                    <p className="text-white text-lg font-black leading-tight">{location?.street}</p>
                                                    <p className="text-zinc-400 text-sm font-bold">{location?.city}, {location?.country}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Weather Section */}
                                <div className="space-y-4 border-l border-zinc-900 md:pl-8">
                                    <div className="flex items-center gap-3">
                                        <Thermometer className="w-5 h-5 text-electric-blue" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Clima Local</span>
                                    </div>
                                    <div className="pl-8 flex items-center gap-6">
                                        <AnimatePresence mode="wait">
                                            {status === 'scanning' ? (
                                                <motion.div key="weather-scan" className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-zinc-800/50 animate-pulse rounded-full" />
                                                    <div className="h-8 w-12 bg-zinc-800/50 animate-pulse rounded" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="weather-ready"
                                                    initial={{ x: 10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    className="flex items-center gap-4"
                                                >
                                                    {weather ? getWeatherIcon(weather.code) : <AlertTriangle className="w-5 h-5 text-zinc-700" />}
                                                    <span className="text-3xl font-black text-white italic">{weather ? `${weather.temp.toFixed(1)}°` : '--°'}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <AnimatePresence>
                            {status === 'ready' && (
                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    onClick={applyLocation}
                                    className="w-full mt-8 py-4 bg-electric-blue hover:bg-white text-black font-black uppercase text-xs tracking-[0.2em] transition-all rounded-lg flex items-center justify-center gap-3 group shadow-[0_0_20px_rgba(0,163,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                >
                                    Autocompletar Dirección
                                    <Check className="w-4 h-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Scan Line Animation */}
                        {status === 'scanning' && (
                            <motion.div
                                className="absolute top-0 left-0 w-full h-[2px] bg-electric-blue z-50 pointer-events-none blur-sm"
                                animate={{ top: ['0%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

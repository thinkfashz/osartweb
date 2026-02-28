'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    toggleTheme: () => { },
    isDark: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const stored = localStorage.getItem('osart_theme') as Theme | null;
        if (stored === 'light' || stored === 'dark') {
            setTheme(stored);
            document.documentElement.setAttribute('data-theme', stored);
        }
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem('osart_theme', next);
            document.documentElement.setAttribute('data-theme', next);
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            <div data-theme={theme} className={theme === 'light' ? 'theme-light' : ''}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);

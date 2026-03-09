'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light' | 'red';

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    nextTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    setTheme: () => { },
    nextTheme: () => { },
    isDark: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const stored = localStorage.getItem('osart_theme') as Theme | null;
        if (stored === 'light' || stored === 'dark' || stored === 'red') {
            setTheme(stored);
            document.documentElement.setAttribute('data-theme', stored);
        }
    }, []);

    const updateTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('osart_theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const nextTheme = useCallback(() => {
        setTheme(prev => {
            let next: Theme;
            if (prev === 'dark') next = 'light';
            else if (prev === 'light') next = 'red';
            else next = 'dark';

            localStorage.setItem('osart_theme', next);
            document.documentElement.setAttribute('data-theme', next);
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme: updateTheme, nextTheme, isDark: theme === 'dark' }}>
            <div data-theme={theme} className={`min-h-screen transition-colors duration-500 theme-${theme}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);

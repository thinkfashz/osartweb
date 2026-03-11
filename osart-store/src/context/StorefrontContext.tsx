"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface StorefrontSettings {
    id: string;
    hero_title: string;
    hero_subtitle: string;
    primary_color: string;
    secondary_color: string;
    hero_image_url: string | null;
}

interface StorefrontContextType {
    settings: StorefrontSettings;
    loading: boolean;
    updateSettings: (newSettings: Partial<StorefrontSettings>) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const defaultSettings: StorefrontSettings = {
    id: '',
    hero_title: 'La Energía que Mueve tus Reparaciones.',
    hero_subtitle: 'Componentes de alta fidelidad para servicios técnicos de élite. Ingeniería de precisión aplicada a cada pieza.',
    primary_color: '#0EA5E9',
    secondary_color: '#06B6D4',
    hero_image_url: null,
};

const StorefrontContext = createContext<StorefrontContextType | undefined>(undefined);

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<StorefrontSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('storefront_settings')
                .select('*')
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Row not found, this shouldn't happen if migration worked but good to handle
                    console.log('Storefront settings row not found');
                } else {
                    console.error('Error fetching storefront settings:', error);
                }
            } else if (data) {
                setSettings(data);
            }
        } catch (err) {
            console.error('Unexpected error fetching storefront settings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const updateSettings = async (newSettings: Partial<StorefrontSettings>) => {
        try {
            const { error } = await supabase
                .from('storefront_settings')
                .update(newSettings)
                .eq('id', settings.id);

            if (error) throw error;
            setSettings(prev => ({ ...prev, ...newSettings }));
        } catch (err) {
            console.error('Error updating storefront settings:', err);
            throw err;
        }
    };

    return (
        <StorefrontContext.Provider value={{ settings, loading, updateSettings, refreshSettings: fetchSettings }}>
            {children}
        </StorefrontContext.Provider>
    );
}

export function useStorefront() {
    const context = useContext(StorefrontContext);
    if (context === undefined) {
        throw new Error('useStorefront must be used within a StorefrontProvider');
    }
    return context;
}

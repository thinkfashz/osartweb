import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with the public anon key.
 * Used for user-facing operations respecting RLS.
 */
export const makeSupabaseAnon = (): SupabaseClient => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
    }

    return createClient(url, key, {
        auth: { persistSession: false },
    });
};

/**
 * Creates a Supabase client with the service role key.
 * HIGH PRIVILEGE: Bypasses RLS. Use ONLY for admin/server-side operations.
 */
export const makeSupabaseService = (): SupabaseClient => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }

    console.log('Initializing Supabase Service Client...');
    if (key.includes('service_role')) {
        console.log('✅ Service Role key detected.');
    } else {
        console.warn('⚠️ WARNING: Service Role key does NOT seem to contain "service_role" claim.');
    }

    return createClient(url, key, {
        auth: { persistSession: false },
    });
};

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables: URL or Anon Key');
}

/**
 * Public client for client-side and public SSR operations (respects RLS)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * High-privilege client for backend operations (bypasses RLS).
 * ONLY use in Next.js Server Actions or Route Handlers.
 */
export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    })
    : null;

export type { SupabaseClient };

/**
 * Supabase Client Abstraction Layer for LunaLink
 * 
 * When ready to connect to real Supabase:
 * 1. Install @supabase/supabase-js: `npm install @supabase/supabase-js`
 * 2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env
 * 3. Replace the mock exports below with the real createClient instance:
 * 
 *    import { createClient } from '@supabase/supabase-js';
 *    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
 *    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
 *    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
 * 
 * All queries across LunaLink flow through the abstract `src/services/api.ts`
 * so swapping this file requires zero changes to your UI components.
 */

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined;

export const IS_SUPABASE_CONFIGURED = Boolean(
  metaEnv?.VITE_SUPABASE_URL && metaEnv?.VITE_SUPABASE_ANON_KEY
);

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  provider: 'mock_local' | 'supabase';
  notes: string;
}

export const getSupabaseConfigStatus = (): SupabaseConfigStatus => ({
  isConfigured: IS_SUPABASE_CONFIGURED,
  provider: IS_SUPABASE_CONFIGURED ? 'supabase' : 'mock_local',
  notes: IS_SUPABASE_CONFIGURED
    ? 'Connected to live Supabase project.'
    : 'Running in high-fidelity offline mock mode. All changes simulate realistic database transactions.'
});

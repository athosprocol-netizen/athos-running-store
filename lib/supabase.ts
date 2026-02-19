
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Faltan las variables de entorno de Supabase. La persistencia no funcionará.');
}

console.log("Init Supabase with URL:", supabaseUrl);

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            // Bypass Navigator LockManager to prevent 10s wait on some devices/configs
            lock: async (name: string, acquireTimeout: number, acquire: () => Promise<any>) => {
                return await acquire();
            }
        }
    }
);

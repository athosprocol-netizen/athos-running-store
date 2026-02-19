
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Faltan las variables de entorno de Supabase. La persistencia no funcionará.');
}

console.log("Init Supabase with URL:", supabaseUrl);

// Cookie Storage Adapter for maximum resilience
class CookieStorageAdapter {
    getItem(key: string): string | null {
        try {
            const name = key + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return null;
        } catch (e) {
            console.warn(`CookieStorage: Read error for ${key}`, e);
            return null;
        }
    }

    setItem(key: string, value: string): void {
        try {
            const d = new Date();
            d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year
            const expires = "expires=" + d.toUTCString();
            const isSecure = window.location.protocol === 'https:' ? ';Secure' : '';
            // SameSite=Lax is standard for auth; Secure is needed for HTTPS only
            document.cookie = key + "=" + value + ";" + expires + ";path=/;SameSite=Lax" + isSecure;
        } catch (e) {
            console.warn(`CookieStorage: Write error for ${key}`, e);
        }
    }

    removeItem(key: string): void {
        try {
            document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        } catch (e) {
            console.warn(`CookieStorage: Delete error for ${key}`, e);
        }
    }
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
        auth: {
            persistSession: true,
            storage: new CookieStorageAdapter(), // Use Cookie adapter
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

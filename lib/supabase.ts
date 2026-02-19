
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Faltan las variables de entorno de Supabase. La persistencia no funcionará.');
}

console.log("Init Supabase with URL:", supabaseUrl);

// Custom Storage Adapter that swallows errors and falls back to memory
// Custom Storage Adapter that swallows errors and falls back to memory
class ResilientStorage {
    private memoryStore: Map<string, string>;

    constructor() {
        this.memoryStore = new Map();
    }

    getItem(key: string): string | null {
        try {
            const item = sessionStorage.getItem(key);
            return item || this.memoryStore.get(key) || null;
        } catch (e) {
            console.warn(`ResilientStorage: Read error for ${key}, using memory.`, e);
            return this.memoryStore.get(key) || null;
        }
    }

    setItem(key: string, value: string): void {
        try {
            sessionStorage.setItem(key, value);
        } catch (e) {
            console.warn(`ResilientStorage: Write error for ${key}, using memory.`, e);
        }
        this.memoryStore.set(key, value);
    }

    removeItem(key: string): void {
        try {
            sessionStorage.removeItem(key);
        } catch (e) {
            console.warn(`ResilientStorage: Delete error for ${key}.`, e);
        }
        this.memoryStore.delete(key);
    }
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
        auth: {
            persistSession: true,
            storage: new ResilientStorage(), // Use wrapper instead of direct localStorage
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Manually load .env since we are running with node directly
const envConfig = dotenv.parse(fs.readFileSync('.env'));

const url = envConfig.VITE_SUPABASE_URL;
const key = envConfig.VITE_SUPABASE_ANON_KEY;

console.log("Probando conexión a:", url);
console.log("Usando Key:", key ? key.substring(0, 10) + "..." : "MISSING");

const supabase = createClient(url, key);

async function test() {
    try {
        const start = Date.now();
        const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
        // Try auth healtcheck
        const { data: authData, error: authError } = await supabase.auth.getSession();

        console.log("--- RESULTADOS ---");
        if (error) console.error("DB Error:", error.message);
        else console.log("DB Conexión: ÉXITO (Status: OK)");

        if (authError) console.error("Auth Error:", authError.message);
        else console.log("Auth Conexión: ÉXITO");

        console.log(`Tiempo: ${Date.now() - start}ms`);
    } catch (e) {
        console.error("Excepción:", e);
    }
}

test();

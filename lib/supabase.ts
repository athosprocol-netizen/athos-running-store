
import { createClient } from '@supabase/supabase-js';

// TEMPORARY DEBUG: Hardcoding to guarantee connection
const supabaseUrl = "https://beiatvntfbmdafhjpwyn.supabase.co";
const supabaseAnonKey = "sb_publishable_clvqs8U2OcFaRI7CyB47MQ_cesMJXRf";

console.log("Supabase Client Init:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true, // Keep this true for now
        autoRefreshToken: true,
    }
});

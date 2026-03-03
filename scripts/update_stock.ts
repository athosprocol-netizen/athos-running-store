import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateAllStock() {
    console.log('Fetching all products...');
    const { data: products, error } = await supabase.from('products').select('id');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    if (!products || products.length === 0) {
        console.log('No products found in database.');
        return;
    }

    console.log(`Found ${products.length} products. Updating stock...`);

    for (const product of products) {
        const { error: updateError } = await supabase
            .from('products')
            .update({ stock: 1 })
            .eq('id', product.id);

        if (updateError) {
            console.error(`Failed to update ${product.id}:`, updateError);
        } else {
            console.log(`Updated stock for ${product.id}`);
        }
    }

    console.log('Update complete!');
}

updateAllStock();

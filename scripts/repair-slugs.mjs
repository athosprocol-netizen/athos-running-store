import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://beiatvntfbmdafhjpwyn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_clvqs8U2OcFaRI7CyB47MQ_cesMJXRf';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Helper: detect if a string looks like a UUID
const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

async function repairSlugs() {
  console.log('🔧 Iniciando reparación de slugs en Supabase...\n');

  // --- Events ---
  const { data: events, error: evErr } = await supabase.from('events').select('id, title, slug');
  if (evErr) { console.error('Error obteniendo eventos:', evErr.message); }
  else {
    console.log(`📅 Revisando ${events.length} eventos...`);
    for (const event of events) {
      const expected = slugify(event.title);
      const isBroken = !event.slug || event.slug !== expected || isUUID(event.slug);
      if (isBroken) {
        console.log(`  ✏️  Evento "${event.title}"`);
        console.log(`       slug actual  : "${event.slug}"`);
        console.log(`       slug correcto: "${expected}"`);
        const { error } = await supabase.from('events').update({ slug: expected }).eq('id', event.id);
        if (error) console.error(`       ❌ Error: ${error.message}`);
        else console.log(`       ✅ Corregido`);
      }
    }
    console.log('');
  }

  // --- Products ---
  const { data: products, error: prErr } = await supabase.from('products').select('id, name, slug');
  if (prErr) { console.error('Error obteniendo productos:', prErr.message); }
  else {
    console.log(`🛍️  Revisando ${products.length} productos...`);
    for (const product of products) {
      const expected = slugify(product.name);
      const isBroken = !product.slug || product.slug !== expected || isUUID(product.slug);
      if (isBroken) {
        console.log(`  ✏️  Producto "${product.name}"`);
        console.log(`       slug actual  : "${product.slug}"`);
        console.log(`       slug correcto: "${expected}"`);
        const { error } = await supabase.from('products').update({ slug: expected }).eq('id', product.id);
        if (error) console.error(`       ❌ Error: ${error.message}`);
        else console.log(`       ✅ Corregido`);
      }
    }
    console.log('');
  }

  console.log('🎉 Reparación completada.');
}

repairSlugs().catch(console.error);

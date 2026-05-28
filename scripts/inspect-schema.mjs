import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://beiatvntfbmdafhjpwyn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_clvqs8U2OcFaRI7CyB47MQ_cesMJXRf';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectSchema() {
  console.log('🔍 Inspecting schema...');
  
  // Try to select slug from events
  const { data, error } = await supabase.from('events').select('slug').limit(1);
  
  if (error) {
    if (error.message.includes('column "slug" does not exist')) {
      console.log('❌ El campo "slug" NO existe en la tabla "events".');
    } else {
      console.log('Error:', error.message);
    }
  } else {
    console.log('✅ El campo "slug" EXISTE en la tabla "events".');
  }

  // Try to select slug from products
  const { data: dataProd, error: errorProd } = await supabase.from('products').select('slug').limit(1);
  
  if (errorProd) {
    if (errorProd.message.includes('column "slug" does not exist')) {
      console.log('❌ El campo "slug" NO existe en la tabla "products".');
    } else {
      console.log('Error:', errorProd.message);
    }
  } else {
    console.log('✅ El campo "slug" EXISTE en la tabla "products".');
  }
}

inspectSchema().catch(console.error);

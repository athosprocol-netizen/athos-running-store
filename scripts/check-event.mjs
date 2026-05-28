import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://beiatvntfbmdafhjpwyn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_clvqs8U2OcFaRI7CyB47MQ_cesMJXRf';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkEvent() {
  const eventId = 'd3f509fb-4ad8-4ec8-986a-acce326388e1';
  console.log(`🔍 Checking event ${eventId}...`);
  
  const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
  
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Event found:');
    console.log(`  Title: ${data.title}`);
    console.log(`  Slug : "${data.slug}"`);
    console.log(`  Expected Slug: ${data.title ? '...calculating...' : 'N/A'}`);
  }
}

checkEvent().catch(console.error);

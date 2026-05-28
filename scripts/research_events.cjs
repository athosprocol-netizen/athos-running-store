const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env'));
const url = envConfig.VITE_SUPABASE_URL;
const key = envConfig.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function research() {
    const { data: events, error } = await supabase.from('events').select('*');
    if (error) {
        console.error("DB Error:", error.message);
        return;
    }
    
    console.log(`Total events in DB: ${events.length}`);
    
    const juneEvents = events.filter(e => e.date && e.date.includes('2026-06'));
    console.log(`June events: ${juneEvents.length}`);
    
    const withImage = juneEvents.filter(e => e.image && e.image.trim() !== '');
    console.log(`June events WITH image: ${withImage.length}`);
    withImage.forEach(e => console.log(`- ${e.title} (ID: ${e.id})`));
    
    const withoutImage = juneEvents.filter(e => !e.image || e.image.trim() === '');
    console.log(`June events WITHOUT image (mostly the ones just added): ${withoutImage.length}`);
    
    // Find possible duplicates based on title similarity
    console.log("\nPossible duplicates:");
    withImage.forEach(existing => {
        withoutImage.forEach(added => {
            // simple match logic
            const t1 = existing.title.toLowerCase().replace(/[^a-z0-9]/g, '');
            const t2 = added.title.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (t1.includes(t2) || t2.includes(t1) || existing.title.toLowerCase().includes(added.title.toLowerCase().substring(0, 10))) {
                console.log(`MATCH FOUND:`);
                console.log(`  Existing (Keep): ${existing.title} [${existing.id}]`);
                console.log(`  Added (Delete): ${added.title} [${added.id}]`);
            }
        });
    });
}

research();

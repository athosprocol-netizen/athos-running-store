const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');
const axios = require('axios');
const cheerio = require('cheerio');

const envConfig = dotenv.parse(fs.readFileSync('.env'));
const url = envConfig.VITE_SUPABASE_URL;
const key = envConfig.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function main() {
    console.log("Logging in as admin...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'kaieke37@gmail.com',
        password: 'facebook37'
    });

    if (authError) {
        console.error("Login failed:", authError.message);
        return;
    }
    
    console.log("Fetching events from DB...");
    const { data: events, error } = await supabase.from('events').select('*');
    if (error) {
        console.error("DB Error:", error.message);
        return;
    }
    
    const juneEvents = events.filter(e => e.date && e.date.includes('2026-06'));
    const withImage = juneEvents.filter(e => e.image && e.image.trim() !== '');
    const withoutImage = juneEvents.filter(e => !e.image || e.image.trim() === '');
    
    console.log("1. Deleting Duplicates...");
    let deletedCount = 0;
    
    for (const added of withoutImage) {
        // match exact name or substring
        const t2 = added.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        let isDuplicate = false;
        for (const existing of withImage) {
            const t1 = existing.title.toLowerCase().replace(/[^a-z0-9]/g, '');
            // Only true matches
            if (t1 === t2 || (t1.length > 5 && t2.includes(t1)) || (t2.length > 5 && t1.includes(t2))) {
                isDuplicate = true;
                break;
            }
        }
        if (isDuplicate) {
            console.log(`Deleting duplicate: ${added.title}`);
            const { error: delErr } = await supabase.from('events').delete().eq('id', added.id);
            if (delErr) console.error("Error deleting:", delErr);
            else deletedCount++;
        }
    }
    console.log(`Deleted ${deletedCount} duplicates.\n`);
    
    // Refresh list of events without image (since we deleted some)
    const { data: currentEvents } = await supabase.from('events').select('*');
    const toUpdate = currentEvents.filter(e => e.date && e.date.includes('2026-06') && (!e.image || e.image.trim() === ''));
    
    console.log(`2. Extracting Descriptions and Official Links for ${toUpdate.length} events...`);
    
    for (let i = 0; i < toUpdate.length; i++) {
        const ev = toUpdate[i];
        
        let newDescription = ev.description;
        let newExternalUrl = '';
        
        if (ev.external_url && ev.external_url.includes('travesiadeportiva.com')) {
            try {
                const res = await axios.get(ev.external_url, { timeout: 10000 });
                const $ = cheerio.load(res.data);
                
                // Get Description (first 2-3 paragraphs from content)
                let textContent = '';
                $('.tep_content p').each((idx, el) => {
                    const text = $(el).text().trim();
                    if (text.length > 20) textContent += text + '\n\n';
                });
                
                if (!textContent) {
                    $('.entry-content p').each((idx, el) => {
                        const text = $(el).text().trim();
                        if (text.length > 20) textContent += text + '\n\n';
                    });
                }
                
                if (textContent.length > 50) {
                    newDescription = textContent.trim().substring(0, 1500); // Reasonable limit
                } else {
                    newDescription = `El evento ${ev.title} se llevará a cabo en ${ev.city}. Prepárate para participar en una increíble carrera llena de energía y buen ambiente. ¡Ven y desafía tus límites junto a otros corredores! Para más detalles técnicos y organizativos, revisa la información de los organizadores.`;
                }
                
                // Get Official Link
                $('a').each((idx, el) => {
                    const href = $(el).attr('href');
                    const text = $(el).text().toUpperCase();
                    if (href && !href.includes('travesiadeportiva.com') && !href.includes('wa.me') && !href.includes('whatsapp') && !href.includes('instagram.com/travesiadeportiva') && (text.includes('INSCRÍBETE') || text.includes('VISITAR SITIO') || text.includes('MÁS INFORMACIÓN') || href.includes('docs.google') || href.includes('forms'))) {
                        newExternalUrl = href;
                    }
                });
                
            } catch (err) {
                console.log(`Could not fetch details for ${ev.title}: ${err.message}`);
                newDescription = `El evento ${ev.title} se llevará a cabo en ${ev.city}. Prepárate para participar en una increíble carrera llena de energía y buen ambiente. ¡Ven y desafía tus límites junto a otros corredores! Para más detalles técnicos y organizativos, revisa la información de los organizadores.`;
            }
        } else {
            newExternalUrl = ev.external_url;
            newDescription = `El evento ${ev.title} se llevará a cabo en ${ev.city}. Prepárate para participar en una increíble carrera llena de energía y buen ambiente. ¡Ven y desafía tus límites junto a otros corredores! Para más detalles técnicos y organizativos, revisa la información de los organizadores.`;
        }
        
        let newDistances = [];
        if (ev.distances && ev.distances.length > 0) {
            // Check if it's already a single string with hyphens
            if (ev.distances.length === 1 && ev.distances[0].includes(' - ')) {
                newDistances = ev.distances;
            } else {
                const distString = ev.distances.join(' - ').replace(/,/g, ' - ').replace(/\s*-\s*/g, ' - ');
                newDistances = [distString];
            }
        } else {
            newDistances = ["5K - 10K - 21K"];
        }
        
        process.stdout.write(`\rUpdating [${i+1}/${toUpdate.length}]: ${ev.title.substring(0,30)}...`);
        
        const { error: updErr } = await supabase.from('events').update({
            description: newDescription,
            external_url: newExternalUrl || null,
            distances: newDistances
        }).eq('id', ev.id);
        
        if (updErr) console.error("\nError updating:", updErr);
    }
    
    console.log("\nDone! Database successfully cleaned and enriched.");
}

main();

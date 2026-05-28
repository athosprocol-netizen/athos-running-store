const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
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
    console.log("Logged in successfully. Reading formatted events...");
    
    const events = JSON.parse(fs.readFileSync('final_events_formatted.json', 'utf-8'));
    console.log(`Found ${events.length} events to upload.`);
    
    let successCount = 0;
    
    for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        
        // Match the database schema based on supabase_events.sql:
        // id, title, date, location, city, description, distances, external_url, status, price, max_participants
        
        const distancesArr = ev.distances ? ev.distances.split(',').map(d => d.trim()) : [];
        
        const payload = {
            title: ev.title,
            date: ev.date,
            location: ev.location,
            city: ev.city,
            description: ev.description,
            distances: distancesArr,
            external_url: ev.externalUrl,
            status: 'upcoming',
            price: 0,
            max_participants: ev.maxParticipants,
            organizer_id: authData.user.id
        };
        
        const { error } = await supabase.from('events').insert([payload]);
        if (error) {
            console.error(`Error inserting ${ev.title}:`, error.message);
        } else {
            successCount++;
            process.stdout.write(`\rUploaded ${successCount}/${events.length}...`);
        }
    }
    
    console.log(`\nUpload complete! Successfully inserted ${successCount} events.`);
}

main();

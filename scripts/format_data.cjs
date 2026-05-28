const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\Alejandro\\.gemini\\antigravity\\brain\\f4b71ede-2bd1-4acb-a517-942c8340910b\\.system_generated\\steps\\17\\content.md', 'utf-8');
const articleRegex = /<article[^>]*class="[^"]*themify_event_post[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
let match;
const events = [];

while ((match = articleRegex.exec(content)) !== null) {
    const articleHTML = match[1];
    
    const titleMatch = articleHTML.match(/<h2 class="tep_post_title[^>]*><a[^>]*>([^<]+)<\/a><\/h2>/);
    const title = titleMatch ? titleMatch[1] : 'Unknown';
    
    const dateMatch = articleHTML.match(/<span class="event-day">([^<]+)<\/span>/);
    const dateStr = dateMatch ? dateMatch[1].trim() : 'Unknown';
    
    const locMatch = articleHTML.match(/<span class="tep_location">\s*([\s\S]*?)\s*<\/span>/);
    const loc = locMatch ? locMatch[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : 'Unknown';
    
    const linkMatch = articleHTML.match(/<h2 class="tep_post_title[^>]*><a href="([^"]+)"/);
    const link = linkMatch ? linkMatch[1] : 'Unknown';
    
    // Parse location
    let city = loc;
    let department = loc;
    if (loc.includes(',')) {
        const parts = loc.split(',');
        city = parts[0].trim();
        department = parts[1].trim();
    }
    
    // Parse date
    // Format is "28 junio, 2026"
    let isNight = title.toLowerCase().includes('noche') || title.toLowerCase().includes('night') || title.toLowerCase().includes('nocturna');
    let dateIso = new Date().toISOString();
    try {
        const months = {'enero':0, 'febrero':1, 'marzo':2, 'abril':3, 'mayo':4, 'junio':5, 'julio':6, 'agosto':7, 'septiembre':8, 'octubre':9, 'noviembre':10, 'diciembre':11};
        const dateParts = dateStr.replace(',', '').split(' ');
        if (dateParts.length >= 3) {
            const day = parseInt(dateParts[0]);
            const month = months[dateParts[1].toLowerCase()] || 5;
            const year = parseInt(dateParts[2]);
            const hour = isNight ? 18 : 6;
            const d = new Date(year, month, day, hour, 0, 0);
            dateIso = d.toISOString();
        }
    } catch(e) {}
    
    // Extract Distances
    const distRegex = /(\d+)\s*(k|km)/gi;
    let distMatch;
    const distancesSet = new Set();
    while ((distMatch = distRegex.exec(title)) !== null) {
        distancesSet.add(distMatch[1] + 'K');
    }
    let distances = Array.from(distancesSet).join(', ');
    if (!distances) distances = "5K, 10K, 21K"; // Fallback as requested initially
    
    const description = `Gran evento de running en ${city}, ${department}. ${title} te espera este ${dateStr}. Inscríbete ahora para participar y superar tus límites. Para obtener todos los detalles exactos sobre horarios confirmados, entrega de kits y recorrido, por favor visita el sitio web oficial.`;
    
    events.push({
        title,
        date: dateIso,
        location: department,
        city: city,
        description,
        distances,
        externalUrl: link,
        maxParticipants: 1000
    });
}

fs.writeFileSync('final_events_formatted.json', JSON.stringify(events, null, 2));
console.log(`Formatted ${events.length} events successfully.`);

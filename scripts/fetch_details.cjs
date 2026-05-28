const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function main() {
    console.log("Reading initial content...");
    const content = fs.readFileSync('C:\\Users\\Alejandro\\.gemini\\antigravity\\brain\\f4b71ede-2bd1-4acb-a517-942c8340910b\\.system_generated\\steps\\17\\content.md', 'utf-8');

    const articleRegex = /<article[^>]*class="[^"]*themify_event_post[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
    let match;
    const events = [];

    while ((match = articleRegex.exec(content)) !== null) {
        const articleHTML = match[1];
        const articleTag = match[0];
        
        if (!articleTag.includes('event-category-carrera-de-calle') && !articleTag.includes('event-category-trail') && !articleTag.includes('event-category-atletismo')) {
            continue;
        }
        
        const titleMatch = articleHTML.match(/<h2 class="tep_post_title[^>]*><a[^>]*>([^<]+)<\/a><\/h2>/);
        const title = titleMatch ? titleMatch[1] : 'Unknown';
        
        const dateMatch = articleHTML.match(/<span class="event-day">([^<]+)<\/span>/);
        const date = dateMatch ? dateMatch[1].trim() : 'Unknown';
        
        const locMatch = articleHTML.match(/<span class="tep_location">\s*([\s\S]*?)\s*<\/span>/);
        const loc = locMatch ? locMatch[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : 'Unknown';
        
        const linkMatch = articleHTML.match(/<h2 class="tep_post_title[^>]*><a href="([^"]+)"/);
        const link = linkMatch ? linkMatch[1] : 'Unknown';
        
        events.push({ title, date, loc, link });
    }
    
    console.log(`Found ${events.length} events. Fetching details...`);
    
    const detailedEvents = [];
    
    // Process first 3 events
    for (let i = 0; i < Math.min(events.length, 3); i++) {
        const ev = events[i];
        console.log(`Fetching ${ev.title}...`);
        try {
            const res = await axios.get(ev.link);
            const $ = cheerio.load(res.data);
            
            let ciudad = '';
            let hora = '';
            let distancias = '';
            
            $('*').each((i, el) => {
                const text = $(el).text().trim().toUpperCase();
                if (text === 'CIUDAD') {
                    ciudad = $(el).next().text().trim() || $(el).parent().text().replace(/CIUDAD/i, '').trim();
                }
                if (text === 'HORA') {
                    hora = $(el).next().text().trim() || $(el).parent().text().replace(/HORA/i, '').trim();
                }
                if (text === 'DISTANCIAS') {
                    distancias = $(el).next().text().trim() || $(el).parent().text().replace(/DISTANCIAS/i, '').trim();
                }
            });
            
            let descripcion = '';
            $('*').each((i, el) => {
                if ($(el).text().trim().toUpperCase() === 'ACERCA DE LA CARRERA' || $(el).text().trim().toUpperCase() === 'ACERCA DEL EVENTO') {
                    let next = $(el).parent().next();
                    while (next.length && !next.is('h1,h2,h3,h4,div.tep_ticket')) {
                        descripcion += next.text().trim() + '\n';
                        next = next.next();
                    }
                    if (!descripcion) {
                        descripcion = $(el).parent().parent().text().trim();
                    }
                }
            });
            
            if (!descripcion) descripcion = $('.tep_content').text().trim().substring(0, 500);
            
            let externalUrl = '';
            $('a').each((i, el) => {
                if ($(el).text().toUpperCase().includes('VISITAR SITIO') || $(el).text().toUpperCase().includes('INSCRÍBETE') || $(el).text().toUpperCase().includes('MÁS INFORMACIÓN')) {
                    externalUrl = $(el).attr('href');
                }
            });
            if(!externalUrl) externalUrl = ev.link;
            
            detailedEvents.push({
                ...ev,
                ciudad,
                hora,
                distancias,
                descripcion: descripcion.substring(0, 300) + '...',
                externalUrl
            });
        } catch(e) {
            console.error(`Error fetching ${ev.title}:`, e.message);
        }
    }
    
    fs.writeFileSync('C:\\Users\\Alejandro\\.gemini\\antigravity\\brain\\f4b71ede-2bd1-4acb-a517-942c8340910b\\scratch\\events_details.json', JSON.stringify(detailedEvents, null, 2));
    console.log("Done.");
}

main();

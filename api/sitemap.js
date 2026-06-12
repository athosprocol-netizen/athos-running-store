// api/sitemap.js — Vercel Serverless Function
// Genera un sitemap.xml dinámico con todos los eventos y productos de Supabase.
// Se ejecuta en el servidor cada vez que Google (u otro crawler) lo solicita.

// Anon key is safe to use here — it's already public in the frontend bundle
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://beiatvntfbmdafhjpwyn.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_clvqs8U2OcFaRI7CyB47MQ_cesMJXRf';
const SITE_URL = 'https://www.athosrun.co';

// Páginas estáticas del sitio
const STATIC_PAGES = [
  { loc: '/',                 changefreq: 'daily',   priority: '1.0' },
  { loc: '/tienda',           changefreq: 'daily',   priority: '0.9' },
  { loc: '/eventos',          changefreq: 'daily',   priority: '0.9' },
  { loc: '/marcas',           changefreq: 'monthly', priority: '0.7' },
  { loc: '/zona-running',     changefreq: 'weekly',  priority: '0.7' },
  { loc: '/patrocinar-evento',changefreq: 'monthly', priority: '0.6' },
  { loc: '/soporte',          changefreq: 'monthly', priority: '0.5' },
  { loc: '/guia-de-tallas',   changefreq: 'monthly', priority: '0.5' },
];

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function fetchFromSupabase(table, select = 'slug,title,date,status,updated_at') {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&limit=1000`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function escapeXml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIso(dateStr) {
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export default async function handler(req, res) {
  const today = toIso(new Date());

  // Fetch events and products in parallel
  const [events, products] = await Promise.all([
    fetchFromSupabase('events', 'slug,title,date,status,updated_at'),
    fetchFromSupabase('products', 'slug,name,created_at'),
  ]);

  // Build URL entries
  const staticEntries = STATIC_PAGES.map(p => `
  <url>
    <loc>${SITE_URL}${escapeXml(p.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  const eventEntries = events.map(e => {
    const slug = e.slug || slugify(e.title || '');
    if (!slug) return '';
    const lastmod = e.updated_at ? toIso(e.updated_at) : (e.date ? toIso(e.date) : today);
    // Past events change less frequently
    const changefreq = e.status === 'past' ? 'monthly' : 'weekly';
    const priority = e.status === 'past' ? '0.6' : '0.8';
    return `
  <url>
    <loc>${SITE_URL}/eventos/${escapeXml(slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('');

  const productEntries = products.map(p => {
    const slug = p.slug || slugify(p.name || '');
    if (!slug) return '';
    const lastmod = p.created_at ? toIso(p.created_at) : today;
    return `
  <url>
    <loc>${SITE_URL}/tienda/producto/${escapeXml(slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${eventEntries}
${productEntries}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400'); // Cache 1h en CDN
  res.status(200).send(xml);
}

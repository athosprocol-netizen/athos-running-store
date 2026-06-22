/**
 * middleware.js — Vercel Edge Middleware
 *
 * "Dynamic Rendering": sirve HTML pre-renderizado con Schema.org completo
 * a los crawlers de Google/Bing/redes sociales. Los usuarios normales
 * siguen recibiendo la SPA React sin cambios.
 *
 * Docs: https://vercel.com/docs/functions/edge-middleware
 */

import { next } from '@vercel/edge';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://beiatvntfbmdafhjpwyn.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_clvqs8U2OcFaRI7CyB47MQ_cesMJXRf';
const SITE_URL = 'https://www.athosrun.co';

// Bots that we want to serve pre-rendered HTML to
const BOT_REGEX = /googlebot|google-structured-data-testing-tool|bingbot|yandexbot|duckduckbot|slurp|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|applebot|semrushbot|ahrefsbot/i;

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch { return dateStr; }
}

// ── Shared fetch helper ──────────────────────────────────────────────────────
async function fetchSupabase(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) return [];
  return res.json();
}

// ── Home page pre-render ──────────────────────────────────────────────────────
function generateHomeHTML({ upcomingEvents = [], featuredProducts = [] } = {}) {
  const pageTitle = 'ATHOS Running Store – Tienda de Running en Colombia';
  const desc = 'ATHOS Running Store: La Pasión por Correr. Tienda deportiva especializada en productos de running y plataforma para conectar con todos los eventos de running en Colombia.';
  const img = `${SITE_URL}/screen.png`;

  const orgSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SportingGoodsStore',
    name: 'ATHOS Running Store',
    url: SITE_URL,
    description: desc,
    image: img,
    address: { '@type': 'PostalAddress', addressCountry: 'CO' },
    sameAs: ['https://www.instagram.com/athosrun_co', 'https://twitter.com/athosrun_co'],
  });

  const eventListSchema = upcomingEvents.length > 0 ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Próximos eventos de running en Colombia',
    url: `${SITE_URL}/eventos`,
    numberOfItems: upcomingEvents.length,
    itemListElement: upcomingEvents.slice(0, 10).map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: e.title,
      url: `${SITE_URL}/eventos/${e.slug || ''}`,
    })),
  }) : null;

  const eventsHtml = upcomingEvents.slice(0, 6).map(e =>
    `<li><a href="${SITE_URL}/eventos/${escapeHtml(e.slug || '')}">${escapeHtml(e.title)} – ${formatDate(e.date)}</a></li>`
  ).join('');

  const productsHtml = featuredProducts.slice(0, 6).map(p =>
    `<li><a href="${SITE_URL}/tienda/producto/${escapeHtml(p.slug || '')}">${escapeHtml(p.name)}</a></li>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <link rel="canonical" href="${SITE_URL}/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:image" content="${img}" />
  <meta property="og:url" content="${SITE_URL}/" />
  <meta property="og:site_name" content="ATHOS Running Store" />
  <meta property="og:locale" content="es_CO" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@athosrun_co" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image" content="${img}" />
  <script type="application/ld+json">${orgSchema}</script>
  ${eventListSchema ? `<script type="application/ld+json">${eventListSchema}</script>` : ''}
</head>
<body>
  <main style="font-family:sans-serif;max-width:900px;margin:40px auto;padding:0 20px">
    <h1 style="font-size:2.2rem;margin-bottom:8px">ATHOS Running Store</h1>
    <p style="color:#FF4D00;font-weight:bold">La Pasión por Correr – Tienda de Running en Colombia</p>
    <p style="line-height:1.7;color:#333;margin-bottom:32px">${escapeHtml(desc)}</p>
    ${eventsHtml ? `<section><h2 style="font-size:1.3rem;margin-bottom:12px">Próximos Eventos de Running</h2><ul style="line-height:2">${eventsHtml}</ul><p><a href="${SITE_URL}/eventos">Ver todos los eventos →</a></p></section>` : ''}
    ${productsHtml ? `<section style="margin-top:32px"><h2 style="font-size:1.3rem;margin-bottom:12px">Tienda ATHOS</h2><ul style="line-height:2">${productsHtml}</ul><p><a href="${SITE_URL}/tienda">Ver toda la tienda →</a></p></section>` : ''}
  </main>
  <script>window.location.replace("${SITE_URL}/");</script>
</body>
</html>`;
}

// ── Events listing pre-render ─────────────────────────────────────────────────
function generateEventsListHTML(events = []) {
  const pageUrl = `${SITE_URL}/eventos`;
  const pageTitle = 'Eventos de Running en Colombia 2025 | ATHOS Running Store';
  const desc = 'Encuentra todos los eventos, carreras y maratones de running en Colombia. Inscríbete en los mejores eventos de running con ATHOS Running Store.';
  const img = `${SITE_URL}/screen.png`;

  const upcomingEvents = events.filter(e => e.status !== 'past');
  const pastEvents = events.filter(e => e.status === 'past');

  const eventListSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    url: pageUrl,
    numberOfItems: upcomingEvents.length,
    itemListElement: upcomingEvents.slice(0, 20).map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/eventos/${e.slug || ''}`,
      name: e.title,
    })),
  });

  const renderList = (arr, label) => arr.length === 0 ? '' : `
    <section style="margin-bottom:32px">
      <h2 style="font-size:1.3rem;border-bottom:2px solid #FF4D00;padding-bottom:6px;margin-bottom:16px">${label}</h2>
      <ul style="list-style:none;padding:0;display:grid;gap:12px">
        ${arr.slice(0, 20).map(e => `
          <li style="border:1px solid #eee;border-radius:8px;padding:14px 18px">
            <a href="${SITE_URL}/eventos/${escapeHtml(e.slug || '')}" style="font-weight:600;color:#111;text-decoration:none">${escapeHtml(e.title)}</a>
            <span style="display:block;color:#FF4D00;font-size:0.88rem;margin-top:4px">📅 ${formatDate(e.date)}${e.city ? ` &nbsp;|&nbsp; 📍 ${escapeHtml(e.city)}` : ''}</span>
          </li>`).join('')}
      </ul>
    </section>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <link rel="canonical" href="${pageUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:image" content="${img}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:site_name" content="ATHOS Running Store" />
  <meta property="og:locale" content="es_CO" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@athosrun_co" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image" content="${img}" />
  <script type="application/ld+json">${eventListSchema}</script>
</head>
<body>
  <main style="font-family:sans-serif;max-width:900px;margin:40px auto;padding:0 20px">
    <nav style="margin-bottom:16px;font-size:13px;color:#666">
      <a href="${SITE_URL}">ATHOS Running</a> &rsaquo; <span>Eventos</span>
    </nav>
    <h1 style="font-size:2rem;margin-bottom:8px">Eventos de Running en Colombia</h1>
    <p style="color:#555;margin-bottom:32px">${escapeHtml(desc)}</p>
    ${renderList(upcomingEvents, '📅 Próximos Eventos')}
    ${renderList(pastEvents, '🏁 Eventos Pasados')}
  </main>
  <script>window.location.replace("${pageUrl}");</script>
</body>
</html>`;
}

// ── Shop listing pre-render ───────────────────────────────────────────────────
function generateShopHTML(products = []) {
  const pageUrl = `${SITE_URL}/tienda`;
  const pageTitle = 'Tienda de Running – Ropa y Calzado Técnico | ATHOS Running Store';
  const desc = 'Compra ropa técnica, calzado y accesorios de running en ATHOS Running Store. Productos especializados para corredores en Colombia.';
  const img = `${SITE_URL}/screen.png`;

  const productListSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    url: pageUrl,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/tienda/producto/${p.slug || ''}`,
      name: p.name,
    })),
  });

  const productsHtml = products.slice(0, 24).map(p => `
    <li style="border:1px solid #eee;border-radius:8px;padding:14px 18px">
      <a href="${SITE_URL}/tienda/producto/${escapeHtml(p.slug || '')}" style="font-weight:600;color:#111;text-decoration:none">${escapeHtml(p.name)}</a>
      ${p.price ? `<span style="display:block;color:#FF4D00;font-size:0.88rem;margin-top:4px">$${Number(p.price).toLocaleString('es-CO')} COP</span>` : ''}
    </li>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <link rel="canonical" href="${pageUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:image" content="${img}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:site_name" content="ATHOS Running Store" />
  <meta property="og:locale" content="es_CO" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@athosrun_co" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image" content="${img}" />
  <script type="application/ld+json">${productListSchema}</script>
</head>
<body>
  <main style="font-family:sans-serif;max-width:900px;margin:40px auto;padding:0 20px">
    <nav style="margin-bottom:16px;font-size:13px;color:#666">
      <a href="${SITE_URL}">ATHOS Running</a> &rsaquo; <span>Tienda</span>
    </nav>
    <h1 style="font-size:2rem;margin-bottom:8px">Tienda ATHOS Running</h1>
    <p style="color:#555;margin-bottom:32px">${escapeHtml(desc)}</p>
    ${products.length > 0 ? `<ul style="list-style:none;padding:0;display:grid;gap:12px">${productsHtml}</ul>` : ''}
  </main>
  <script>window.location.replace("${pageUrl}");</script>
</body>
</html>`;
}

function generateEventHTML(event) {
  const slug = event.slug || '';
  const pageUrl = `${SITE_URL}/eventos/${slug}`;
  const dateStr = formatDate(event.date);
  const desc = (event.description || '').replace(/\n/g, ' ').slice(0, 160);
  const img = event.image || `${SITE_URL}/screen.png`;
  const distances = (event.distances || []).join(' - ');
  const title = escapeHtml(event.title);
  const city = escapeHtml(event.city || '');
  const location = escapeHtml(event.location || event.city || '');
  const descEsc = escapeHtml(desc);
  const pageTitle = `${title} – ${dateStr} | ATHOS Running Store`;

  const eventSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: event.title,
    description: (event.description || '').replace(/\n/g, ' '),
    startDate: event.date,
    image: img,
    url: pageUrl,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: location || city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city,
        addressRegion: event.location || '',
        addressCountry: 'CO',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'ATHOS Running Store',
      url: SITE_URL,
    },
    offers: event.price > 0 ? {
      '@type': 'Offer',
      price: event.price,
      priceCurrency: 'COP',
      url: pageUrl,
      availability: 'https://schema.org/InStock',
    } : undefined,
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="${descEsc}" />
  <link rel="canonical" href="${pageUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="event" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${descEsc}" />
  <meta property="og:image" content="${escapeHtml(img)}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:site_name" content="ATHOS Running Store" />
  <meta property="og:locale" content="es_CO" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@athosrun_co" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${descEsc}" />
  <meta name="twitter:image" content="${escapeHtml(img)}" />

  <!-- Schema.org JSON-LD (key for Google Events) -->
  <script type="application/ld+json">${eventSchema}</script>

  <!-- Redirect humans to the full SPA after a very short delay -->
  <noscript><meta http-equiv="refresh" content="0;url=${pageUrl}" /></noscript>
</head>
<body>
  <!-- Pre-rendered content for crawlers -->
  <main style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px">
    <nav style="margin-bottom:16px;font-size:13px;color:#666">
      <a href="${SITE_URL}">ATHOS Running</a> &rsaquo;
      <a href="${SITE_URL}/eventos">Eventos</a> &rsaquo;
      <span>${title}</span>
    </nav>
    ${img ? `<img src="${escapeHtml(img)}" alt="${title}" style="width:100%;max-height:400px;object-fit:cover;border-radius:12px;margin-bottom:24px" />` : ''}
    <h1 style="font-size:2rem;margin-bottom:8px">${title}</h1>
    <p style="color:#FF4D00;font-weight:bold;margin-bottom:16px">
      📅 ${dateStr} &nbsp;|&nbsp; 📍 ${city}${location !== city ? ` — ${location}` : ''}
      ${distances ? `&nbsp;|&nbsp; 🏃 ${distances}` : ''}
    </p>
    <p style="line-height:1.7;color:#333">${escapeHtml(event.description || '')}</p>
    ${event.externalUrl ? `<a href="${escapeHtml(event.externalUrl)}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#FF4D00;color:white;border-radius:8px;font-weight:bold;text-decoration:none">Inscríbete ahora</a>` : ''}
    <p style="margin-top:32px;font-size:13px;color:#999">
      Más eventos de running en Colombia: <a href="${SITE_URL}/eventos">${SITE_URL}/eventos</a>
    </p>
  </main>

  <!-- Load the full SPA for human users who have JS enabled -->
  <script>
    // If real user (not a bot that blocked JS), redirect to SPA immediately
    window.location.replace("${pageUrl}");
  </script>
</body>
</html>`;
}

function generateProductHTML(product) {
  const slug = product.slug || product.id || '';
  const pageUrl = `${SITE_URL}/tienda/producto/${slug}`;
  const desc = (product.description || '').replace(/\n/g, ' ').slice(0, 160);
  const img = product.image || `${SITE_URL}/screen.png`;
  const title = escapeHtml(product.name);
  const descEsc = escapeHtml(desc);
  const pageTitle = `${title} | ATHOS Running Store`;

  const productSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    image: img,
    url: pageUrl,
    brand: { '@type': 'Brand', name: 'ATHOS Running' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'COP',
      price: product.price,
      availability: (product.stock ?? 1) > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'ATHOS Running Store', url: SITE_URL },
    },
    aggregateRating: product.rating && product.reviews_count ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews_count,
    } : undefined,
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="${descEsc}" />
  <link rel="canonical" href="${pageUrl}" />
  <meta property="og:type" content="product" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${descEsc}" />
  <meta property="og:image" content="${escapeHtml(img)}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${descEsc}" />
  <meta name="twitter:image" content="${escapeHtml(img)}" />
  <script type="application/ld+json">${productSchema}</script>
</head>
<body>
  <main style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px">
    <nav style="margin-bottom:16px;font-size:13px;color:#666">
      <a href="${SITE_URL}">ATHOS Running</a> &rsaquo;
      <a href="${SITE_URL}/tienda">Tienda</a> &rsaquo;
      <span>${title}</span>
    </nav>
    ${img ? `<img src="${escapeHtml(img)}" alt="${title}" style="width:100%;max-height:400px;object-fit:cover;border-radius:12px;margin-bottom:24px" />` : ''}
    <h1 style="font-size:2rem;margin-bottom:8px">${title}</h1>
    <p style="color:#FF4D00;font-size:1.5rem;font-weight:bold">$${(product.price || 0).toLocaleString('es-CO')} COP</p>
    <p style="line-height:1.7;color:#333">${escapeHtml(product.description || '')}</p>
    <a href="${pageUrl}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#111;color:white;border-radius:8px;font-weight:bold;text-decoration:none">Ver en tienda</a>
  </main>
  <script>window.location.replace("${pageUrl}");</script>
</body>
</html>`;
}

function botResponse(html) {
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      'X-Rendered-By': 'athos-edge-middleware',
    },
  });
}

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  const { pathname } = new URL(request.url);

  // Only apply dynamic rendering to bots
  if (!BOT_REGEX.test(ua)) return next();

  try {
    // ── Home page: / ──────────────────────────────────────────────────────
    if (pathname === '/' || pathname === '') {
      const [events, products] = await Promise.all([
        fetchSupabase('events?select=slug,title,date,city,status&order=date.asc&limit=12'),
        fetchSupabase('products?select=slug,name,price&limit=12'),
      ]);
      const upcomingEvents = (events || []).filter(e => e.status !== 'past');
      return botResponse(generateHomeHTML({ upcomingEvents, featuredProducts: products || [] }));
    }

    // ── Events listing: /eventos ──────────────────────────────────────────
    if (pathname === '/eventos') {
      const events = await fetchSupabase('events?select=slug,title,date,city,status&order=date.asc&limit=100');
      return botResponse(generateEventsListHTML(events || []));
    }

    // ── Event detail: /eventos/[slug] ──────────────────────────────────────
    if (pathname.startsWith('/eventos/')) {
      const parts = pathname.split('/').filter(Boolean);
      const slug = parts[1];
      if (slug && slug !== 'registro' && slug !== 'resultados') {
        const data = await fetchSupabase(`events?slug=eq.${encodeURIComponent(slug)}&limit=1`);
        const event = data?.[0];
        if (event) return botResponse(generateEventHTML(event));
      }
    }

    // ── Shop listing: /tienda ─────────────────────────────────────────────
    if (pathname === '/tienda') {
      const products = await fetchSupabase('products?select=slug,name,price&limit=100');
      return botResponse(generateShopHTML(products || []));
    }

    // ── Product detail: /tienda/producto/[slug] ────────────────────────────
    if (pathname.startsWith('/tienda/producto/')) {
      const parts = pathname.split('/').filter(Boolean);
      const slug = parts[2];
      if (slug) {
        const data = await fetchSupabase(`products?slug=eq.${encodeURIComponent(slug)}&limit=1`);
        const product = data?.[0];
        if (product) return botResponse(generateProductHTML(product));
      }
    }
  } catch (err) {
    // On error, fall through to normal SPA
    console.error('[middleware] Error:', err);
  }

  return next();
}

export const config = {
  // Run on all key SEO pages
  matcher: ['/', '/eventos', '/eventos/:slug*', '/tienda', '/tienda/producto/:slug*'],
};

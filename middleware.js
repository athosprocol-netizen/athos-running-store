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

const SUPABASE_URL = 'https://beiatvntfbmdafhjpwyn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_clvqs8U2OcFaRI7CyB47MQ_cesMJXRf';
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

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  const { pathname } = new URL(request.url);

  // Only apply dynamic rendering to bots
  if (!BOT_REGEX.test(ua)) return next();

  try {
    // ── Event pages: /eventos/[slug] ──────────────────────────────────────
    if (pathname.startsWith('/eventos/')) {
      const parts = pathname.split('/').filter(Boolean);
      const slug = parts[1]; // ['eventos', 'slug']
      if (slug && slug !== 'registro' && slug !== 'resultados') {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/events?slug=eq.${encodeURIComponent(slug)}&limit=1`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        if (res.ok) {
          const [event] = await res.json();
          if (event) {
            return new Response(generateEventHTML(event), {
              status: 200,
              headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
                'X-Rendered-By': 'athos-edge-middleware',
              },
            });
          }
        }
      }
    }

    // ── Product pages: /tienda/producto/[slug] ────────────────────────────
    if (pathname.startsWith('/tienda/producto/')) {
      const parts = pathname.split('/').filter(Boolean);
      const slug = parts[2]; // ['tienda', 'producto', 'slug']
      if (slug) {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&limit=1`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        if (res.ok) {
          const [product] = await res.json();
          if (product) {
            return new Response(generateProductHTML(product), {
              status: 200,
              headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
                'X-Rendered-By': 'athos-edge-middleware',
              },
            });
          }
        }
      }
    }
  } catch (err) {
    // On error, fall through to normal SPA
    console.error('[middleware] Error:', err);
  }

  return next();
}

export const config = {
  // Only run on event and product paths to avoid unnecessary overhead
  matcher: ['/eventos/:slug*', '/tienda/producto/:slug*'],
};

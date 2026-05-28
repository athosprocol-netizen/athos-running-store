/**
 * Script: Insertar Eventos de Junio 2026
 * Uso: node scripts/insertar_eventos_junio_2026.mjs
 *
 * Requisito: Tener el archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
 * El script pedirá tu contraseña de admin para autenticarse.
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL  = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL   = 'kaieke37@gmail.com'; // email admin del proyecto

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ No se encontraron las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─────────────────────────────────────────────────────────────
// FUNCIÓN: generar slug
// ─────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '').replace(/-+$/, '');
}

// ─────────────────────────────────────────────────────────────
// EVENTOS — JUNIO 2026
// Imágenes: Unsplash (libres de derechos)
// ─────────────────────────────────────────────────────────────
const eventos = [

  // ── 1. MARATÓN DULIMA ───────────────────────────────────────
  {
    title: 'Maratón Dulima 2026',
    date: '2026-06-07T05:00:00Z',
    location: 'Centro Comercial Acqua Power Center',
    city: 'Ibagué',
    description: 'La tercera edición de la Maratón Dulima llega a Ibagué con cuatro distancias para todos los niveles. El evento inicia desde las 5:00 a.m. en el Centro Comercial Acqua Power Center, recorriendo las vías más emblemáticas de la capital del Tolima.\n\nComo antesala, los días 5 y 6 de junio se realiza la Expo Ibagué Running & Sport Fitness en el mismo lugar. La inscripción incluye cronometraje oficial, hidratación en ruta, medalla finisher y camiseta técnica.',
    distances: ['42K', '21K', '10K', '5K'],
    image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    status: 'upcoming',
    is_featured: false,
    max_participants: 5000,
    current_participants: 1800,
    price: 169000,
    gradient_colors: ['#D97706', '#B45309'],
    external_url: 'https://welcu.com',
    type: 'road',
    difficulty: 'Variado',
  },

  // ── 2. FILANDIA TRAIL RACE ──────────────────────────────────
  {
    title: 'Filandia Trail Race 2026',
    date: '2026-06-07T05:30:00Z',
    location: 'Filandia, Quindío — Eje Cafetero',
    city: 'Filandia',
    description: 'Vive una de las carreras de trail más hermosas del Eje Cafetero. La Filandia Trail Race 2026 te lleva por senderos rodeados de cafetales y paisajes del Paisaje Cultural Cafetero, Patrimonio de la Humanidad.\n\nUn evento para corredores de todos los niveles que quieran disfrutar la naturaleza del Quindío en su máximo esplendor. El recorrido combina subidas técnicas, miradores naturales y la magia del municipio más pintoresco de Colombia.',
    distances: ['5K', '10K', '21K'],
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486218119243-13883505764c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    status: 'upcoming',
    is_featured: false,
    max_participants: 800,
    current_participants: 320,
    price: 130000,
    gradient_colors: ['#16A34A', '#166534'],
    external_url: 'https://www.eventrid.com.co',
    type: 'trail',
    difficulty: 'Moderado',
  },

  // ── 3. MEDIA MARATÓN DE CÓRDOBA ─────────────────────────────
  {
    title: 'Media Maratón de Córdoba 2026',
    date: '2026-06-07T05:00:00Z',
    location: 'Centro Histórico — Avenida Primera, Río Sinú',
    city: 'Montería',
    description: 'La Media Maratón de Córdoba recorre los puntos más emblemáticos de Montería: el centro histórico, la Avenida Circunvalar, la Glorieta de Mocarí y la Avenida Primera con el río Sinú como telón de fondo.\n\nEntrega de kits los días 5 y 6 de junio en el Pueblito Cordobés (Dg. 17 #6-17). Un evento que reúne a los corredores del Caribe colombiano en una celebración del deporte y la ciudad.',
    distances: ['21K', '10K', '5K'],
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    status: 'upcoming',
    is_featured: false,
    max_participants: 3000,
    current_participants: 950,
    price: 160000,
    gradient_colors: ['#0284C7', '#0369A1'],
    external_url: 'https://mmcordoba.co',
    type: 'road',
    difficulty: 'Moderado',
  },

  // ── 4. TATACOA STAR TRAIL ────────────────────────────────────
  {
    title: 'Tatacoa Star Trail 2026',
    date: '2026-06-14T04:00:00Z',
    location: 'Parque Principal de Villavieja',
    city: 'Villavieja',
    description: 'Corre bajo el cielo estrellado del desierto más espectacular de Colombia. El Tatacoa Star Trail 2026 se lleva a cabo en Villavieja, Huila, con salida desde el parque principal del municipio.\n\nEl evento incluye kit de corredor con camiseta, medalla, hidratación en ruta, tula y número con chip. Una experiencia única en uno de los paisajes más inhóspitos y bellos de Latinoamérica, donde el desierto ocre y el cielo estrellado se convierten en el escenario perfecto para un desafío de trail running.',
    distances: ['2K', '6K', '12K', '21K'],
    image: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1520962922320-2038eebab146?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    status: 'upcoming',
    is_featured: false,
    max_participants: 600,
    current_participants: 210,
    price: 120000,
    gradient_colors: ['#C2410C', '#9A3412'],
    external_url: 'https://tatacoastarlight.com',
    type: 'trail',
    difficulty: 'Difícil',
  },

  // ── 5. TOTA LAKE TRAIL RUNNING ───────────────────────────────
  {
    title: 'Tota Lake Trail Running 5.0',
    date: '2026-06-14T05:00:00Z',
    location: 'Lago de Tota — Municipio de Cuítiva',
    city: 'Cuítiva',
    description: 'La quinta edición del Tota Lake Trail Running te lleva por uno de los entornos más impresionantes de Boyacá: el Lago de Tota, el lago más grande de Colombia.\n\nEl recorrido incluye el Valle del río Tota, miradores del lago, senderos de Caracoles, la reserva Pueblito Antiguo y el ascenso por la vereda Balcones. Cuatro distancias para todos los niveles, desde los 8K hasta el ultra de 45K. Una experiencia de trail donde la naturaleza boyacense te desafía en cada kilómetro.',
    distances: ['8K', '13K', '23K', '45K'],
    image: 'https://images.unsplash.com/photo-1439853949212-36089f7b8c06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    status: 'upcoming',
    is_featured: false,
    max_participants: 500,
    current_participants: 180,
    price: 117000,
    gradient_colors: ['#0891B2', '#0E7490'],
    external_url: 'https://respira.run',
    type: 'trail',
    difficulty: 'Difícil',
  },

  // ── 6. FREEDOM RACE BACKYARD ULTRA ──────────────────────────
  {
    title: 'Freedom Race Backyard Ultra 2026',
    date: '2026-06-27T07:00:00Z',
    location: 'Bogotá (confirmar sede en freedomrace.com.co)',
    city: 'Bogotá',
    description: 'El formato más desafiante del running llega a Bogotá. En el Backyard Ultra los participantes deben completar un circuito de 6.7 kilómetros cada hora, en punto, al ritmo de una señal.\n\nLa carrera no termina hasta que solo queda un corredor en pie. Sin distancia fija, sin tiempo límite — solo voluntad. ¿Cuántas vueltas puedes dar? Un evento diseñado para los corredores que quieren empujar los límites del cuerpo y la mente más allá de lo convencional.',
    distances: ['6.7K por hora — formato Backyard Ultra'],
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    status: 'upcoming',
    is_featured: false,
    max_participants: 200,
    current_participants: 60,
    price: 150000,
    gradient_colors: ['#1E1B4B', '#312E81'],
    external_url: 'https://freedomrace.com.co',
    type: 'ultra',
    difficulty: 'Extremo',
  },

  // ── 7. MEDIA MARATÓN DE CALI ⭐ DESTACADO ────────────────────
  {
    title: '26ª Media Maratón de Cali',
    date: '2026-06-28T05:30:00Z',
    location: 'Estadio Olímpico Pascual Guerrero',
    city: 'Cali',
    description: 'La edición 26 de la Media Maratón de Cali consolida a esta carrera como uno de los eventos más importantes del suroccidente colombiano. Con salida y meta en el Estadio Olímpico Pascual Guerrero, el recorrido atraviesa las avenidas más representativas de la Sucursal del Cielo.\n\nTres distancias para corredores de todos los niveles: 21K (salida 5:30 a.m.), 10K (salida 7:10 a.m.) y 5K (salida 8:10 a.m.). La inscripción incluye camiseta técnica, medalla finisher, hidratación en ruta y cronometraje oficial. En su 26ª edición, la Media Maratón de Cali reúne a miles de corredores en una ciudad que vive el deporte con pasión.',
    distances: ['21K', '10K', '5K'],
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    status: 'upcoming',
    is_featured: true,   // ⭐ Evento destacado
    max_participants: 12000,
    current_participants: 7500,
    price: 210000,
    gradient_colors: ['#DC2626', '#991B1B'],
    external_url: 'https://mediamaratoncali.com',
    type: 'road',
    difficulty: 'Moderado',
  },

];

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
async function main() {
  const rl = readline.createInterface({ input, output });

  console.log('\n🏃 INSERTAR EVENTOS JUNIO 2026 — Athos Running Store');
  console.log('═══════════════════════════════════════════════════');
  console.log(`📧 Admin: ${ADMIN_EMAIL}`);

  const password = await rl.question('🔑 Contraseña de admin: ');
  rl.close();

  console.log('\n🔐 Autenticando...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password,
  });

  if (authError) {
    console.error(`❌ Error de autenticación: ${authError.message}`);
    process.exit(1);
  }

  console.log(`✅ Autenticado como ${authData.user.email}\n`);
  console.log(`📋 Insertando ${eventos.length} eventos...\n`);

  let exitosos = 0;
  let fallidos = 0;

  for (const evento of eventos) {
    const slug = slugify(evento.title);
    const payload = { ...evento, slug };

    process.stdout.write(`   ⏳ ${evento.title}... `);

    const { error } = await supabase.from('events').insert(payload);

    if (error) {
      console.log(`❌ Error: ${error.message}`);
      fallidos++;
    } else {
      console.log('✅ OK');
      exitosos++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log(`✅ Exitosos: ${exitosos}  ❌ Fallidos: ${fallidos}`);
  console.log('🚀 ¡Listo! Recarga la app para ver los eventos.\n');

  await supabase.auth.signOut();
}

main().catch(err => {
  console.error('Error inesperado:', err);
  process.exit(1);
});

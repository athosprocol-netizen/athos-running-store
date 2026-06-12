/**
 * scripts/optimize-images.js
 * Comprime las imágenes críticas de /public a WebP y tamaños optimizados.
 * Ejecutar con: node scripts/optimize-images.cjs
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const tasks = [
  // favicon: debe ser PNG exactamente 64x64 para compatibilidad
  {
    input: 'favicon.png',
    output: 'favicon.png',
    width: 64,
    height: 64,
    format: 'png',
    quality: 90,
    label: 'Favicon (64x64 PNG)'
  },
  // logo: transparencia necesaria → PNG optimizado + WebP
  {
    input: 'logo.png',
    output: 'logo.webp',
    width: 400,
    height: null, // mantener proporción
    format: 'webp',
    quality: 85,
    label: 'Logo (WebP)'
  },
  {
    input: 'logo.png',
    output: 'logo.png',
    width: 400,
    height: null,
    format: 'png',
    quality: 90,
    label: 'Logo (PNG fallback)'
  },
  // imagen hero difuminada
  {
    input: 'imagen_bordes_difuminados.png',
    output: 'imagen_bordes_difuminados.webp',
    width: 900,
    height: null,
    format: 'webp',
    quality: 80,
    label: 'Hero imagen (WebP)'
  },
  {
    input: 'imagen_bordes_difuminados.png',
    output: 'imagen_bordes_difuminados.png',
    width: 900,
    height: null,
    format: 'png',
    quality: 80,
    label: 'Hero imagen (PNG fallback)'
  },
  // screen preview (OG image)
  {
    input: 'screen.png',
    output: 'screen.webp',
    width: 1200,
    height: null,
    format: 'webp',
    quality: 85,
    label: 'Screen OG preview (WebP)'
  },
  {
    input: 'screen.png',
    output: 'screen.png',
    width: 1200,
    height: null,
    format: 'png',
    quality: 85,
    label: 'Screen OG preview (PNG)'
  },
  // medallero
  {
    input: 'medallero.png',
    output: 'medallero.webp',
    width: 800,
    height: null,
    format: 'webp',
    quality: 82,
    label: 'Medallero (WebP)'
  },
  {
    input: 'medallero.png',
    output: 'medallero.png',
    width: 800,
    height: null,
    format: 'png',
    quality: 82,
    label: 'Medallero (PNG fallback)'
  },
  // medallero1 (grande)
  {
    input: 'medallero1.png',
    output: 'medallero1.webp',
    width: 800,
    height: null,
    format: 'webp',
    quality: 82,
    label: 'Medallero1 (WebP)'
  },
  {
    input: 'medallero1.png',
    output: 'medallero1.png',
    width: 800,
    height: null,
    format: 'png',
    quality: 82,
    label: 'Medallero1 (PNG fallback)'
  },
  // medalleroverde
  {
    input: 'medalleroverde.png',
    output: 'medalleroverde.webp',
    width: 800,
    height: null,
    format: 'webp',
    quality: 82,
    label: 'Medalleroverde (WebP)'
  },
  {
    input: 'medalleroverde.png',
    output: 'medalleroverde.png',
    width: 800,
    height: null,
    format: 'png',
    quality: 82,
    label: 'Medalleroverde (PNG fallback)'
  },
  // pexels running photo
  {
    input: 'pexels-runffwpu-10417360.jpg',
    output: 'pexels-runffwpu-10417360.webp',
    width: 1200,
    height: null,
    format: 'webp',
    quality: 82,
    label: 'Pexels hero (WebP)'
  },
  {
    input: 'pexels-runffwpu-10417360.jpg',
    output: 'pexels-runffwpu-10417360.jpg',
    width: 1200,
    height: null,
    format: 'jpeg',
    quality: 82,
    label: 'Pexels hero (JPEG fallback)'
  },
];

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

async function optimize() {
  console.log('\n🔧 Optimizando imágenes en /public...\n');
  let totalSaved = 0;

  for (const task of tasks) {
    const inputPath = path.join(PUBLIC_DIR, task.input);
    const outputPath = path.join(PUBLIC_DIR, task.output);
    const isSameFile = path.resolve(inputPath) === path.resolve(outputPath);
    const tempPath = outputPath + '.tmp_opt';

    if (!fs.existsSync(inputPath)) {
      console.log(`  ⚠️  Saltando ${task.input} (no encontrado)`);
      continue;
    }

    const originalSize = fs.statSync(inputPath).size;

    try {
      let pipeline = sharp(inputPath);

      if (task.width) {
        pipeline = pipeline.resize({
          width: task.width,
          height: task.height || undefined,
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      if (task.format === 'webp') {
        pipeline = pipeline.webp({ quality: task.quality });
      } else if (task.format === 'png') {
        pipeline = pipeline.png({ quality: task.quality, compressionLevel: 9 });
      } else if (task.format === 'jpeg') {
        pipeline = pipeline.jpeg({ quality: task.quality, mozjpeg: true });
      }

      // Write to temp path to avoid same-file conflict, then rename
      const writePath = isSameFile ? tempPath : outputPath;
      await pipeline.toFile(writePath);
      if (isSameFile) {
        fs.renameSync(writePath, outputPath);
      }

      const newSize = fs.statSync(outputPath).size;
      const saved = originalSize - newSize;
      if (saved > 0) totalSaved += saved;

      const arrow = saved > 0 ? '↓' : '↑';
      const pct = Math.abs(Math.round((saved / originalSize) * 100));
      console.log(`  ✅ ${task.label}`);
      console.log(`     ${formatBytes(originalSize)} ${arrow} ${formatBytes(newSize)} (${arrow}${pct}%)\n`);

    } catch (err) {
      console.log(`  ❌ Error en ${task.input}: ${err.message}\n`);
      // Clean up temp file if it exists
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }

  console.log(`\n✨ Ahorro total estimado: ${formatBytes(totalSaved)}\n`);
}

optimize();


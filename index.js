const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const fs = require('fs');
const path = require('path');

// Configurazione
const FILE_SERVER = process.env.FILE_SERVER || 'http://localhost:8080';
const TEST_DIR = path.join(__dirname, 'test');

// Funzione per generare ID univoco dal nome file
function generateId(filename) {
  return 'hevc_' + filename.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

// Funzione per leggere i file dalla cartella test/
function getVideoFiles() {
  if (!fs.existsSync(TEST_DIR)) {
    console.log('⚠️  Cartella test/ non trovata');
    return [];
  }

  const files = fs.readdirSync(TEST_DIR);
  const videoExtensions = ['.mkv', '.mp4', '.mov', '.avi', '.webm'];
  
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return videoExtensions.includes(ext);
  });
}

// Genera catalogo dinamico dai file
function generateCatalog() {
  const videoFiles = getVideoFiles();
  
  return videoFiles.map(filename => {
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    const stat = fs.statSync(path.join(TEST_DIR, filename));
    const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
    
    return {
      id: generateId(filename),
      type: 'movie',
      name: nameWithoutExt.replace(/_/g, ' '),
      description: `File HEVC locale - ${sizeMB} MB - Test TV Hisense`,
      releaseInfo: new Date().getFullYear().toString(),
      genres: ['Test HEVC', 'Locale']
    };
  });
}

// Genera streams dinamici dai file
function generateStreams() {
  const videoFiles = getVideoFiles();
  const streams = {};
  
  videoFiles.forEach(filename => {
    const id = generateId(filename);
    streams[id] = `${FILE_SERVER}/${encodeURIComponent(filename)}`;
  });
  
  return streams;
}

// Manifest
const manifest = {
  id: 'community.hevctest.hisense.local',
  version: '2.0.0',
  name: 'HEVC Test Local',
  description: 'Addon dinamico per test HEVC - Legge file dalla cartella test/',
  logo: 'https://via.placeholder.com/256x256/10B981/FFFFFF?text=HEVC+LOCAL',
  background: 'https://via.placeholder.com/1920x1080/10B981/FFFFFF?text=HEVC+Local+Files',
  resources: ['catalog', 'meta', 'stream'],
  types: ['movie'],
  catalogs: [
    {
      type: 'movie',
      id: 'hevc_local_catalog',
      name: 'HEVC Local Files'
    }
  ]
};

const builder = new addonBuilder(manifest);

// Catalog handler - DINAMICO
builder.defineCatalogHandler(({ type, id }) => {
  console.log('📚 Catalog request:', type, id);
  
  if (type === 'movie' && id === 'hevc_local_catalog') {
    const catalog = generateCatalog();
    console.log(`✅ Returning ${catalog.length} files from test/ folder`);
    return Promise.resolve({ metas: catalog });
  }
  
  console.log('❌ Catalog not found');
  return Promise.resolve({ metas: [] });
});

// Meta handler - DINAMICO
builder.defineMetaHandler(({ type, id }) => {
  console.log('📋 Meta request:', type, id);
  
  if (type === 'movie') {
    const catalog = generateCatalog();
    const meta = catalog.find(m => m.id === id);
    if (meta) {
      console.log(`✅ Found meta for ${id}`);
      return Promise.resolve({ meta });
    }
  }
  
  console.log(`❌ Meta not found for ${id}`);
  return Promise.resolve({ meta: null });
});

// Stream handler - DINAMICO
builder.defineStreamHandler(({ type, id }) => {
  console.log('🎬 Stream request:', type, id);
  
  if (type === 'movie') {
    const streams = generateStreams();
    const url = streams[id];
    
    if (url) {
      console.log(`✅ Found stream for ${id}: ${url}`);
      return Promise.resolve({
        streams: [
          {
            name: 'HEVC Local',
            title: 'Local File',
            url: url,
            behaviorHints: {
              notWebReady: true,
              bingeGroup: 'hevc-local'
            }
          }
        ]
      });
    }
  }
  
  console.log(`❌ Stream not found for ${id}`);
  return Promise.resolve({ streams: [] });
});

// Start server
const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: PORT });

// Log startup info
const videoFiles = getVideoFiles();
console.log(`\n✅ HEVC Local Addon running at http://127.0.0.1:${PORT}/manifest.json`);
console.log(`\n📁 Cartella test: ${TEST_DIR}`);
console.log(`📹 File trovati: ${videoFiles.length}\n`);

if (videoFiles.length === 0) {
  console.log('⚠️  NESSUN FILE VIDEO TROVATO!');
  console.log('   Aggiungi file .mkv, .mp4, .mov nella cartella test/\n');
} else {
  console.log('🎬 File disponibili:');
  videoFiles.forEach(file => {
    const stat = fs.statSync(path.join(TEST_DIR, file));
    const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
    console.log(`   ✓ ${file} (${sizeMB} MB)`);
  });
  console.log();
}

console.log('💡 COME USARE:');
console.log('   1. AVVIA FILE SERVER: node file-server.js');
console.log('   2. INSTALLA ADDON: http://127.0.0.1:${PORT}/manifest.json');
console.log('   3. Vai su Board → "HEVC Local Files"\n');

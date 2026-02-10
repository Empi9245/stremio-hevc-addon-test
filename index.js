const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

// Metadata dei film di test - USA ID IMDB REALI
const CATALOG = [
  {
    id: 'tt0057569',
    type: 'movie',
    name: 'The Strangler',
    description: 'File HEVC locale - Test TV Hisense',
    releaseInfo: '1964',
    genres: ['Thriller', 'Test HEVC Locale']
  },
  {
    id: 'tt0032599',
    type: 'movie',
    name: 'His Girl Friday',
    description: 'File HEVC locale - Test TV Hisense',
    releaseInfo: '1940',
    genres: ['Comedy', 'Test HEVC Locale']
  },
  {
    id: 'tt5363918',
    type: 'movie',
    name: 'A Beautiful Planet',
    description: 'NASA 4K UHD locale - Test HEVC TV Hisense',
    releaseInfo: '2016',
    genres: ['Documentary', 'Test HEVC 4K Locale']
  },
  {
    id: 'tt2285752',
    type: 'movie',
    name: 'Tears of Steel',
    description: 'File 4K HEVC locale - Test TV Hisense',
    releaseInfo: '2012',
    genres: ['Short', 'Test HEVC 4K Locale']
  },
  {
    id: 'tt4677012',
    type: 'movie',
    name: 'Journey to Space',
    description: 'NASA ISS 4K UHD locale - Test HEVC TV Hisense',
    releaseInfo: '2015',
    genres: ['Documentary', 'Test HEVC 4K Locale']
  }
];

// Stream URLs - FILE LOCALI dalla cartella test/
// IMPORTANTE: Avvia file-server.js prima di usare l'addon!
// Comando: node file-server.js
const FILE_SERVER = process.env.FILE_SERVER || 'http://localhost:8080';

const STREAMS = {
  'tt0057569': `${FILE_SERVER}/The_Strangler_1963.mkv`,
  'tt0032599': `${FILE_SERVER}/EBAF90DC-2309-4AC6-B2B9-200A09C3BF43.hevc.mp4`,
  'tt5363918': `${FILE_SERVER}/Zero-G-Hail-Mary-Pass_UHD_CLEAN-FOR-NEWS_HIGH-RES.mov`,
  'tt2285752': `${FILE_SERVER}/tearsofsteel_4k.mov`,
  'tt4677012': `${FILE_SERVER}/Zero-G-Hail-Mary-Pass_UHD_CLEAN-FOR-NEWS_HIGH-RES.mov`
};

// Manifest
const manifest = {
  id: 'community.hevctest.hisense',
  version: '1.1.0',
  name: 'HEVC Test Hisense (Local)',
  description: 'Addon di test per riproduzione HEVC su TV Hisense - File locali veloci',
  logo: 'https://via.placeholder.com/256x256/8B5CF6/FFFFFF?text=HEVC+LOCAL',
  background: 'https://via.placeholder.com/1920x1080/8B5CF6/FFFFFF?text=HEVC+Test+Local',
  resources: ['catalog', 'meta', 'stream'],
  types: ['movie'],
  catalogs: [
    {
      type: 'movie',
      id: 'hevc_test_catalog',
      name: 'HEVC Test Movies (Local)'
    }
  ]
};

const builder = new addonBuilder(manifest);

// Catalog handler
builder.defineCatalogHandler(({ type, id }) => {
  console.log('📚 Catalog request:', type, id);
  
  if (type === 'movie' && id === 'hevc_test_catalog') {
    console.log(`✅ Returning ${CATALOG.length} movies`);
    return Promise.resolve({ metas: CATALOG });
  }
  
  console.log('❌ Catalog not found');
  return Promise.resolve({ metas: [] });
});

// Meta handler
builder.defineMetaHandler(({ type, id }) => {
  console.log('📋 Meta request:', type, id);
  
  if (type === 'movie') {
    const meta = CATALOG.find(m => m.id === id);
    if (meta) {
      console.log(`✅ Found meta for ${id}`);
      return Promise.resolve({ meta });
    }
  }
  
  console.log(`❌ Meta not found for ${id}`);
  return Promise.resolve({ meta: null });
});

// Stream handler
builder.defineStreamHandler(({ type, id }) => {
  console.log('🎬 Stream request:', type, id);
  
  if (type === 'movie') {
    const url = STREAMS[id];
    if (url) {
      console.log(`✅ Found stream for ${id}: ${url}`);
      return Promise.resolve({
        streams: [
          {
            name: 'HEVC Test',
            title: 'Test Stream',
            url: url,
            behaviorHints: {
              notWebReady: true,
              bingeGroup: 'hevc-test-hisense',
              countryWhitelist: ['IT', 'US', 'GB', 'DE', 'FR', 'ES']
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

console.log(`\n✅ Addon running at http://127.0.0.1:${PORT}/manifest.json`);
console.log(`\n📋 Test URLs:`);
console.log(`   Manifest: http://127.0.0.1:${PORT}/manifest.json`);
console.log(`   Catalog:  http://127.0.0.1:${PORT}/catalog/movie/hevc_test_catalog.json`);
console.log(`   Meta:     http://127.0.0.1:${PORT}/meta/movie/tt0057569.json`);
console.log(`   Stream:   http://127.0.0.1:${PORT}/stream/movie/tt0057569.json`);
console.log(`\n🎬 Film disponibili (FILE LOCALI):`);
console.log(`   - The Strangler (1964) - test/The_Strangler_1963.mkv`);
console.log(`   - His Girl Friday (1940) - test/EBAF90DC-2309-4AC6-B2B9-200A09C3BF43.hevc.mp4`);
console.log(`   - A Beautiful Planet (2016) - test/Zero-G-Hail-Mary-Pass_UHD_CLEAN-FOR-NEWS_HIGH-RES.mov`);
console.log(`   - Tears of Steel (2012) - test/tearsofsteel_4k.mov`);
console.log(`   - Journey to Space (2015) - test/Zero-G-Hail-Mary-Pass_UHD_CLEAN-FOR-NEWS_HIGH-RES.mov`);
console.log(`\n💡 IMPORTANTE:`);
console.log(`   1. AVVIA IL FILE SERVER: node file-server.js`);
console.log(`   2. DISINSTALLA l'addon vecchio da Stremio`);
console.log(`   3. REINSTALLA usando: http://127.0.0.1:${PORT}/manifest.json`);
console.log(`   4. Vai su Board → Cerca "HEVC Test Movies"`);
console.log(`   5. I file sono serviti dalla cartella test/ (VELOCE!)\n`);

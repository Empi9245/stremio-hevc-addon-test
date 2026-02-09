const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

// Metadata dei film di test - USA ID IMDB REALI
const CATALOG = [
  {
    id: 'tt0057569',
    type: 'movie',
    name: 'The Strangler',
    description: 'Film di test HEVC per TV Hisense',
    releaseInfo: '1964',
    genres: ['Thriller', 'Test HEVC']
  },
  {
    id: 'tt0032599',
    type: 'movie',
    name: 'His Girl Friday',
    description: 'Film di test HEVC per TV Hisense',
    releaseInfo: '1940',
    genres: ['Comedy', 'Test HEVC']
  },
  {
    id: 'tt5363918',
    type: 'movie',
    name: 'A Beautiful Planet',
    description: 'NASA 4K Ultra HD - Test HEVC per TV Hisense',
    releaseInfo: '2016',
    genres: ['Documentary', 'Test HEVC 4K']
  },
  {
    id: 'tt2285752',
    type: 'movie',
    name: 'Tears of Steel',
    description: 'Blender 4K HEVC Test - 24fps 9500kbps',
    releaseInfo: '2012',
    genres: ['Short', 'Test HEVC 4K']
  }
];

// Stream URLs - USA STESSI ID IMDB
const STREAMS = {
  'tt0057569': 'https://archive.org/download/The_Strangler_1963/The_Strangler_1963.mkv',
  'tt0032599': 'https://archive.org/download/His_Girl_Friday_1940/His_Girl_Friday_1940_512kb.mp4',
  'tt5363918': 'https://archive.org/download/NASA-Ultra-High-Definition/Zero-G-Hail-Mary-Pass_UHD_CLEAN-FOR-NEWS_HIGH-RES.mov',
  'tt2285752': 'http://trailers.divx.com/hevc/TearsOfSteel_4K_24fps_9500kbps_2aud_9subs.mkv'
};

// Manifest
const manifest = {
  id: 'community.hevctest.hisense',
  version: '1.0.0',
  name: 'HEVC Test Hisense',
  description: 'Addon di test per riproduzione HEVC su TV Hisense',
  resources: ['catalog', 'meta', 'stream'],
  types: ['movie'],
  catalogs: [
    {
      type: 'movie',
      id: 'hevc_test_catalog',
      name: 'HEVC Test Movies'
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
            url: url
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
console.log(`\n🎬 Film disponibili:`);
console.log(`   - The Strangler (1964) - ID: tt0057569`);
console.log(`   - His Girl Friday (1940) - ID: tt0032599`);
console.log(`   - A Beautiful Planet (2016) - NASA 4K - ID: tt5363918`);
console.log(`   - Tears of Steel (2012) - Blender 4K HEVC - ID: tt2285752`);
console.log(`\n💡 IMPORTANTE:`);
console.log(`   1. DISINSTALLA l'addon vecchio da Stremio`);
console.log(`   2. REINSTALLA usando: http://127.0.0.1:${PORT}/manifest.json`);
console.log(`   3. Vai su Board → Cerca "HEVC Test Movies"`);
console.log(`   4. Oppure cerca "The Strangler" nella ricerca\n`);

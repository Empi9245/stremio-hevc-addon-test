const { addonBuilder } = require('stremio-addon-sdk');

// Configurazione URL HEVC - Film di test con ID IMDB reali
// The Strangler (1964) - IMDB: tt0057569
// His Girl Friday (1940) - IMDB: tt0032599
const HEVC_TEST_URLS = {
  'tt0057569': 'https://archive.org/download/The_Strangler_1963/The_Strangler_1963.mkv',
  'tt0032599': 'https://archive.org/download/His_Girl_Friday_1940/His_Girl_Friday_1940_512kb.mp4'
};

// Definizione del manifest
const manifest = {
  id: 'test-hevc-hisense',
  version: '1.0.3',
  name: 'Test HEVC Hisense',
  description: 'Addon di test per riproduzione file HEVC (H.265) lunghi su TV Hisense / Vidaa / Home OS tramite Stremio.',
  resources: ['catalog', 'stream'],
  types: ['movie'],
  catalogs: [
    {
      type: 'movie',
      id: 'hevc-test-catalog',
      name: 'HEVC Test Movies'
    }
  ]
};

// Creazione dell'addon builder
const builder = new addonBuilder(manifest);

// Handler per il catalogo
builder.defineCatalogHandler((args) => {
  console.log('📚 Catalog request:', JSON.stringify(args));
  
  const { type, id } = args;
  
  if (type !== 'movie' || id !== 'hevc-test-catalog') {
    console.log('❌ Catalog not matching');
    return Promise.resolve({ metas: [] });
  }

  // Usa ID IMDB reali - Stremio prenderà automaticamente poster e info da TMDB
  const metas = [
    {
      id: 'tt0057569',
      type: 'movie',
      name: 'The Strangler',
      releaseInfo: '1964'
    },
    {
      id: 'tt0032599',
      type: 'movie',
      name: 'His Girl Friday',
      releaseInfo: '1940'
    }
  ];

  console.log(`✅ Returning ${metas.length} movies in catalog`);
  return Promise.resolve({ metas });
});

// Handler per gli stream
builder.defineStreamHandler((args) => {
  console.log('🎬 Stream request received:', JSON.stringify(args));
  
  const { type, id } = args;
  
  console.log(`Type: ${type}, ID: ${id}`);
  console.log('Available IDs:', Object.keys(HEVC_TEST_URLS));
  
  if (type !== 'movie') {
    console.log('❌ Type not movie, returning empty streams');
    return Promise.resolve({ streams: [] });
  }

  const url = HEVC_TEST_URLS[id];

  if (url) {
    console.log(`✅ Found stream for ${id}: ${url}`);
    const streams = [
      {
        name: 'Test HEVC Hisense',
        title: 'HEVC Test Stream',
        url,
        behaviorHints: {
          notWebReady: true,
          bingeGroup: 'test-hevc-hisense'
        }
      }
    ];
    return Promise.resolve({ streams });
  }

  console.log(`❌ No stream found for ID: ${id}`);
  console.log('This ID does not match any configured test URLs');
  return Promise.resolve({ streams: [] });
});

// Avvio del server
const PORT = process.env.PORT || 7000;

const { serveHTTP } = require('stremio-addon-sdk');
serveHTTP(builder.getInterface(), { port: PORT });

console.log(`✅ Addon disponibile su: http://localhost:${PORT}/manifest.json`);
console.log(`📺 Catalogo: http://localhost:${PORT}/catalog/movie/hevc-test-catalog.json`);
console.log(`🎬 Manifest ID: ${manifest.id}`);
console.log(`\n📝 Film disponibili:`);
console.log(`   - The Strangler (1964) - IMDB: tt0057569`);
console.log(`   - His Girl Friday (1940) - IMDB: tt0032599`);
console.log(`\n💡 Come usare:`);
console.log(`   1. Installa l'addon su Stremio`);
console.log(`   2. Vai su Board → Vedrai "HEVC Test Movies" con i 2 film`);
console.log(`   3. Oppure cerca i film nella ricerca di Stremio`);
console.log(`   4. Clicca Watch → Vedrai lo stream "Test HEVC Hisense"`);

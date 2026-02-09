const { addonBuilder } = require('stremio-addon-sdk');

// Configurazione URL HEVC - Modificare questi valori per cambiare i file di test
const HEVC_TEST_URLS = {
  'test-hevc-strangler': 'https://archive.org/download/The_Strangler_1963/The_Strangler_1963.mkv',
  'test-hevc-man-of-conflict': 'https://archive.org/download/Man_of_Conflict_1953/Man_of_Conflict_1953_512kb.mp4'
};

// Definizione del manifest
const manifest = {
  id: 'test-hevc-hisense',
  version: '1.0.1',
  name: 'Test HEVC Hisense',
  description: 'Addon di test per riproduzione file HEVC (H.265) lunghi su TV Hisense / Vidaa / Home OS tramite Stremio.',
  resources: ['catalog', 'meta', 'stream'],
  types: ['movie'],
  catalogs: [
    {
      type: 'movie',
      id: 'test-hevc-catalog',
      name: 'Test HEVC Movies',
      extra: [
        {
          name: 'skip',
          isRequired: false
        }
      ]
    }
  ],
  idPrefixes: ['test-hevc-']
};

// Creazione dell'addon builder
const builder = new addonBuilder(manifest);

// Handler per il catalogo
builder.defineCatalogHandler((args) => {
  console.log('Catalog request:', JSON.stringify(args));
  
  const { type, id } = args;
  
  if (type !== 'movie') {
    console.log('Type not movie, returning empty');
    return Promise.resolve({ metas: [] });
  }
  
  if (id !== 'test-hevc-catalog') {
    console.log('Catalog ID not matching, returning empty');
    return Promise.resolve({ metas: [] });
  }

  const metas = [
    {
      id: 'test-hevc-strangler',
      type: 'movie',
      name: 'Test HEVC – The Strangler (1963)',
      poster: 'https://via.placeholder.com/300x450/0080FF/FFFFFF?text=HEVC+Test+1',
      posterShape: 'poster',
      background: 'https://via.placeholder.com/1280x720/0080FF/FFFFFF?text=HEVC+Test+1',
      description: 'File di test HEVC per validazione riproduzione su TV Hisense - The Strangler (1963)',
      releaseInfo: '1963',
      genres: ['Test', 'HEVC']
    },
    {
      id: 'test-hevc-man-of-conflict',
      type: 'movie',
      name: 'Test HEVC – Man of Conflict (1953)',
      poster: 'https://via.placeholder.com/300x450/FF8000/FFFFFF?text=HEVC+Test+2',
      posterShape: 'poster',
      background: 'https://via.placeholder.com/1280x720/FF8000/FFFFFF?text=HEVC+Test+2',
      description: 'File di test HEVC per validazione riproduzione su TV Hisense - Man of Conflict (1953)',
      releaseInfo: '1953',
      genres: ['Test', 'HEVC']
    }
  ];

  console.log(`Returning ${metas.length} metas`);
  return Promise.resolve({ metas });
});

// Handler per i meta (dettagli film)
builder.defineMetaHandler((args) => {
  console.log('📋 Meta request received:', JSON.stringify(args));
  
  const { type, id } = args;
  
  if (type !== 'movie') {
    console.log('❌ Type not movie');
    return Promise.resolve({ meta: null });
  }
  
  const metaData = {
    'test-hevc-strangler': {
      id: 'test-hevc-strangler',
      type: 'movie',
      name: 'Test HEVC – The Strangler (1963)',
      poster: 'https://via.placeholder.com/300x450/0080FF/FFFFFF?text=HEVC+Test+1',
      posterShape: 'poster',
      background: 'https://via.placeholder.com/1280x720/0080FF/FFFFFF?text=HEVC+Test+1',
      description: 'File di test HEVC per validazione riproduzione su TV Hisense - The Strangler (1963)',
      releaseInfo: '1963',
      genres: ['Test', 'HEVC'],
      runtime: '89 min'
    },
    'test-hevc-man-of-conflict': {
      id: 'test-hevc-man-of-conflict',
      type: 'movie',
      name: 'Test HEVC – Man of Conflict (1953)',
      poster: 'https://via.placeholder.com/300x450/FF8000/FFFFFF?text=HEVC+Test+2',
      posterShape: 'poster',
      background: 'https://via.placeholder.com/1280x720/FF8000/FFFFFF?text=HEVC+Test+2',
      description: 'File di test HEVC per validazione riproduzione su TV Hisense - Man of Conflict (1953)',
      releaseInfo: '1953',
      genres: ['Test', 'HEVC'],
      runtime: '72 min'
    }
  };
  
  const meta = metaData[id];
  
  if (meta) {
    console.log(`✅ Found meta for ${id}`);
    return Promise.resolve({ meta });
  }
  
  console.log(`❌ No meta found for ${id}`);
  return Promise.resolve({ meta: null });
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
        url,
        title: `HEVC Test – ${id}`,
        behaviorHints: {
          notWebReady: true
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
console.log(`📺 Catalogo: http://localhost:${PORT}/catalog/movie/test-hevc-catalog.json`);
console.log(`🎬 Manifest ID: ${manifest.id}`);

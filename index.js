const { addonBuilder } = require('stremio-addon-sdk');

// Configurazione URL HEVC - Modificare questi valori per cambiare i file di test
const HEVC_TEST_URLS = {
  'test-hevc-strangler': 'https://archive.org/download/The_Strangler_1963/The_Strangler_1963.mkv',
  'test-hevc-man-of-conflict': 'https://archive.org/download/Man_of_Conflict_1953/Man_of_Conflict_1953_512kb.mp4'
};

// Definizione del manifest
const manifest = {
  id: 'test-hevc-hisense',
  version: '1.0.0',
  name: 'Test HEVC Hisense',
  description: 'Addon di test per riproduzione file HEVC (H.265) lunghi su TV Hisense / Vidaa / Home OS tramite Stremio.',
  resources: ['catalog', 'stream'],
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
builder.defineCatalogHandler(({ type, id }) => {
  if (type !== 'movie' || id !== 'test-hevc-catalog') {
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

  return Promise.resolve({ metas });
});

// Handler per gli stream
builder.defineStreamHandler(({ type, id }) => {
  if (type !== 'movie') {
    return Promise.resolve({ streams: [] });
  }

  const url = HEVC_TEST_URLS[id];

  if (url) {
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

  return Promise.resolve({ streams: [] });
});

// Avvio del server
const PORT = process.env.PORT || 7000;

const { serveHTTP } = require('stremio-addon-sdk');
serveHTTP(builder.getInterface(), { port: PORT });

console.log(`Addon disponibile su: http://localhost:${PORT}/manifest.json`);

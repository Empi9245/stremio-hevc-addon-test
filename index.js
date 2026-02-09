const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

// Metadata dei film di test - USA ID IMDB REALI
const CATALOG = [
  {
    id: 'tt0057569',
    type: 'movie',
    name: 'The Strangler',
    poster: 'https://image.tmdb.org/t/p/w500/aQvJ5WPzZgYVDrxLX4R6cLJCEaQ.jpg',
    posterShape: 'poster',
    background: 'https://image.tmdb.org/t/p/original/aQvJ5WPzZgYVDrxLX4R6cLJCEaQ.jpg',
    description: 'Film di test HEVC per TV Hisense',
    releaseInfo: '1964',
    imdbRating: '6.7',
    genres: ['Thriller', 'Test HEVC']
  },
  {
    id: 'tt0032599',
    type: 'movie',
    name: 'His Girl Friday',
    poster: 'https://image.tmdb.org/t/p/w500/1jEqMdHKpGwujiTWVw6OwrZzzRi.jpg',
    posterShape: 'poster',
    background: 'https://image.tmdb.org/t/p/original/1jEqMdHKpGwujiTWVw6OwrZzzRi.jpg',
    description: 'Film di test HEVC per TV Hisense',
    releaseInfo: '1940',
    imdbRating: '7.9',
    genres: ['Comedy', 'Test HEVC']
  }
];

// Stream URLs - USA STESSI ID IMDB
const STREAMS = {
  'tt0057569': 'https://archive.org/download/The_Strangler_1963/The_Strangler_1963.mkv',
  'tt0032599': 'https://archive.org/download/His_Girl_Friday_1940/His_Girl_Friday_1940_512kb.mp4'
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
  console.log('Catalog request:', type, id);
  
  if (type === 'movie' && id === 'hevc_test_catalog') {
    return Promise.resolve({ metas: CATALOG });
  }
  
  return Promise.resolve({ metas: [] });
});

// Meta handler
builder.defineMetaHandler(({ type, id }) => {
  console.log('Meta request:', type, id);
  
  if (type === 'movie') {
    const meta = CATALOG.find(m => m.id === id);
    if (meta) {
      return Promise.resolve({ meta });
    }
  }
  
  return Promise.resolve({ meta: null });
});

// Stream handler
builder.defineStreamHandler(({ type, id }) => {
  console.log('Stream request:', type, id);
  
  if (type === 'movie') {
    const url = STREAMS[id];
    if (url) {
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
  
  return Promise.resolve({ streams: [] });
});

// Start server
const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: PORT });

console.log(`Addon running at http://127.0.0.1:${PORT}/manifest.json`);

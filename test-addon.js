// Script di test per verificare che l'addon funzioni correttamente
const http = require('http');

const ADDON_URL = 'http://localhost:7000';
const FILE_SERVER_URL = 'http://localhost:8080';

console.log('🧪 TEST ADDON STREMIO\n');

// Test 1: Manifest
console.log('1️⃣ Testing manifest...');
http.get(`${ADDON_URL}/manifest.json`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const manifest = JSON.parse(data);
      console.log('   ✅ Manifest OK');
      console.log(`   - Name: ${manifest.name}`);
      console.log(`   - ID: ${manifest.id}`);
      console.log(`   - Catalogs: ${manifest.catalogs.map(c => c.name).join(', ')}`);
      
      // Test 2: Catalog
      const catalogId = manifest.catalogs[0].id;
      console.log('\n2️⃣ Testing catalog...');
      http.get(`${ADDON_URL}/catalog/movie/${catalogId}.json`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const catalog = JSON.parse(data);
            console.log(`   ✅ Catalog OK - ${catalog.metas.length} items found`);
            catalog.metas.forEach(meta => {
              console.log(`   - ${meta.name} (ID: ${meta.id})`);
            });
            
            // Test 3: Stream
            if (catalog.metas.length > 0) {
              const firstMeta = catalog.metas[0];
              console.log('\n3️⃣ Testing stream...');
              http.get(`${ADDON_URL}/stream/movie/${firstMeta.id}.json`, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                  try {
                    const stream = JSON.parse(data);
                    console.log(`   ✅ Stream OK - ${stream.streams.length} streams found`);
                    stream.streams.forEach(s => {
                      console.log(`   - ${s.name}: ${s.url}`);
                    });
                    
                    // Test 4: File Server
                    if (stream.streams.length > 0) {
                      const streamUrl = stream.streams[0].url;
                      console.log('\n4️⃣ Testing file server...');
                      http.get(streamUrl, (res) => {
                        console.log(`   ✅ File server OK - Status: ${res.statusCode}`);
                        console.log(`   - Content-Type: ${res.headers['content-type']}`);
                        console.log(`   - Content-Length: ${res.headers['content-length']} bytes`);
                        console.log('\n✅ ALL TESTS PASSED!\n');
                        process.exit(0);
                      }).on('error', err => {
                        console.log(`   ❌ File server error: ${err.message}`);
                        process.exit(1);
                      });
                    }
                  } catch (e) {
                    console.log(`   ❌ Stream parse error: ${e.message}`);
                    process.exit(1);
                  }
                });
              }).on('error', err => {
                console.log(`   ❌ Stream request error: ${err.message}`);
                process.exit(1);
              });
            }
          } catch (e) {
            console.log(`   ❌ Catalog parse error: ${e.message}`);
            process.exit(1);
          }
        });
      }).on('error', err => {
        console.log(`   ❌ Catalog request error: ${err.message}`);
        process.exit(1);
      });
    } catch (e) {
      console.log(`   ❌ Manifest parse error: ${e.message}`);
      process.exit(1);
    }
  });
}).on('error', err => {
  console.log(`   ❌ Manifest request error: ${err.message}`);
  console.log('\n⚠️  Assicurati che l\'addon sia in esecuzione su porta 7000');
  process.exit(1);
});

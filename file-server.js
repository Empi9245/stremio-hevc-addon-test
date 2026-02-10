const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.FILE_PORT || 8080;
const TEST_DIR = path.join(__dirname, 'test');

const server = http.createServer((req, res) => {
  // CORS headers per permettere a Stremio di accedere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Decodifica URL e rimuovi query string
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.join(TEST_DIR, urlPath);

  console.log(`📁 Request: ${urlPath}`);

  // Verifica che il file sia nella directory test
  if (!filePath.startsWith(TEST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Verifica che il file esista
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  // Supporto per Range requests (importante per video streaming)
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': getContentType(filePath)
    });

    file.pipe(res);
    console.log(`✅ Streaming: ${path.basename(filePath)} (${start}-${end}/${fileSize})`);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': getContentType(filePath),
      'Accept-Ranges': 'bytes'
    });

    fs.createReadStream(filePath).pipe(res);
    console.log(`✅ Serving: ${path.basename(filePath)} (${fileSize} bytes)`);
  }
});

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.mkv': 'video/x-matroska',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.webm': 'video/webm'
  };
  return types[ext] || 'application/octet-stream';
}

server.listen(PORT, () => {
  console.log(`\n🎬 File Server running at http://localhost:${PORT}/`);
  console.log(`📁 Serving files from: ${TEST_DIR}\n`);
  console.log(`Available files:`);
  fs.readdirSync(TEST_DIR).forEach(file => {
    const filePath = path.join(TEST_DIR, file);
    const stat = fs.statSync(filePath);
    const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
    console.log(`   - ${file} (${sizeMB} MB)`);
    console.log(`     http://localhost:${PORT}/${encodeURIComponent(file)}`);
  });
  console.log();
});

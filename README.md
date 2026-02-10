# Test HEVC Hisense Addon per Stremio

Addon Stremio per testare la riproduzione di file HEVC (H.265) su TV Hisense.

## 🚀 Quick Start

### 1. Installa dipendenze
```bash
npm install
```

### 2. Avvia i server

**Opzione A - Due terminali separati (consigliato per debug):**
```bash
# Terminale 1 - File Server
npm run file-server

# Terminale 2 - Addon Stremio
npm start
```

**Opzione B - Un solo comando:**
```bash
npm run dev
```

### 3. Testa l'addon
```bash
npm test
```

Questo script verifica:
- ✅ Manifest accessibile
- ✅ Catalogo con i file dalla cartella test/
- ✅ Stream URLs corretti
- ✅ File server funzionante

### 4. Installa su Stremio

1. Apri Stremio
2. Clicca sull'icona puzzle (addon) in alto a destra
3. Nella barra in alto a sinistra, inserisci:
   ```
   http://127.0.0.1:7000/manifest.json
   ```
4. Premi Invio
5. Vai su **Board** → Cerca il catalogo **"HEVC Local Files"**
6. Clicca su un film per riprodurlo

## 📁 Struttura File

```
test/
├── The_Strangler_1963.mkv
├── EBAF90DC-2309-4AC6-B2B9-200A09C3BF43.hevc.mp4
├── tearsofsteel_4k.mov
└── Zero-G-Hail-Mary-Pass_UHD_CLEAN-FOR-NEWS_HIGH-RES.mov
```

L'addon legge **dinamicamente** tutti i file video dalla cartella `test/`.

## 🔧 Troubleshooting

### Il catalogo non appare su Stremio
1. Verifica che entrambi i server siano in esecuzione
2. Controlla i log per errori
3. Testa manualmente: `http://localhost:7000/catalog/movie/hevc_local_catalog.json`

### Gli stream non partono
1. Verifica che il file server sia in esecuzione su porta 8080
2. Testa manualmente: `http://localhost:8080/The_Strangler_1963.mkv`
3. Controlla i log del file server

### Test automatico fallisce
1. Assicurati che entrambi i server siano avviati
2. Verifica che le porte 7000 e 8080 siano libere
3. Controlla che ci siano file video nella cartella test/

## 🌐 Deploy su Render

Per il deploy remoto, modifica la variabile `FILE_SERVER` in `index.js` con l'URL pubblico del tuo file server.

## 📝 Note

- Supporta: `.mkv`, `.mp4`, `.mov`, `.avi`, `.webm`
- Il file server supporta Range requests per streaming efficiente
- CORS abilitato per compatibilità con Stremio

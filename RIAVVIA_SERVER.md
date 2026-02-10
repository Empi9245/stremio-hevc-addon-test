# ⚠️ IMPORTANTE: RIAVVIA I SERVER!

## 🔴 PROBLEMA IDENTIFICATO

Il catalogo NON contiene il campo `poster` perché il server è stato avviato **PRIMA** delle modifiche al codice!

## ✅ SOLUZIONE

### 1. Ferma i server

Nei terminali dove hai avviato i server, premi:
```
CTRL + C
```

### 2. Riavvia i server

**Terminale 1 - File Server:**
```bash
npm run file-server
```

**Terminale 2 - Addon:**
```bash
npm start
```

### 3. Verifica che il poster sia presente

```bash
npm test
```

Oppure apri nel browser:
```
http://localhost:7000/catalog/movie/hevc_local_catalog.json
```

Dovresti vedere il campo `"poster"` in ogni film!

### 4. Reinstalla l'addon su Stremio

1. Rimuovi l'addon da "My Addons"
2. Riavvia Stremio
3. Reinstalla: http://127.0.0.1:7000/manifest.json
4. Cerca "HEVC Local Files" nel menu cataloghi

## 🎯 Cosa Aspettarsi Dopo il Riavvio

Il catalogo dovrebbe contenere:

```json
{
  "metas": [
    {
      "id": "hevc_the_strangler_1963_mkv",
      "type": "movie",
      "name": "The Strangler 1963",
      "poster": "https://via.placeholder.com/300x450/10B981/FFFFFF?text=HEVC",
      "description": "File HEVC locale - 77.12 MB - Test TV Hisense",
      "releaseInfo": "2026",
      "genres": ["Test HEVC", "Locale"]
    }
  ]
}
```

Nota il campo **"poster"** che ora è presente!

## 💡 Tip

Ogni volta che modifichi il codice, devi riavviare i server per vedere le modifiche!

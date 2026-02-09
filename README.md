# Stremio HEVC Test Addon

Addon di test per riproduzione file HEVC (H.265) su TV Hisense tramite Stremio.

## Deploy su Render

Questo addon è configurato per il deploy automatico su Render.

### URL Addon
Una volta deployato, l'addon sarà disponibile su:
`https://[nome-app].onrender.com/manifest.json`

## Installazione Locale

```bash
npm install
npm start
```

L'addon sarà disponibile su `http://localhost:7000/manifest.json`

## Come Aggiungere l'Addon a Stremio

1. Apri Stremio
2. Vai su Addons
3. Clicca su "Community Addons"
4. Inserisci l'URL: `https://[nome-app].onrender.com/manifest.json`
5. Clicca su "Install"

# 🌐 Configurazione per Render

## ✅ Modifiche Applicate

Ho aggiunto un **catalogo statico** che viene usato quando non ci sono file locali (come su Render).

Il catalogo ora mostra sempre i tuoi 4 file:
1. The Strangler 1963
2. EBAF90DC-2309-4AC6-B2B9-200A09C3BF43.hevc
3. tearsofsteel 4k
4. Zero-G-Hail-Mary-Pass UHD CLEAN-FOR-NEWS HIGH-RES

## 🔧 Cosa Devi Fare

### Opzione 1: Hostare i File su un Servizio Pubblico

Devi caricare i 4 file video su un servizio che permetta il download diretto:

**Servizi consigliati:**
- **Archive.org** (gratuito, illimitato, supporta file grandi)
- **Dropbox** (con link diretto)
- **Google Drive** (con link diretto)
- **Cloudflare R2** (economico per file grandi)
- **Wasabi** (storage S3-compatibile)

### Opzione 2: Usare un File Server Separato

Puoi deployare anche il file-server su Render e caricare i file lì.

## 📝 Come Configurare gli URL

Una volta che hai gli URL pubblici dei file, modifica `index.js`:

```javascript
// Stream URLs statici per Render
const STATIC_STREAMS = {
  'hevc_the_strangler_1963_mkv': 'https://TUO_URL/The_Strangler_1963.mkv',
  'hevc_ebaf90dc_2309_4ac6_b2b9_200a09c3bf43_hevc_mp4': 'https://TUO_URL/EBAF90DC-2309-4AC6-B2B9-200A09C3BF43.hevc.mp4',
  'hevc_tearsofsteel_4k_mov': 'https://TUO_URL/tearsofsteel_4k.mov',
  'hevc_zero_g_hail_mary_pass_uhd_clean_for_news_high_res_mov': 'https://TUO_URL/Zero-G-Hail-Mary-Pass_UHD_CLEAN-FOR-NEWS_HIGH-RES.mov'
};
```

Sostituisci `https://TUO_URL/` con gli URL reali dei tuoi file.

## 🚀 Deploy su Render

1. Modifica gli URL in `index.js`
2. Commit e push:
   ```bash
   git add index.js
   git commit -m "Aggiunto catalogo statico per Render"
   git push origin main
   ```
3. Render farà automaticamente il redeploy
4. Installa l'addon su Stremio con l'URL di Render

## 🎯 Come Funziona

- **In locale**: L'addon legge i file dalla cartella `test/` e li serve tramite il file-server locale
- **Su Render**: L'addon usa il catalogo statico e gli URL pubblici che hai configurato

## 💡 Esempio con Archive.org

Se carichi i file su Archive.org, gli URL saranno tipo:

```
https://archive.org/download/nome-collezione/The_Strangler_1963.mkv
```

Basta sostituire questi URL in `STATIC_STREAMS`.

## ⚠️ Nota Importante

I file sono molto grandi (fino a 24 GB). Assicurati che:
- Il servizio di hosting supporti file così grandi
- Il servizio permetta il download diretto (non solo preview)
- Il servizio supporti Range requests per lo streaming

Archive.org è perfetto per questo!

## 🧪 Test

Dopo aver configurato gli URL e fatto il deploy:

1. Apri: `https://tuo-addon.onrender.com/manifest.json`
2. Verifica: `https://tuo-addon.onrender.com/catalog/movie/hevc_local_catalog.json`
3. Dovresti vedere i 4 film con i poster
4. Installa l'addon su Stremio
5. Il catalogo "HEVC Local Files" dovrebbe apparire nel menu cataloghi

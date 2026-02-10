# 📁 Cartella File Video

Questa cartella contiene i file video HEVC per il test.

## File Inclusi nel Repository

- ✅ `The_Strangler_1963.mkv` (77 MB)
- ✅ `EBAF90DC-2309-4AC6-B2B9-200A09C3BF43.hevc.mp4` (0.87 MB)

## File NON Inclusi (troppo grandi per GitHub)

- ❌ `tearsofsteel_4k.mov` (6.4 GB)
- ❌ `Zero-G-Hail-Mary-Pass_UHD_CLEAN-FOR-NEWS_HIGH-RES.mov` (24.6 GB)

## 🚀 Per Deploy su Render

I 2 file grandi devono essere caricati manualmente su Render o su un servizio esterno.

### Opzione 1: Render Disk Storage (a pagamento)

Aggiungi un disco persistente su Render e carica i file lì.

### Opzione 2: Servizio Esterno

Carica i 2 file grandi su:
- Archive.org (gratuito, illimitato)
- Cloudflare R2 (economico)
- Wasabi (S3-compatibile)

Poi modifica `FILE_SERVER` in `index.js` per puntare a quegli URL.

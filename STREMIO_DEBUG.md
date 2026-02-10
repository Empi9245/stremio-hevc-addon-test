# 🔍 Debug Addon Stremio - Catalogo Non Visibile

## ✅ Verifiche Completate

1. **Server addon in esecuzione**: ✅ Porta 7000
2. **Manifest accessibile**: ✅ http://localhost:7000/manifest.json
3. **Catalogo funzionante**: ✅ 4 file trovati
4. **Configurazione corretta**: ✅ Manifest valido

## 🎯 Come Trovare il Catalogo su Stremio

### IMPORTANTE: I cataloghi degli addon NON appaiono automaticamente nella Home!

Devi cercarli manualmente:

### Metodo 1: Menu Cataloghi (CONSIGLIATO)

1. Apri Stremio
2. Vai su **"Discover"** o **"Board"**
3. In alto vedrai il nome del catalogo corrente (es. "Trending", "Popular")
4. **Clicca sul nome del catalogo** → Si apre un menu a tendina
5. **Scorri verso il basso** fino a trovare **"HEVC Local Files"**
6. Clicca su "HEVC Local Files"
7. Dovresti vedere i tuoi 4 film!

### Metodo 2: Cerca un Film Specifico

1. Usa la barra di ricerca in alto
2. Cerca: "Strangler" o "Zero G Hail"
3. Se l'addon funziona, dovrebbe apparire nei risultati

### Metodo 3: Verifica Addon Installati

1. Clicca sull'icona **puzzle** (addon) in alto a destra
2. Vai su **"My Addons"**
3. Dovresti vedere **"HEVC Test Local"** nella lista
4. Se non c'è, reinstalla: http://127.0.0.1:7000/manifest.json

## 🧪 Test Rapido

Esegui questo test per verificare che tutto funzioni:

```bash
npm test
```

Se il test passa, l'addon funziona correttamente!

## 📋 Checklist Troubleshooting

- [ ] Entrambi i server sono in esecuzione (7000 e 8080)?
- [ ] L'addon appare in "My Addons"?
- [ ] Hai cercato nel menu a tendina dei cataloghi?
- [ ] Hai provato a cercare un film specifico?
- [ ] Hai riavviato Stremio dopo l'installazione?

## 🎬 Cosa Aspettarsi

Quando selezioni "HEVC Local Files" dal menu cataloghi, dovresti vedere:

```
📁 HEVC Local Files

┌─────────────────────┐
│  [HEVC]             │
│  The Strangler 1963 │
│  700 MB             │
└─────────────────────┘

┌─────────────────────┐
│  [HEVC]             │
│  EBAF90DC...        │
│  0.87 MB            │
└─────────────────────┘

┌─────────────────────┐
│  [HEVC]             │
│  tearsofsteel 4k    │
│  355 MB             │
└─────────────────────┘

┌─────────────────────┐
│  [HEVC]             │
│  Zero G Hail Mary   │
│  1.2 GB             │
└─────────────────────┘
```

## ❓ Ancora Non Funziona?

### Prova a reinstallare l'addon:

1. Rimuovi l'addon da "My Addons"
2. Riavvia Stremio
3. Reinstalla: http://127.0.0.1:7000/manifest.json
4. Riavvia Stremio di nuovo
5. Cerca "HEVC Local Files" nel menu cataloghi

### Verifica i log:

Guarda i terminali dove hai avviato i server. Quando navighi su Stremio dovresti vedere:

**Terminale addon (porta 7000):**
```
📚 Catalog request: movie hevc_local_catalog
✅ Returning 4 files from test/ folder
```

**Terminale file-server (porta 8080):**
```
📁 Request: /The_Strangler_1963.mkv
   Decoded path: The_Strangler_1963.mkv
   Full file path: C:\Users\empi0\Addon\test\The_Strangler_1963.mkv
✅ Streaming: The_Strangler_1963.mkv (0-1048575/734003200)
```

Se non vedi questi log, Stremio non sta chiamando l'addon!

## 💡 Suggerimento

Prova a cliccare direttamente su questo link mentre Stremio è aperto:

```
stremio://community.hevctest.hisense.local/catalog/movie/hevc_local_catalog
```

Questo dovrebbe aprire direttamente il catalogo in Stremio!

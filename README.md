# Stremio HEVC Test Addon

Addon di test per riproduzione file HEVC (H.265) su TV Hisense tramite Stremio.

## Caratteristiche

- ✅ Streaming di file HEVC locali (velocissimo!)
- ✅ Supporto per file 4K UHD
- ✅ Server HTTP con Range requests per streaming fluido
- ✅ Catalogo personalizzabile con ID IMDB reali
- ✅ Logo personalizzato durante il caricamento

## Installazione

```bash
npm install
```

## Utilizzo

### 1. Aggiungi i tuoi file HEVC

Metti i file video nella cartella `test/`:

```
test/
├── film1.mkv
├── film2.mp4
└── film3.mov
```

### 2. Avvia il file server

In un terminale:

```bash
node file-server.js
```

Il server servirà i file su `http://localhost:8080/`

### 3. Avvia l'addon Stremio

In un altro terminale:

```bash
npm start
```

L'addon sarà disponibile su `http://localhost:7000/manifest.json`

**Oppure avvia entrambi insieme:**

```bash
npm run dev
```

### 4. Aggiungi l'addon a Stremio

1. Apri Stremio
2. Vai su **Addons** → **Community Addons**
3. Inserisci: `http://localhost:7000/manifest.json`
4. Clicca **Install**
5. Vai su **Board** → Vedrai "HEVC Test Movies (Local)"

## Configurazione

### Modificare i file di test

Modifica il file `index.js` nella sezione `STREAMS`:

```javascript
const STREAMS = {
  'tt0057569': `${FILE_SERVER}/tuo-file.mkv`,
  // Aggiungi altri file...
};
```

E aggiungi i corrispondenti metadata in `CATALOG`.

### Cambiare porta

**File server:**
```bash
FILE_PORT=9000 node file-server.js
```

**Addon:**
```bash
PORT=8000 npm start
```

## Deploy su Render (per accesso remoto)

1. Crea un repository GitHub
2. Pusha il codice (i file video non saranno inclusi)
3. Vai su [Render](https://render.com)
4. Crea un nuovo Web Service
5. Connetti il repository
6. Render farà automaticamente il deploy

**Nota:** Per il deploy remoto, dovrai usare URL pubblici per i file video (es. Archive.org) invece dei file locali.

## Struttura del Progetto

```
stremio-hevc-addon/
├── index.js           # Addon Stremio principale
├── file-server.js     # Server HTTP per file locali
├── package.json       # Configurazione npm
├── render.yaml        # Configurazione Render
├── test/              # Cartella per file video HEVC
│   └── .gitkeep
└── README.md
```

## Troubleshooting

**Il catalogo è vuoto:**
- Disinstalla e reinstalla l'addon su Stremio
- Verifica che entrambi i server siano avviati

**Stream non si carica:**
- Verifica che il file-server sia in esecuzione
- Controlla che i file siano nella cartella `test/`
- Verifica i nomi dei file in `index.js`

**Lento su TV:**
- Assicurati che TV e PC siano sulla stessa rete WiFi
- Usa cavo ethernet per connessione più stabile

## License

MIT

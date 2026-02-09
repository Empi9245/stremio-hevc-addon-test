# Design Document - Test HEVC Hisense Addon

## Overview

Il Test HEVC Hisense Addon è un addon Stremio minimale progettato per testare la riproduzione di file video HEVC (H.265) su TV Hisense con sistema operativo Vidaa / Home OS. L'addon implementa il protocollo standard Stremio tramite un server HTTP Node.js che espone tre endpoint principali: manifest, catalog e stream. La soluzione è volutamente semplice e robusta, con stream hardcoded che puntano direttamente a file HEVC ospitati su Internet Archive o altri servizi HTTP, eliminando qualsiasi complessità di ricerca, metadata dinamici o multi-provider.

## Architecture

L'architettura segue il pattern standard degli addon Stremio:

```
┌─────────────────┐
│  Stremio App    │
│  (TV Hisense)   │
└────────┬────────┘
         │ HTTP GET
         ▼
┌─────────────────────────────────┐
│   Test Addon Server (Node.js)   │
│                                  │
│  ┌──────────────────────────┐  │
│  │  Manifest Handler        │  │
│  │  /manifest.json          │  │
│  └──────────────────────────┘  │
│                                  │
│  ┌──────────────────────────┐  │
│  │  Catalog Handler         │  │
│  │  /catalog/:type/:id.json │  │
│  └──────────────────────────┘  │
│                                  │
│  ┌──────────────────────────┐  │
│  │  Stream Handler          │  │
│  │  /stream/:type/:id.json  │  │
│  └──────────────────────────┘  │
│                                  │
│  ┌──────────────────────────┐  │
│  │  HEVC URL Constants      │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
         │
         │ Direct URL
         ▼
┌─────────────────┐
│ Internet Archive│
│ or HTTP Hosting │
│  (HEVC Files)   │
└─────────────────┘
```

### Flusso di Interazione

1. L'utente aggiunge l'addon in Stremio tramite URL del manifest
2. Stremio richiede GET /manifest.json per ottenere le capacità dell'addon
3. Stremio richiede GET /catalog/movie/test-hevc-catalog.json per ottenere la lista dei film
4. L'utente seleziona un film dal catalogo
5. Stremio richiede GET /stream/movie/:id.json per ottenere l'URL dello stream
6. Stremio riproduce direttamente il file HEVC dall'URL fornito

## Components and Interfaces

### 1. Server HTTP (index.js)

Il componente principale che gestisce tutte le richieste HTTP.

**Responsabilità:**
- Inizializzare il server HTTP sulla porta configurata
- Routing delle richieste agli handler appropriati
- Gestione degli errori HTTP
- Logging delle richieste

**Interfaccia:**
```javascript
// Avvio del server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Addon disponibile su: http://localhost:${PORT}/manifest.json`);
});
```

### 2. Manifest Handler

Gestisce le richieste per /manifest.json.

**Input:** GET /manifest.json

**Output:**
```json
{
  "id": "test-hevc-hisense",
  "version": "1.0.0",
  "name": "Test HEVC Hisense",
  "description": "Addon di test per riproduzione file HEVC (H.265) lunghi su TV Hisense / Vidaa / Home OS tramite Stremio.",
  "types": ["movie"],
  "catalogs": [
    {
      "type": "movie",
      "id": "test-hevc-catalog",
      "name": "Test HEVC Movies"
    }
  ],
  "resources": ["catalog", "stream"]
}
```

### 3. Catalog Handler

Gestisce le richieste per /catalog/:type/:id.json.

**Input:** GET /catalog/movie/test-hevc-catalog.json

**Output:**
```json
{
  "metas": [
    {
      "id": "test-hevc-strangler",
      "type": "movie",
      "name": "Test HEVC – Long Movie 1",
      "poster": "https://via.placeholder.com/300x450/0080FF/FFFFFF?text=HEVC+Test+1",
      "description": "File di test HEVC per validazione riproduzione su TV Hisense",
      "year": 2024
    },
    {
      "id": "test-hevc-man-of-conflict",
      "type": "movie",
      "name": "Test HEVC – Long Movie 2",
      "poster": "https://via.placeholder.com/300x450/FF8000/FFFFFF?text=HEVC+Test+2",
      "description": "File di test HEVC per validazione riproduzione su TV Hisense",
      "year": 2024
    }
  ]
}
```

### 4. Stream Handler

Gestisce le richieste per /stream/:type/:id.json.

**Input:** GET /stream/movie/test-hevc-strangler.json

**Output:**
```json
{
  "streams": [
    {
      "url": "https://archive.org/download/example/file.mkv",
      "title": "HEVC Test – Long Movie 1",
      "behaviorHints": {
        "notWebReady": true
      }
    }
  ]
}
```

### 5. HEVC URL Configuration

Costanti configurabili per gli URL dei file di test.

```javascript
// Configurazione URL HEVC - Modificare questi valori per cambiare i file di test
const HEVC_TEST_URLS = {
  'test-hevc-strangler': 'https://archive.org/download/example1/file1.mkv',
  'test-hevc-man-of-conflict': 'https://archive.org/download/example2/file2.mkv'
};
```

## Data Models

### Manifest Object

```javascript
{
  id: String,           // Identificatore univoco dell'addon
  version: String,      // Versione semver
  name: String,         // Nome visualizzato
  description: String,  // Descrizione dell'addon
  types: [String],      // Tipi di contenuto supportati
  catalogs: [Catalog],  // Cataloghi esposti
  resources: [String]   // Risorse disponibili
}
```

### Catalog Object

```javascript
{
  type: String,  // Tipo di contenuto (es. "movie")
  id: String,    // Identificatore del catalogo
  name: String   // Nome visualizzato del catalogo
}
```

### Meta Object (Film nel catalogo)

```javascript
{
  id: String,          // Identificatore univoco del film
  type: String,        // Tipo (es. "movie")
  name: String,        // Titolo del film
  poster: String,      // URL del poster (opzionale)
  description: String, // Descrizione (opzionale)
  year: Number         // Anno (opzionale)
}
```

### Stream Object

```javascript
{
  url: String,              // URL diretto al file video
  title: String,            // Titolo dello stream
  behaviorHints: {
    notWebReady: Boolean    // Indica che lo stream non è pronto per web player
  }
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

Dopo aver analizzato tutti i criteri di accettazione, ho identificato le seguenti proprietà testabili. Molti requisiti sono esempi specifici (test del manifest, configurazione package.json) o requisiti di implementazione non testabili automaticamente (organizzazione del codice, integrazione end-to-end con Stremio). Le proprietà universali identificate riguardano principalmente la struttura dei dati restituiti dagli endpoint.

### Properties

**Property 1: Tutti i film nel catalogo hanno campi obbligatori**

*Per qualsiasi* film restituito dall'endpoint catalog, il film deve contenere almeno i campi id, name e type.

**Validates: Requirements 2.3**

---

**Property 2: Tutti gli ID dei film iniziano con il prefisso corretto**

*Per qualsiasi* film restituito dall'endpoint catalog, l'ID del film deve iniziare con "test-hevc-".

**Validates: Requirements 2.4**

---

**Property 3: Tutti gli ID validi restituiscono stream**

*Per qualsiasi* ID valido di film, quando viene richiesto l'endpoint /stream/movie/:id.json, la risposta deve contenere un array streams con almeno uno stream.

**Validates: Requirements 3.1**

---

**Property 4: Tutti gli stream hanno un URL valido**

*Per qualsiasi* stream restituito dall'endpoint stream, lo stream deve contenere un campo url che inizia con "http://" o "https://".

**Validates: Requirements 3.2**

---

**Property 5: Tutti gli stream hanno un titolo**

*Per qualsiasi* stream restituito dall'endpoint stream, lo stream deve contenere un campo title non vuoto.

**Validates: Requirements 3.3**

---

**Property 6: Tutti gli stream hanno behaviorHints configurato correttamente**

*Per qualsiasi* stream restituito dall'endpoint stream, lo stream deve contenere behaviorHints.notWebReady impostato a true.

**Validates: Requirements 3.4**

---

**Property 7: Tutti gli endpoint rispondono correttamente**

*Per qualsiasi* endpoint valido tra /manifest.json, /catalog/movie/test-hevc-catalog.json e /stream/movie/:id.json (con ID valido), la richiesta HTTP GET deve restituire status code 200 e un JSON valido.

**Validates: Requirements 5.5**

## Error Handling

### Gestione Errori HTTP

**Approccio Stremio-friendly:**
- Per catalog non conosciuti: restituire `{ metas: [] }` con status 200
- Per stream con ID non conosciuto: restituire `{ streams: [] }` con status 200
- Stremio gestisce correttamente array vuoti, quindi non servono status 404

**Gestione CORS:**
- Non necessario: Stremio chiama l'addon lato backend/app, non tramite browser con restrizioni CORS

### Robustezza

**Timeout e connessioni:**
- Il server Node.js gestisce automaticamente timeout e chiusura connessioni
- Non sono necessarie configurazioni speciali per questo addon minimale

**Gestione richieste malformate:**
- Il server risponde con JSON valido per tutti gli endpoint supportati
- Endpoint non supportati possono restituire 404 o essere ignorati

## Testing Strategy

### Approccio di Testing

Per un addon di test interno, l'approccio è pragmatico e focalizzato sulla verifica manuale:

**Testing manuale (primario):**
1. Avviare il server localmente
2. Aggiungere l'addon in Stremio tramite URL del manifest
3. Verificare che il catalogo "Test HEVC Movies" appaia
4. Selezionare ciascun film e verificare la riproduzione sulla TV Hisense
5. Monitorare eventuali freeze, crash o problemi di riproduzione

**Unit testing (opzionale):**

Se si desidera automatizzare alcune verifiche di base:

1. **Test del Manifest**
   - Verifica che /manifest.json restituisca tutti i campi richiesti
   - Verifica che l'ID sia "test-hevc-hisense"
   - Verifica che types contenga "movie"
   - Verifica che resources contenga "catalog" e "stream"

2. **Test del Catalog**
   - Verifica che /catalog/movie/test-hevc-catalog.json restituisca un array metas
   - Verifica che ci siano almeno 2 film nel catalogo
   - Verifica che ogni film abbia id, name e type

3. **Test degli Stream**
   - Verifica che /stream/movie/test-hevc-strangler.json restituisca uno stream valido
   - Verifica che /stream/movie/test-hevc-man-of-conflict.json restituisca uno stream valido
   - Verifica che ogni stream abbia url, title e behaviorHints

### Metriche di Successo

- L'addon si carica correttamente in Stremio
- Il catalogo mostra i film di test
- Gli stream HEVC si riproducono sulla TV Hisense
- È possibile identificare e riprodurre bug di riproduzione in modo ripetibile

## Implementation Notes

### Scelte Tecnologiche

**Server HTTP:** Utilizzeremo il modulo `http` nativo di Node.js per mantenere le dipendenze al minimo. In alternativa, potremmo usare `express` se si preferisce una sintassi più concisa per il routing.

**Parsing URL:** Utilizzeremo il modulo `url` nativo di Node.js per il parsing degli URL delle richieste.

**JSON:** Utilizzeremo `JSON.stringify()` e `JSON.parse()` nativi per la serializzazione.

### Struttura del Progetto

```
test-hevc-hisense-addon/
├── index.js           # Server principale con tutti gli handler
├── package.json       # Configurazione npm
├── README.md          # Istruzioni per l'uso
└── test/              # Directory per i test (opzionale)
    ├── unit.test.js
    └── property.test.js
```

### Configurazione degli URL HEVC

Gli URL dei file HEVC saranno definiti come oggetto costante all'inizio di index.js:

```javascript
const HEVC_TEST_URLS = {
  'test-hevc-strangler': 'https://archive.org/download/example1/file1.mkv',
  'test-hevc-man-of-conflict': 'https://archive.org/download/example2/file2.mkv'
};
```

Per aggiungere nuovi film di test:
1. Aggiungere una nuova entry in `HEVC_TEST_URLS`
2. Aggiungere il corrispondente meta object nel catalog handler
3. Riavviare il server

### Considerazioni per la TV Hisense

**behaviorHints.notWebReady:** Questo flag indica a Stremio che lo stream non è ottimizzato per il web player e dovrebbe essere gestito dal player nativo del dispositivo. È essenziale per la riproduzione su TV.

**Codec HEVC:** Assicurarsi che i file puntati dagli URL siano effettivamente codificati con H.265/HEVC. Stremio passerà l'URL direttamente al player della TV, che deve supportare il codec.

**Formato container:** I file .mkv e .mp4 sono entrambi supportati. MKV è preferibile per file di test poiché supporta più tracce audio/sottotitoli.

### Deployment

Per uso locale sulla rete domestica:
1. Avviare il server su un computer nella stessa rete della TV
2. Ottenere l'indirizzo IP locale del computer (es. 192.168.1.100)
3. Usare l'URL `http://192.168.1.100:7000/manifest.json` in Stremio sulla TV

Per deployment su server remoto:
1. Deployare su un servizio cloud (es. Heroku, Railway, Render)
2. Configurare la variabile d'ambiente PORT
3. Usare l'URL pubblico del manifest in Stremio

### Limitazioni Conosciute

- L'addon non supporta ricerca o filtri
- Il catalogo è statico e hardcoded
- Non c'è autenticazione o rate limiting
- Non supporta sottotitoli o tracce audio multiple (dipende dal file sorgente)
- Non c'è caching o ottimizzazione delle richieste

# Requirements Document

## Introduction

Questo documento definisce i requisiti per un addon Stremio minimale progettato per testare la riproduzione di file video HEVC (H.265) lunghi su TV Hisense con Vidaa / Home OS. L'addon espone un catalogo fisso di stream di test che puntano direttamente a file HEVC ospitati su Internet Archive o altri servizi di hosting HTTP, permettendo test ripetibili per identificare bug, freeze o crash del player nativo.

## Glossary

- **Stremio**: Piattaforma di streaming multimediale che supporta addon personalizzati
- **Addon**: Estensione per Stremio che fornisce contenuti tramite API HTTP
- **HEVC (H.265)**: Codec video ad alta efficienza utilizzato per la compressione video
- **Vidaa / Home OS**: Sistema operativo utilizzato dalle TV Hisense
- **Manifest**: File JSON che descrive le capacità e i metadati dell'addon
- **Stream**: Riferimento a un file video accessibile tramite URL diretto
- **Catalog**: Collezione di contenuti multimediali esposti dall'addon
- **Test Addon**: L'addon Stremio sviluppato in questo progetto

## Requirements

### Requirement 1

**User Story:** Come sviluppatore che testa la compatibilità HEVC, voglio un addon Stremio con un manifest valido, così da poter registrare l'addon nell'applicazione Stremio.

#### Acceptance Criteria

1. WHEN l'endpoint /manifest.json viene richiesto, THEN the Test Addon SHALL restituire un documento JSON valido contenente id, version, name, description, types, catalogs e resources
2. THE Test Addon SHALL dichiarare "test-hevc-hisense" come identificatore univoco
3. THE Test Addon SHALL dichiarare almeno il tipo "movie" nell'array types
4. THE Test Addon SHALL dichiarare almeno le risorse "catalog" e "stream" nell'array resources
5. THE Test Addon SHALL includere almeno un catalogo con type "movie" e id "test-hevc-catalog"

### Requirement 2

**User Story:** Come sviluppatore che testa la compatibilità HEVC, voglio un catalogo fisso con 2-3 film di test, così da poter selezionare contenuti specifici per i test di riproduzione.

#### Acceptance Criteria

1. WHEN l'endpoint /catalog/movie/test-hevc-catalog.json viene richiesto, THEN the Test Addon SHALL restituire un array JSON di oggetti movie
2. THE Test Addon SHALL includere almeno due film di test con ID stabili nel catalogo
3. WHEN un film viene incluso nel catalogo, THEN the Test Addon SHALL fornire almeno i campi id, name e type per ciascun film
4. THE Test Addon SHALL utilizzare ID descrittivi che iniziano con "test-hevc-" per identificare i film di test
5. WHERE metadati opzionali sono forniti, THE Test Addon SHALL includere campi come poster, description, year o imdb_id

### Requirement 3

**User Story:** Come sviluppatore che testa la compatibilità HEVC, voglio che ogni film di test punti a un URL diretto di un file HEVC, così da poter testare la riproduzione senza intermediari.

#### Acceptance Criteria

1. WHEN l'endpoint /stream/movie/:id.json viene richiesto con un ID valido, THEN the Test Addon SHALL restituire un array streams contenente almeno uno stream
2. WHEN uno stream viene restituito, THEN the Test Addon SHALL includere un campo url con un URL HTTP/HTTPS diretto al file video
3. WHEN uno stream viene restituito, THEN the Test Addon SHALL includere un campo title descrittivo
4. WHEN uno stream viene restituito, THEN the Test Addon SHALL includere behaviorHints con notWebReady impostato a true
5. THE Test Addon SHALL fornire URL che puntano direttamente a file con codec video H.265/HEVC senza trasformazioni o proxy

### Requirement 4

**User Story:** Come sviluppatore che testa la compatibilità HEVC, voglio che gli URL dei file HEVC siano facilmente modificabili nel codice, così da poter cambiare i file di test senza ristrutturare il codice.

#### Acceptance Criteria

1. THE Test Addon SHALL dichiarare gli URL dei file HEVC come costanti configurabili all'inizio del file sorgente
2. THE Test Addon SHALL utilizzare nomi di costanti descrittivi che identificano chiaramente ciascun file di test
3. WHEN gli URL devono essere aggiornati, THEN the Test Addon SHALL permettere la modifica delle sole costanti senza cambiare la logica dell'handler
4. THE Test Addon SHALL utilizzare le costanti URL negli handler /stream per costruire le risposte

### Requirement 5

**User Story:** Come sviluppatore che testa la compatibilità HEVC, voglio un server HTTP Node.js minimale e robusto, così da poter eseguire l'addon localmente senza complessità inutili.

#### Acceptance Criteria

1. THE Test Addon SHALL essere implementato utilizzando Node.js
2. THE Test Addon SHALL utilizzare dipendenze minime per il server HTTP
3. THE Test Addon SHALL ascoltare su una porta configurabile tramite variabile d'ambiente PORT con default 7000
4. WHEN il server viene avviato, THEN the Test Addon SHALL registrare sulla console l'URL del manifest
5. THE Test Addon SHALL rispondere alle richieste HTTP GET per gli endpoint /manifest.json, /catalog/:type/:id.json e /stream/:type/:id.json

### Requirement 6

**User Story:** Come sviluppatore che testa la compatibilità HEVC, voglio un package.json configurato correttamente, così da poter installare le dipendenze e avviare il server con comandi standard npm.

#### Acceptance Criteria

1. THE Test Addon SHALL includere un file package.json con name "test-hevc-hisense-addon"
2. THE Test Addon SHALL dichiarare uno script "start" che esegue "node index.js"
3. THE Test Addon SHALL specificare le dipendenze minime necessarie nel package.json
4. WHEN npm install viene eseguito, THEN the Test Addon SHALL installare tutte le dipendenze necessarie
5. WHEN npm start viene eseguito, THEN the Test Addon SHALL avviare il server sulla porta configurata

### Requirement 7

**User Story:** Come sviluppatore che testa la compatibilità HEVC, voglio che l'addon sia compatibile con il protocollo Stremio, così da poter aggiungerlo all'applicazione Stremio tramite URL.

#### Acceptance Criteria

1. THE Test Addon SHALL implementare il protocollo standard Stremio per addon HTTP
2. WHEN l'URL del manifest viene aggiunto in Stremio, THEN the Test Addon SHALL apparire nella lista degli addon installati
3. WHEN l'addon viene attivato in Stremio, THEN the Test Addon SHALL esporre il catalogo "Test HEVC Movies"
4. WHEN un film di test viene selezionato, THEN the Test Addon SHALL fornire lo stream HEVC per la riproduzione
5. THE Test Addon SHALL restituire risposte JSON conformi al formato atteso da Stremio per tutti gli endpoint

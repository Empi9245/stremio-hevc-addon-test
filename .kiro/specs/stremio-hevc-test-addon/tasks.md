# Implementation Plan

- [x] 1. Inizializzare il progetto Node.js





  - Creare la directory del progetto
  - Creare package.json con configurazione base
  - Configurare script "start" per avviare il server
  - _Requirements: 6.1, 6.2_

- [x] 2. Implementare il server HTTP e gli handler degli endpoint


  - [x] 2.1 Creare index.js con server HTTP base


    - Configurare server HTTP nativo Node.js
    - Implementare routing per gli endpoint /manifest.json, /catalog/:type/:id.json, /stream/:type/:id.json
    - Configurare porta tramite variabile d'ambiente PORT con default 7000
    - Aggiungere logging dell'URL del manifest all'avvio
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_


  - [x] 2.2 Implementare handler per /manifest.json


    - Restituire oggetto manifest con id, version, name, description, types, catalogs, resources
    - Assicurarsi che id sia "test-hevc-hisense"
    - Includere type "movie" e resources "catalog" e "stream"
    - Includere catalogo "test-hevc-catalog"
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_


  - [x] 2.3 Implementare handler per /catalog/:type/:id.json


    - Restituire array metas con almeno 2 film di test
    - Ogni film deve avere id, type, name, poster, description, year
    - Usare ID che iniziano con "test-hevc-"
    - Restituire array vuoto per catalog non conosciuti
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 2.4 Definire costanti URL HEVC configurabili

    - Creare oggetto HEVC_TEST_URLS all'inizio del file
    - Usare nomi descrittivi per le costanti
    - Mappare ID film agli URL dei file HEVC
    - _Requirements: 4.1, 4.2, 4.3, 4.4_


  - [x] 2.5 Implementare handler per /stream/:type/:id.json



    - Restituire array streams con url, title, behaviorHints
    - Usare le costanti HEVC_TEST_URLS per gli URL
    - Impostare behaviorHints.notWebReady a true
    - Restituire array vuoto per ID non conosciuti
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 3. Creare unit test opzionali
  - [ ]* 3.1 Scrivere test per endpoint /manifest.json
    - Verificare che restituisca tutti i campi richiesti
    - Verificare id, types, resources corretti
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 3.2 Scrivere test per endpoint /catalog
    - Verificare che restituisca array metas con almeno 2 film
    - Verificare che ogni film abbia campi obbligatori
    - Verificare prefisso "test-hevc-" negli ID
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 3.3 Scrivere test per endpoint /stream
    - Verificare che restituisca stream validi per ID conosciuti
    - Verificare presenza di url, title, behaviorHints
    - Verificare array vuoto per ID non conosciuti
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Creare documentazione README
  - Spiegare lo scopo dell'addon
  - Fornire istruzioni per installazione (npm install)
  - Fornire istruzioni per avvio (npm start)
  - Spiegare come aggiungere l'addon in Stremio
  - Spiegare come modificare gli URL HEVC
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 5. Checkpoint finale - Verificare funzionamento completo
  - Avviare il server localmente
  - Testare manualmente tutti gli endpoint
  - Aggiungere l'addon in Stremio e verificare che funzioni
  - Assicurarsi che gli stream HEVC siano riproducibili
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

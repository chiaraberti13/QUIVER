# Contributing to QUIVER

<p align="center"><a href="#english">🇬🇧 English</a> · <a href="#italiano">🇮🇹 Italiano</a></p>

## English
This repository covers a local-first, provider-agnostic Agent Skills inspection ecosystem and collaborative AI-agent orchestrator.

### Before you start
1. Read `README.md`, `SECURITY.md`, roadmap and relevant ADR/design documentation.
2. Search existing issues and use a dedicated branch.
3. Keep each pull request focused and avoid unrelated refactors.
4. Never commit secrets, private data, production exports or untrusted generated artefacts.
5. Report vulnerabilities privately.

### Setup
```bash
corepack enable
pnpm install --frozen-lockfile
```

### Checks
```bash
pnpm typecheck
pnpm lint
pnpm lint:fixtures
pnpm format:check
```
At the current scaffold stage, do not document planned scanner, sandbox, provider or runtime controls as implemented. Trust claims must remain content-bound, versioned and evidence-based.

### Engineering expectations
Validate untrusted input, fail safely, preserve explicit permission boundaries, keep dependencies minimal and justified, and update tests for behavioural changes. Document data/schema/protocol changes and migration impact. Update English documentation first and keep Italian public documentation semantically aligned.

### Pull requests
Describe what changed, why, verification performed, security/privacy impact, compatibility implications and rollback/migration notes. Participation follows `CODE_OF_CONDUCT.md`.

## Italiano
Questo repository riguarda a local-first, provider-agnostic Agent Skills inspection ecosystem and collaborative AI-agent orchestrator.

### Prima di iniziare
1. Leggi `README.md`, `SECURITY.md`, roadmap e ADR/documentazione pertinente.
2. Controlla le issue esistenti e usa un branch dedicato.
3. Mantieni ogni pull request focalizzata.
4. Non committare segreti, dati privati, export di produzione o artefatti generati non fidati.
5. Segnala privatamente le vulnerabilità.

### Setup
```bash
corepack enable
pnpm install --frozen-lockfile
```

### Controlli
```bash
pnpm typecheck
pnpm lint
pnpm lint:fixtures
pnpm format:check
```
At the current scaffold stage, do not document planned scanner, sandbox, provider or runtime controls as implemented. Trust claims must remain content-bound, versioned and evidence-based.

### Aspettative tecniche
Valida gli input non fidati, usa comportamenti fail-safe, conserva i confini espliciti di permesso, mantieni le dipendenze minime e motivate e aggiorna i test. Documenta modifiche a dati/schema/protocolli e migrazioni. Aggiorna prima la documentazione inglese e mantieni quella pubblica italiana semanticamente equivalente.

### Pull request
Descrivi cosa cambia, perché, verifiche eseguite, impatto sicurezza/privacy, compatibilità e rollback/migrazione. Si applica `CODE_OF_CONDUCT.md`.

## Segnalazioni e verifica dei contributi

Ambiente locale per ispezione di Agent Skills e orchestrazione di agenti AI.

Usa i [modelli di segnalazione](https://github.com/chiaraberti13/QUIVER/issues/new/choose) per bug, miglioramenti e barriere di accessibilità. Prima di aprire una nuova segnalazione verifica se ne esiste già una equivalente. Contesto utile: Versioni Node.js e pnpm, workspace, provider e skill minima senza segreti.

Per le modifiche, compila il modello di pull request e indica verifiche eseguite, esito e verifiche non eseguite con il motivo. Mantieni le istruzioni specifiche di questo progetto e la parità delle lingue già disponibili. Non allegare dati di produzione, credenziali o dati personali; usa esempi sintetici.

Consulta [il codice di condotta](CODE_OF_CONDUCT.md), [la policy di sicurezza](SECURITY.md) e [le indicazioni di accessibilità](ACCESSIBILITY.md). Le vulnerabilità seguono esclusivamente il percorso descritto nella policy di sicurezza.

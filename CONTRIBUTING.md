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
corepack enable\npnpm install --frozen-lockfile
```

### Checks
```bash
pnpm typecheck\npnpm lint\npnpm lint:fixtures\npnpm format:check
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
corepack enable\npnpm install --frozen-lockfile
```

### Controlli
```bash
pnpm typecheck\npnpm lint\npnpm lint:fixtures\npnpm format:check
```
At the current scaffold stage, do not document planned scanner, sandbox, provider or runtime controls as implemented. Trust claims must remain content-bound, versioned and evidence-based.

### Aspettative tecniche
Valida gli input non fidati, usa comportamenti fail-safe, conserva i confini espliciti di permesso, mantieni le dipendenze minime e motivate e aggiorna i test. Documenta modifiche a dati/schema/protocolli e migrazioni. Aggiorna prima la documentazione inglese e mantieni quella pubblica italiana semanticamente equivalente.

### Pull request
Descrivi cosa cambia, perché, verifiche eseguite, impatto sicurezza/privacy, compatibilità e rollback/migrazione. Si applica `CODE_OF_CONDUCT.md`.

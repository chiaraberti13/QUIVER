# Contribuire a QUIVER

[English](CONTRIBUTING.md) · [Italiano](CONTRIBUTING.it.md) · [Documentazione](docs/README.it.md)

QUIVER è nella fase scaffold. Prima di proporre un'implementazione, leggi
[specifica](project.md), [roadmap](roadmap.md) e
[stato dello sviluppo](docs/presentation/development-status.it.md).

## Flusso di contribuzione

1. Per una nuova idea, apri una [issue](https://github.com/chiaraberti13/QUIVER/issues)
   spiegando il problema e il collegamento con Skills Hub o Orchestrator.
2. Lavora su un branch dedicato e apri una pull request circoscritta. Non fare push
   diretto su `main`, force push o riscritture del lavoro di altri contributori.
3. Spiega il comportamento risultante, i file coinvolti e le verifiche pertinenti.
   Cita le regole `SC-xx` applicabili alle modifiche di codice rilevanti per la sicurezza.
4. Rispetta revisioni dei percorsi protetti e gate in
   [project.md §27](project.md#27-protected-paths-and-checkpoint-reviews-quivers-own-repository).
   Non simulare approvazioni umane e non completare task della roadmap senza evidenze.

## Controlli locali

Usa i prerequisiti del [README](README.it.md#configurazione-per-lo-sviluppo):

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm lint:fixtures
pnpm format:check
```

Mantieni attive le restrizioni all'installazione delle dipendenze. Test di prodotto,
workflow CI ed entry point del runtime arriveranno nei rispettivi task; i controlli
dello scaffold non dimostrano che una funzionalità prevista sia operativa.

## Contributi alla documentazione

Aggiorna insieme le versioni pubbliche inglese e italiana: link, esempi, stato
e testi alternativi. Usa `README.md` / `README.it.md` e la stessa convenzione
`.it.md` nelle guide. Entrambe le guide ai metadati mantengono l'About in inglese.
Specifiche tecniche, ADR e roadmap letta dalle automazioni restano in inglese;
vedi [ADR 0004](docs/adr/0004-bilingual-public-documentation.md).

Conserva i rapporti storici. Distingui specifiche e funzioni implementate e
verifica link locali e resa degli SVG quando li modifichi. Per le vulnerabilità
segui [SECURITY.it.md](SECURITY.it.md): non includere dettagli di exploit o
segreti in una issue pubblica.

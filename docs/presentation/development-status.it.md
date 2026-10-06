# Stato dello sviluppo

[English](development-status.md) · [Italiano](development-status.it.md) · [Documentazione](../README.it.md)

**Stato al 2026-10-06.** QUIVER è nelle prime fasi di sviluppo, alle fondamenta.
Il pacchetto principale è privato e ha versione `0.0.0`; non ci sono release pubblicate.

| Area                     | Presente oggi                                                                               | Ancora previsto                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Workspace                | App, pacchetti condivisi, provider, bridge e configurazione TypeScript strict.              | Implementazioni di prodotto e controllo dei confini delle dipendenze.              |
| Strumenti                | pnpm fissato, restrizioni agli script delle dipendenze, ESLint, Prettier e fixture di lint. | Workflow CI e test di prodotto.                                                    |
| Skills Hub               | Specifica di prodotto e scaffold dei pacchetti.                                             | Importazione, hash canonico, analisi, fiducia, installazione e sincronizzazione.   |
| Orchestrator             | Specifica di prodotto e scaffold degli adattatori.                                          | Runtime, permessi, flussi, budget e pianificazioni.                                |
| Interfacce               | Scaffold dei pacchetti CLI, server e web.                                                   | Comandi utilizzabili, endpoint API e schermate web.                                |
| Presentazione            | README, guide e banner SVG localizzati in inglese/italiano.                                 | La localizzazione del runtime è fuori da questo intervento documentale.            |
| Preparazione al rilascio | Roadmap e decisioni tecniche.                                                               | Decisione sulla licenza, gate di rilascio e verifica indipendente della sicurezza. |

`pnpm typecheck` controlla lo scaffold esistente, non la correttezza del runtime.
`pnpm lint:fixtures` verifica specifici controlli di lint, non l'efficacia dello
scanner delle skill. Alla radice non esistono script `build`, `test`, `start` o `dev`.

## Prossime tappe

Consulta [roadmap.md](../../roadmap.md) per ordine e gate: fondamenta;
importazione locale Skills Hub; provenienza e analisi; installazione e release
CLI; interfaccia web; Orchestrator; bridge facoltativo; integrazioni dell'ecosistema.

Stati dei task e rapporti di verifica possono differire da ciò che è già confluito
nel codice. Questa sintesi descrive i file presenti senza modificare le approvazioni.
La presentazione non completa P0-T017: canale definitivo di segnalazione, tempi di
risposta e politica delle versioni supportate devono ancora essere confermati.

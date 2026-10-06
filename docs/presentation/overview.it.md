# Panoramica del prodotto

[English](overview.md) · [Italiano](overview.it.md) · [Documentazione](../README.it.md)

QUIVER è un ecosistema in sviluppo per gestire Agent Skills riutilizzabili e
coordinare agenti AI sui progetti software. Una faretra contiene frecce scelte
prima dell'uso: qui ogni skill deve avere un'origine identificabile e una versione
che sia possibile ispezionare.

## Due prodotti indipendenti

| Prodotto               | Ruolo previsto                                                                           | Destinatari                                               |
| ---------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **Skills Hub**         | Scoprire, ispezionare, analizzare, versionare e installare skill da snapshot immutabili. | Sviluppatori, autori di skill e revisori della sicurezza. |
| **Orchestrator**       | Coordinare agenti, ruoli, permessi, flussi di lavoro, pianificazioni e budget.           | Sviluppatori individuali e team di sviluppo.              |
| **Integration Bridge** | Assegnare facoltativamente snapshot fissati agli agenti e riconciliare i permessi.       | Chi sceglie di combinare i due prodotti.                  |

Nessuno dei due prodotti richiede l'altro. Sono obiettivi di prodotto: il codice
attuale contiene lo scaffold del workspace, non un hub o un runtime operativo.

## Principi

- **Local-first:** nessun cloud QUIVER obbligatorio; l'elaborazione esterna richiede una scelta.
- **Indipendenza dai provider:** gli adattatori separano i comportamenti specifici dai domini.
- **Fiducia legata al contenuto:** una decisione vale per uno snapshot preciso, non per il nome.
- **Evidenze prima delle rassicurazioni:** mostrare finding, provenienza e limiti.
- **Controllo umano:** rendere espliciti costi, permessi e azioni automatiche.
- **Ispezione statica:** l'analisi prevista delle skill non ne esegue il codice.

Uno sviluppatore dovrebbe poter esaminare file, capacità, licenza e cambiamenti
di una skill prima di installarla. Il coordinamento di più agenti dovrebbe rendere
visibili le loro responsabilità e l'effettiva applicazione dei permessi.

## Continua

[Architettura](architecture.it.md) · [Stato attuale](development-status.it.md) ·
[Specifica completa](../../project.md) · [Roadmap](../../roadmap.md)

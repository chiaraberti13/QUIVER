# Metadati e identità visiva del repository

[English](repository-metadata.md) · [Italiano](repository-metadata.it.md) · [Documentazione](../README.it.md)

## About — descrizione inglese di riferimento

Local-first, provider-agnostic ecosystem for inspecting and verifying Agent Skills and orchestrating collaborative AI agents. Independent Skills Hub and Orchestrator, with content-bound trust, provenance and auditability. Early development.

## Topics

```text
ai-agents agent-skills multi-agent agent-orchestration local-first ai-security
supply-chain-security static-analysis workflow-automation developer-tools
typescript nodejs cli monorepo
```

Descrivono l'ambito del progetto, comprese le capacità previste. About e Topics
sono impostazioni del repository GitHub: il commit di questo documento non le
applica. Chi mantiene il progetto può usare una GitHub CLI autenticata:

```bash
gh repo edit chiaraberti13/QUIVER --description "Local-first, provider-agnostic ecosystem for inspecting and verifying Agent Skills and orchestrating collaborative AI agents. Independent Skills Hub and Orchestrator, with content-bound trust, provenance and auditability. Early development."
gh api --method PUT repos/chiaraberti13/QUIVER/topics --input - <<'JSON'
{"names":["ai-agents","agent-skills","multi-agent","agent-orchestration","local-first","ai-security","supply-chain-security","static-analysis","workflow-automation","developer-tools","typescript","nodejs","cli","monorepo"]}
JSON
```

Il secondo comando sostituisce l'intero elenco dei Topics. Il campo del sito
resta vuoto finché non esiste un sito reale del progetto.

## Banner

[SVG inglese](../../assets/banner.svg) · [SVG italiano](../../assets/banner.it.svg).
Entrambi riprendono il layout da terminale 1280 × 320 del portfolio: sfondo scuro,
categoria ciano, accento giallo e stato di sviluppo. Sono statici, con testo
alternativo e senza script, font remoti, immagini raster incorporate o animazioni.
La presentazione del repository non definisce il logo o il design system della
futura applicazione, che restano decisioni separate della roadmap.

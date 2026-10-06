# Repository metadata and visual identity

[English](repository-metadata.md) · [Italiano](repository-metadata.it.md) · [Documentation](../README.md)

## About — canonical English description

Local-first, provider-agnostic ecosystem for inspecting and verifying Agent Skills and orchestrating collaborative AI agents. Independent Skills Hub and Orchestrator, with content-bound trust, provenance and auditability. Early development.

## Topics

```text
ai-agents agent-skills multi-agent agent-orchestration local-first ai-security
supply-chain-security static-analysis workflow-automation developer-tools
typescript nodejs cli monorepo
```

These describe the project's scope, including planned capabilities. The About
field and Topics are GitHub repository settings; committing this document does
not apply them. Maintainers with an authenticated GitHub CLI can use:

```bash
gh repo edit chiaraberti13/QUIVER --description "Local-first, provider-agnostic ecosystem for inspecting and verifying Agent Skills and orchestrating collaborative AI agents. Independent Skills Hub and Orchestrator, with content-bound trust, provenance and auditability. Early development."
gh api --method PUT repos/chiaraberti13/QUIVER/topics --input - <<'JSON'
{"names":["ai-agents","agent-skills","multi-agent","agent-orchestration","local-first","ai-security","supply-chain-security","static-analysis","workflow-automation","developer-tools","typescript","nodejs","cli","monorepo"]}
JSON
```

The second command replaces the complete Topics list. The website field stays
empty until a real project website exists.

## Banner

[English SVG](../../assets/banner.svg) · [Italian SVG](../../assets/banner.it.svg).
Both use the portfolio's 1280 × 320 terminal-style layout, dark background,
cyan category, yellow accent and development label. They are static, with
alternative text and no scripts, remote fonts, embedded raster or animation.
This repository presentation does not finalize the future application's logo
or design system, which remain separate roadmap decisions.

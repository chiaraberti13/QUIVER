# Development status

[English](development-status.md) · [Italiano](development-status.it.md) · [Documentation](../README.md)

**Status snapshot: 2026-10-06.** QUIVER is in early development, at the foundations
stage. The root package is private and versioned `0.0.0`; no releases are published.

| Area              | Present now                                                                      | Still planned                                                         |
| ----------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Workspace         | Apps, shared packages, providers, bridge and strict TypeScript configuration.    | Product implementations and dependency-boundary enforcement.          |
| Tooling           | Pinned pnpm, dependency-script restrictions, ESLint, Prettier and lint fixtures. | CI workflows and the product test suite.                              |
| Skills Hub        | Product specification and package scaffolds.                                     | Ingestion, canonical hashing, scanning, trust, installation and sync. |
| Orchestrator      | Product specification and adapter scaffolds.                                     | Agent runtime, permissions, workflows, budgets and schedules.         |
| Interfaces        | CLI, server and web package scaffolds.                                           | Usable commands, API endpoints and web screens.                       |
| Presentation      | English/Italian README, guides and localized SVG banners.                        | Runtime localization is outside this documentation change.            |
| Release readiness | Roadmap and engineering decisions.                                               | Licence decision, release gates and independent security testing.     |

`pnpm typecheck` checks the existing scaffold, not runtime correctness.
`pnpm lint:fixtures` verifies specific lint guardrails, not skill-scanner
effectiveness. No `build`, `test`, `start` or `dev` script is available at the root.

## Next milestones

Follow [roadmap.md](../../roadmap.md) for task order and gates: foundations;
Skills Hub local import; provenance and analysis; installation and CLI release;
web interface; Orchestrator; optional bridge; ecosystem integrations.

Task markers and verification reports can differ from what has already landed.
This summary describes the files present, without changing task approvals.
Presentation work does not complete P0-T017, whose final disclosure channel,
response targets and supported-version policy still require confirmation.

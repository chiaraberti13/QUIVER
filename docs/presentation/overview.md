# Product overview

[English](overview.md) · [Italiano](overview.it.md) · [Documentation](../README.md)

QUIVER is an ecosystem under development for managing reusable Agent Skills and
coordinating AI agents on software projects. A quiver holds arrows chosen before
use: here, skills should have an identifiable origin and an inspectable version.

## Two independent products

| Product                | Planned role                                                                  | Intended users                                        |
| ---------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Skills Hub**         | Discover, inspect, scan, version and install skills from immutable snapshots. | Developers, skill maintainers and security reviewers. |
| **Orchestrator**       | Coordinate agents, roles, permissions, workflows, schedules and budgets.      | Individual developers and development teams.          |
| **Integration Bridge** | Optionally assign pinned skill snapshots to agents and reconcile permissions. | Users who choose to combine both products.            |

Neither product requires the other. These are product goals: the current code
contains workspace scaffolding, not an operational hub or agent runtime.

## Principles

- **Local-first:** no mandatory QUIVER cloud; external processing requires choice.
- **Provider-agnostic:** adapters keep provider-specific behaviour out of domains.
- **Content-bound trust:** a decision applies to one exact snapshot, not its name.
- **Evidence before reassurance:** show findings, provenance and limitations.
- **Human control:** make spending, permissions and automated actions explicit.
- **Static inspection:** planned skill analysis does not execute skill code.

For example, a developer should be able to inspect a skill's files, capabilities,
licence and version changes before installing it. Coordinating several agents
should make their responsibilities and actual permission enforcement visible.

## Read next

[Architecture](architecture.md) · [Current status](development-status.md) ·
[Full specification](../../project.md) · [Roadmap](../../roadmap.md)

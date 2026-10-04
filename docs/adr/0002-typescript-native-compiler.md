# ADR 0002 — TypeScript toolchain: native compiler (7.x)

- Status: accepted
- Date: 2026-10-04
- Deciders: tech-lead (owner), reviewers: devops-engineer, security-engineer
- Related: project.md §45 (stack), §51 (ADRs), SC-01, SC-46, SC-47
- Supersedes/affects: none (first ADR to pin a build tool; Node.js line is ADR 0001, task P0-T002)

## Context

The monorepo scaffold (task P0-T001) needs a TypeScript compiler to enforce the
strict type-safety rules required by SC-01 (`strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`). `project.md` §45 names TypeScript as the language
and states that exact library versions are chosen in dedicated tasks and recorded
in ADRs. SC-46 requires every new dependency to be justified, and SC-47 requires
exact, lockfile-pinned versions.

At the time of scaffolding, the current published `latest` of the `typescript`
package is the **7.x native compiler** (the Go/`tsgo` rewrite), distributed as a
thin `typescript` package plus a set of per-platform prebuilt binary packages
(`@typescript/typescript-<os>-<arch>`) pulled in as optional dependencies. This
is a significant change from the long-standing 5.x JavaScript compiler and
deserves an explicit, recorded decision rather than an implicit `latest` pin.

## Decision

Pin the root dev dependency to `typescript@7.0.2` (exact version, no range),
captured in `pnpm-lock.yaml` with integrity hashes (SC-47). TypeScript is a
build-time dev tool only — it is not a runtime dependency of any shipped package.

Supply-chain posture for this dependency:

- `ignore-scripts=true` in `.npmrc` disables all dependency lifecycle scripts on
  install; the `pnpm.onlyBuiltDependencies` build allowlist is empty (SC-47).
- The `typescript` package and its `@typescript/typescript-*` platform binaries
  carry **no** install/postinstall scripts (verified), so nothing executes on
  install even independently of the allowlist.
- The per-platform binaries are `optional: true`, so each OS in the CI matrix
  (Linux/macOS/Windows, project.md §49) resolves and runs only its own prebuilt
  binary; all are present in the committed lockfile for reproducibility.

## Consequences

- Positive: fastest supported type checking across the 23-package workspace;
  tracks the vendor's current supported line; strict flags verified effective.
- Positive: exact version + committed lockfile + disabled install scripts keep
  the install deterministic and script-free.
- Negative / risk: the native compiler line is comparatively new, so edge-case
  behaviour differences from the 5.x compiler are possible. Mitigation: the pin
  is exact (no silent upgrades), the strict-flag behaviour is covered by the
  `pnpm typecheck` gate, and any upgrade goes through a reviewed lockfile change.
- Negative: adds ~20 optional platform-binary packages to the lockfile. These
  are prebuilt, script-free and integrity-pinned; no additional attack surface
  executes at install time.

## Alternatives considered

- **TypeScript 5.x (classic JS compiler).** Mature and widely deployed. Rejected
  as the default because it is no longer the vendor's `latest` supported line;
  kept as the documented fallback if a 7.x incompatibility is found.
- **Unpinned / caret range (`^7`).** Rejected: violates SC-47 (exact versions)
  and would allow silent upgrades of a security-relevant build tool.
- **Deferring the compiler choice to P0-T002.** P0-T002 owns the Node.js line
  (ADR 0001). The TypeScript dependency is introduced by this task, so SC-46
  requires its justification here; this ADR records it rather than deferring.

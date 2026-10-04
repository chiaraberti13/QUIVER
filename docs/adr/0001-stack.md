# ADR 0001 — Node.js runtime line: 24 "Krypton" (Active LTS)

- Status: accepted
- Date: 2026-10-04
- Deciders: tech-lead (owner); reviewers: devops-engineer (required), security-engineer (supply-chain hygiene: package.json + engine-strict touched)
- Related: project.md §45 (stack), §51 (ADRs), §61 (facts TO VERIFY); roadmap task P0-T002
- Supersedes/affects: none (first ADR; pins the project runtime line referenced by ADR 0002)

## Context

`project.md` §45 names **Node.js LTS** as the runtime and marks the exact version
as `TO VERIFY` (§61). Task P0-T002 owns verifying the current Node.js LTS line
from official sources and pinning it, with an `.nvmrc` and an `engines` field that
are consistent with each other.

Per the hard rules in `roadmap.md` §1, a `TO VERIFY` fact must come from an
official source with an access date.

### Verified facts (official sources, accessed 2026-10-04)

Source: Node.js release schedule, `nodejs.org/Release` project
(`https://raw.githubusercontent.com/nodejs/Release/main/schedule.json`),
cross-checked against the Node.js distribution index
(`https://nodejs.org/dist/index.json`). Both are the canonical, machine-readable
Node.js project sources.

| Line | Codename | LTS start | → Maintenance | End-of-life | Status on 2026-10-04 |
|---|---|---|---|---|---|
| v20 | Iron | 2023-10-24 | 2024-10-22 | 2026-04-30 | **End-of-life** (ended 2026-04-30) |
| v22 | Jod | 2024-10-29 | 2025-10-21 | 2027-04-30 | **Maintenance LTS** |
| v24 | Krypton | 2025-10-28 | 2026-10-20 | 2028-04-30 | **Active LTS** |
| v26 | (tbd) | 2026-10-28 | 2027-10-20 | 2029-04-30 | Current (not yet LTS) |

- Current **Active LTS** line: **Node.js 24 "Krypton"**.
- Latest 24.x release on the access date: **v24.21.0** (released 2026-09-07),
  bundling npm 11.19.0.
- Node.js 24 transitions from Active LTS to Maintenance LTS on **2026-10-20** and
  is supported until **2028-04-30**. Node.js 26 becomes the next Active LTS on
  **2026-10-28**.

## Decision

1. **Standardize on the Node.js 24 "Krypton" LTS line.** It is the current Active
   LTS and remains a supported LTS line (Active, then Maintenance) until
   2028-04-30 — the longest-supported line that is already in LTS.
2. **`.nvmrc` pins the exact canonical version `24.21.0`** (the latest 24.x LTS
   release on the access date). `.nvmrc` is read by Node version managers (nvm,
   fnm) and documents the single recommended version; it is not read by pnpm.
3. **`engines.node` = `>=22.0.0 <23.0.0 || >=24.0.0 <25.0.0`** (transitional
   range). It admits exactly the two currently-supported LTS *major* lines the
   project targets — Node 22 (Maintenance) and Node 24 (Active) — and nothing
   else. The `.nvmrc` version (`24.21.0`) satisfies this range, so the two are
   consistent: the `engines` range is the set of runtimes the repository accepts,
   and `.nvmrc` names the recommended member of that set. The floor admits
   Node 22, not only `>=24.0.0`, for one concrete operational reason below. The
   `|| >=24.0.0` clause (rather than a single `>=22.0.0 <25.0.0` span)
   deliberately excludes the odd, non-LTS, end-of-life Node 23 line, so the
   enforced constraint matches the guarantee stated below.
4. **pnpm** stays pinned by `packageManager: "pnpm@10.28.0"` with
   `engines.pnpm: ">=10.0.0"` (unchanged; introduced by P0-T001). The project
   runs pnpm 10.x.

### Why the `engines.node` floor is `22`, not `24`

`.npmrc` sets `engine-strict=true` (a supply-chain guardrail from P0-T001: the
repository refuses to install or run scripts under an unexpected runtime). The
autonomous development routine, its CI, and the cloud execution environment
currently provide **Node.js 22 "Jod"** (a supported Maintenance LTS line until
2027-04-30); Node 24 is not yet installed in those images. With
`engine-strict=true`, setting `engines.node` to a `>=24`-only range makes
`pnpm install --frozen-lockfile` and every `pnpm run` script **fail** on Node 22,
which would halt both this task's `pnpm typecheck` verification and all
subsequent routine sessions.

The range therefore admits exactly the two currently-supported LTS major lines
the project targets (22 Maintenance and 24 Active) and excludes everything else:
end-of-life lines below the floor (`<22`, e.g. v20), the odd/non-LTS/end-of-life
Node 23 line (via the `||` split rather than one continuous `<25` span), and
future-unverified lines (`>=25`). This keeps `engine-strict` enforcement intact
while remaining runnable in every supported environment.

## Consequences

- Positive: the runtime target is an officially supported LTS line, pinned to an
  exact recommended version, verified against canonical sources with an access
  date.
- Positive: `engine-strict` continues to reject end-of-life and non-LTS runtimes
  (v20 and below, the odd/EOL v23, and `>=25`); the install stays deterministic.
- Positive: no runtime churn forced on the existing Node 22 CI/dev/cloud images;
  they remain within the supported range while they are upgraded to Node 24.
- Negative / follow-up: the `engines.node` range is intentionally wider than the
  `.nvmrc` pin during the 22→24 migration (it still admits the Node 22 Maintenance
  LTS). Once the CI matrix, dev images and the cloud execution environment ship
  Node 24, a follow-up task should narrow the range to `>=24.0.0 <25.0.0` so it
  matches the `.nvmrc` line exactly. This is recorded as the `followup_note` on
  the P0-T002 task block in `roadmap.md`, whose stated precondition is that
  `node -v` on the routine's execution environment reports v24.x.
- Negative / time-sensitivity: Node 24 enters Maintenance on 2026-10-20 and
  Node 26 becomes Active LTS on 2026-10-28. Moving to the Node 26 line is a normal
  future LTS-cadence decision; it will get its own ADR when Node 26 has entered
  Active LTS and is available in the project's toolchain images. This ADR does not
  pre-commit to it, because the fact (26 as Active LTS) is not yet true on the
  access date and would violate the `TO VERIFY` rule.

## Alternatives considered

- **Pin the floor to Node 24 (`engines.node >=24.0.0 <25.0.0`).** Cleanest match
  to `.nvmrc`, but with `engine-strict=true` it breaks `pnpm` on the Node 22
  CI/dev/cloud environment that the routine runs in today, halting the pipeline.
  Rejected until those images ship Node 24 (the follow-up above).
- **Standardize on Node 22 "Jod" (Maintenance LTS).** Matches the current
  environment exactly and is a supported LTS line, but it is only in Maintenance
  while Node 24 Active LTS is available and supported 12 months longer
  (2028-04-30 vs 2027-04-30). Rejected as the standard; kept inside the accepted
  `engines` range during migration.
- **Standardize on Node 26.** It is not yet an LTS line on the access date
  (becomes Active LTS 2026-10-28) and is unavailable in the toolchain images.
  Pinning it now would violate the `TO VERIFY` rule (asserting a not-yet-true
  fact). Deferred to a future ADR.
- **Unpinned / caret range.** Rejected: `TO VERIFY` and SC-47 require an explicit,
  exact, reviewed pin, not a silently-upgrading range.

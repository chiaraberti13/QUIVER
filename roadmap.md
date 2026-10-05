# QUIVER — roadmap.md

> **Language:** English only. This file is read by the development routine.
>
> Specification: [`project.md`](project.md).

---

## 1. How this file is used

The development routine (Claude Code) runs one task per session:

1. If `.quiver/STOP` or `.quiver/CHECKPOINT_PENDING` exists, stop.
2. Select the **first** task in file order with `status: todo`, all `depends_on` tasks `done`, and either `gate: auto` or a `human-*` gate already approved by the release owner (recorded in the task as `approved_by` and `approved_at`). Open `FIX-NNN` tasks from a checkpoint always come first.
3. Work on branch `task/<id>-<slug>` wearing the `owner` role; reviewers run in a clean context with read-only tools.
4. Update `status` and `attempts` **in the same PR** as the task.
5. Reviewers with a HUMAN GATE role (`legal-advisor`, `external-pentester`, `release-owner`) are people: the routine requests their review on the PR and never simulates their approval.

**Status values**

| Status | Meaning | Who sets it |
|---|---|---|
| `todo` | Not started | Planning |
| `in_progress` | Branch exists, work ongoing | Routine |
| `in_review` | PR open, waiting for reviewers or a human gate | Routine |
| `blocked` | `max_attempts` exceeded, missing external fact, or failed gate; reason in `blocked_reason` | Routine |
| `done` | Merged to `main` | Routine (`auto`) or human (`human-*` gates) |

**Gate values**

| Gate | Merge | Notes |
|---|---|---|
| `auto` | Automatic if every merge condition below holds | On protected paths (project.md §27): `security-engineer` review mandatory (or `tech-lead` + `qa-engineer` when security is the owner) |
| `human-legal` | Human decision; routine only prepares a briefing | Licenses, terms, privacy |
| `human-pentest` | Human commissions and records an external test | Before each public release |
| `human-release` | Human publishes | Releases and phase milestones |

**Merge conditions for `auto` tasks** (all must hold)

- CI green on Linux, macOS and Windows (required checks in project.md §49).
- Every reviewer listed in the task approved.
- On protected paths (project.md §27): `security-engineer` approved, or `tech-lead` + `qa-engineer` when `security-engineer` is the owner.
- No CI check disabled, skipped or weakened in the PR.
- No direct push to `main`, no force push.

**Hard rules for every task**

- Follow the Secure Coding Standard (project.md Part C) and cite the `SC-xx` rules applied in the PR description.
- Do not modify acceptance criteria, `verify` commands or existing tests to make a task pass.
- New dependencies only with written justification in the PR (SC-46) and `security-engineer` review; they are listed in the next checkpoint.
- Keep each PR under ~400 changed lines excluding tests and fixtures; otherwise split into sub-tasks `<id>a`, `<id>b`… and record them here.
- Any fact marked `TO VERIFY` must come from an official source with access date; if not verifiable, set `blocked`.

**Checkpoint every 5 completed tasks** (project.md §27)

After the 5th task merged by the routine since the last checkpoint:

1. Write `docs/checkpoints/CP-NNN.md` using the template below and create `.quiver/CHECKPOINT_PENDING`.
2. Stop. No new task starts until the release owner approves.
3. On `changes_requested`, add `FIX-NNN` tasks (same task format, `phase` = current phase) at the top of section 5 before resuming.

```markdown
# CP-NNN
status: pending            # pending | approved | changes_requested
window: <first task id> … <last task id>
## Tasks and PRs
## Cumulative diff (files, +/- lines per package)
## Protected paths touched (file list + PR links)
## Dependencies added or changed (with justification)
## Guardrail / CI / routine configuration changes
## Security findings (CI, reviewers) and how they were resolved
## Threat model delta
## Pending human decisions
## Open risks
```

---

## 2. Phases

| Phase | Goal | Exit criterion | Tasks |
|---|---|---|---|
| 0 | Foundations, secure primitives, CI | Required checks green on 3 OSes; SC primitives tested | 20 |
| 1 | Skills Hub vertical slice (CLI, local import) | Golden hash vectors identical on 3 OSes | 12 |
| 2 | Git/GitHub sources, provenance, diff | Identical fork recognized; force push quarantined | 8 |
| 3 | Security analysis, trust, cross-skill analysis, SARIF, external scanners, benchmark | 100% malicious fixtures detected; benchmark baseline committed | 16 |
| 4 | Install, sync, lockfile + CI gate, audit, advisories, MCP/plugin, CLI v0.1 release | Pentest passed; CLI v0.1 released | 19 |
| 5 | Design system, Skills Hub Web UI | Pentest passed; Skills Hub v0.2 (Web UI) released | 17 |
| 6 | Orchestrator core | Dev → Test → Review → Commit end-to-end on fixture repo | 14 |
| 7 | Multi-agent, scheduler, Orchestrator UI | Pentest passed; Orchestrator v0.1 released | 12 |
| 8 | Integration Bridge | Pinned skill executed with permission reconciliation and audit | 6 |
| 9 | Ecosystem | Plugin SDK published; registry legal sign-off | 6 |

**Total:** 130 tasks. Phases are sequential: the first task of phase N depends on `P(N-1)-EXIT`.

## 3. Role × phase matrix

Cells show `owned tasks / review participations`. HUMAN GATE roles are people, never simulated.

| Role | P0 | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 |
|---|---|---|---|---|---|---|---|---|---|---|
| `tech-lead` | 6/8 | 0/2 | 1/2 | 0/9 | 0/3 | 0/3 | 1/3 | 0/2 | 1/1 | 2/3 |
| `backend-engineer` | 2/6 | 8/1 | 5/1 | 3/1 | 9/1 | 1/1 | 5/2 | 2/0 | 2/0 | · |
| `security-engineer` | 5/11 | 0/8 | 1/5 | 7/8 | 1/16 | 1/8 | 1/9 | 0/7 | 1/5 | 2/4 |
| `ai-engineer` | · | · | · | 1/2 | 4/0 | · | 5/4 | 3/1 | 0/1 | 0/1 |
| `frontend-engineer` | · | · | · | · | · | 5/5 | · | 2/2 | 1/0 | · |
| `visual-designer` | · | · | · | · | · | 3/1 | · | 1/1 | · | · |
| `ux-designer` | · | 0/3 | 0/1 | 0/2 | 1/4 | 3/9 | 0/1 | 1/4 | 0/1 | · |
| `devops-engineer` | 3/2 | · | · | 0/1 | 2/1 | · | · | · | · | · |
| `qa-engineer` | 1/4 | 3/4 | 1/2 | 4/7 | 0/7 | 1/1 | 2/0 | 1/0 | 1/0 | 0/1 |
| `technical-writer` | 1/1 | 1/0 | · | · | 0/1 | 1/2 | · | 0/1 | · | 0/1 |
| `community-maintainer` | · | · | · | · | · | · | · | · | · | 1/0 |
| `legal-advisor` (HUMAN) | 2/0 | · | 0/1 | 1/0 | · | · | 0/1 | · | · | 0/2 |
| `external-pentester` (HUMAN) | · | · | · | · | 1/0 | 1/0 | · | 1/0 | · | · |
| `release-owner` (HUMAN) | 0/2 | · | · | 0/1 | 1/1 | 1/1 | · | 1/1 | · | 1/0 |

## 4. Human gates (chronological)

| Task | Gate | Decision needed |
|---|---|---|
| P0-T016 | `human-legal` | Legal: Quiver license |
| P0-T019 | `human-legal` | Legal: product name and trademark check |
| P2-T001 | `human-legal` | TO VERIFY: GitHub API limits and terms |
| P3-T004 | `human-legal` | Legal: redistribution policy sign-off |
| P4-T018 | `human-pentest` | External penetration test: CLI, MCP and Action |
| P4-EXIT | `human-release` | Phase 4 exit and CLI v0.1 release |
| P5-T017 | `human-pentest` | External penetration test: Skills Hub Web UI |
| P5-EXIT | `human-release` | Phase 5 exit and Skills Hub v0.2 (Web UI) release |
| P6-T001 | `human-legal` | TO VERIFY: provider terms and CLI permission models |
| P7-T011 | `human-pentest` | External penetration test: Orchestrator |
| P7-EXIT | `human-release` | Phase 7 exit and Orchestrator v0.1 release |
| P9-T003 | `human-legal` | Shared registry design |
| P9-T005 | `human-legal` | Advisory publishing and coordinated disclosure |
| P9-EXIT | `human-release` | Phase 9 exit review |

All other **116 tasks** are `auto`; the release owner reviews them in batches through a **checkpoint every 5 completed tasks** (about 23 checkpoints in total).

---

## 5. Tasks


## Phase 0 — Foundations, secure primitives, CI

**Exit criterion:** Required checks green on 3 OSes; SC primitives tested

### P0-T001 — Monorepo scaffold

```yaml
id: P0-T001
phase: 0
title: "Monorepo scaffold"
owner: tech-lead
reviewers: [devops-engineer, security-engineer]
depends_on: []
gate: auto
status: done
attempts: 1
max_attempts: 3
size: M
spec_refs: ["project.md#45-stack", "project.md#46-monorepo"]
paths: ["package.json", "pnpm-workspace.yaml", "tsconfig.base.json", "packages/*/package.json"]
branch_note: "Developed on claude/stoic-hamilton-3cv6iq per execution-environment constraint (routine may not push to task/* branches)."
merge_note: "Published directly to main on release-owner instruction (2026-10-04), waiving the PR + 3-OS-CI auto-merge gate (project.md §26/§27). Both reviewers (devops-engineer, security-engineer) approved; pnpm install --frozen-lockfile and pnpm typecheck verified locally. PR #2."
```

**Goal:** Create the pnpm workspace with empty packages and strict TypeScript configuration.

**Deliverables:**
- `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json` (SC-01)
- Empty packages listed in project.md §46 with `src/index.ts`
- `.editorconfig`, `.gitattributes` (`* text=auto eol=lf`, fixtures marked `-text`)

**Acceptance criteria:**
- [x] `pnpm install --frozen-lockfile` succeeds
- [x] `pnpm typecheck` passes with `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- [x] Install scripts disabled by default (`.npmrc`), allowlist documented (SC-47)

**Verify:**
```bash
pnpm install --frozen-lockfile
pnpm typecheck
```

**Notes for the agent:** Protected path (package.json). Do not add runtime dependencies yet.

### P0-T002 — TO VERIFY: Node.js LTS and core tool versions

```yaml
id: P0-T002
phase: 0
title: "TO VERIFY: Node.js LTS and core tool versions"
owner: tech-lead
reviewers: [devops-engineer]
depends_on: [P0-T001]
gate: auto
status: in_review
attempts: 1
max_attempts: 3
size: S
spec_refs: ["project.md#61-external-facts-to-verify-to-verify"]
paths: ["docs/adr/0001-stack.md"]
branch_note: "Developed on claude/lucid-sagan-sf4mlr per execution-environment constraint (routine may not push to task/* branches); same precedent as P0-T001."
followup_note: "Transitional engines.node range is '>=22.0.0 <23.0.0 || >=24.0.0 <25.0.0' (admits the Node 22 Maintenance LTS that the current CI/dev/cloud images provide under engine-strict=true, plus the target Node 24 Active LTS; excludes EOL v20/v23 and >=25). When those images ship Node 24, a follow-up must narrow the range to '>=24.0.0 <25.0.0' so engines matches the .nvmrc (24.x) line exactly. Precondition to open that follow-up task: `node -v` on the routine's execution environment reports v24.x. Recorded in docs/adr/0001-stack.md."
```

**Goal:** Verify the current Node.js LTS line and pin it; record the decision.

**Deliverables:**
- `docs/adr/0001-stack.md`
- `.nvmrc` and `engines` field

**Acceptance criteria:**
- [x] ADR cites official sources with access date
- [x] `engines.node` matches `.nvmrc`

**Verify:**
```bash
pnpm typecheck
```

**Notes for the agent:** Use only official sources (nodejs.org release schedule). If unable to verify, set status blocked and explain.

### P0-T003 — Lint, format and security lint rules

```yaml
id: P0-T003
phase: 0
title: "Lint, format and security lint rules"
owner: tech-lead
reviewers: [security-engineer]
depends_on: [P0-T001]
gate: auto
status: in_review
attempts: 1
max_attempts: 3
size: M
spec_refs: ["project.md#28-language-and-type-safety", "project.md#47-boundary-rules-ci-enforced"]
paths: ["eslint.config.js", ".prettierrc"]
branch_note: "Developed on claude/nifty-wozniak-49tysf per execution-environment constraint (routine may not push to task/* branches); same precedent as P0-T001/P0-T002."
toolchain_note: "typescript-eslint cannot be used: the pinned compiler is the native TypeScript 7.0.2 (P0-T002), and typescript-eslint hard-errors with 'does not support TS 7.0' (peer range >=4.8.4 <6.1.0; upstream tracking issue typescript-eslint#10940). To honour the 'ESLint flat config' deliverable without introducing a second, side-by-side TypeScript, the config uses @babel/eslint-parser to parse TS/TSX syntax (no TS compiler API needed). All four required SC rules are enforced syntactically. Recorded in docs/adr/0003-lint-and-format.md."
merge_note: "Auto-merge gate (roadmap §1) not satisfiable yet: no CI workflows exist (they are created by P0-T005/P0-T006), so 'CI green on Linux/macOS/Windows' cannot hold. Verified locally: pnpm lint, pnpm lint:fixtures, pnpm typecheck, pnpm format:check, pnpm install --frozen-lockfile all pass. security-engineer review performed in a clean context (protected paths: package.json, pnpm-lock.yaml). Left in_review for the release owner, same bootstrap precedent as P0-T001/P0-T002."
```

**Goal:** Configure linting so that Secure Coding rules are enforced mechanically.

**Deliverables:**
- ESLint flat config with TypeScript rules
- Rules: no `any` (SC-02), no `eval`/`Function` (SC-03), `node:child_process` restricted to `packages/security` (SC-09), `dangerouslySetInnerHTML` restricted to `apps/web/src/render` (SC-34)
- Prettier config

**Acceptance criteria:**
- [x] `pnpm lint` passes on the scaffold
- [x] A test file using `child_process` outside `packages/security` makes lint fail (committed as a lint fixture under `tests/lint-fixtures`, excluded from build)

**Verify:**
```bash
pnpm lint
```

**Notes for the agent:** New devDependencies require justification in the PR description (SC-46).

### P0-T004 — Package boundary enforcement

```yaml
id: P0-T004
phase: 0
title: "Package boundary enforcement"
owner: tech-lead
reviewers: [backend-engineer]
depends_on: [P0-T003]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#47-boundary-rules-ci-enforced"]
paths: [".dependency-cruiser.cjs"]
```

**Goal:** Fail CI when Skills Hub and Orchestrator packages import each other.

**Deliverables:**
- dependency-cruiser config
- `pnpm boundaries` script

**Acceptance criteria:**
- [ ] A forbidden import in a temporary test case makes `pnpm boundaries` fail
- [ ] No circular dependencies reported

**Verify:**
```bash
pnpm boundaries
```

### P0-T005 — CI pipeline on Linux, macOS, Windows

```yaml
id: P0-T005
phase: 0
title: "CI pipeline on Linux, macOS, Windows"
owner: devops-engineer
reviewers: [security-engineer, tech-lead]
depends_on: [P0-T003, P0-T004]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#49-ci-pipeline-required-checks", "project.md#39-dependencies-and-supply-chain"]
paths: [".github/workflows/ci.yml"]
```

**Goal:** Run lint, typecheck, tests and boundaries on all three operating systems.

**Deliverables:**
- `.github/workflows/ci.yml` with OS matrix
- Actions pinned to commit SHA, `permissions: contents: read` (SC-50)

**Acceptance criteria:**
- [ ] Workflow green on the three OSes
- [ ] No `pull_request_target`
- [ ] Each third-party action pinned by full SHA with version comment

**Verify:**
```bash
pnpm lint && pnpm typecheck && pnpm test
```

**Notes for the agent:** Protected path (.github). Never use secrets in PR-triggered jobs.

### P0-T006 — Security scanning in CI

```yaml
id: P0-T006
phase: 0
title: "Security scanning in CI"
owner: devops-engineer
reviewers: [security-engineer]
depends_on: [P0-T005]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#39-dependencies-and-supply-chain", "project.md#37-secrets-and-logging"]
paths: [".github/workflows/security.yml", ".github/codeql/**", ".semgrep/**", ".gitleaks.toml"]
```

**Goal:** Add secret scanning, dependency scanning, CodeQL, Semgrep and dependency review.

**Deliverables:**
- `security.yml` workflow
- Baseline config files

**Acceptance criteria:**
- [ ] A committed fake token in a test branch is detected by gitleaks (verified locally, not merged)
- [ ] CodeQL and Semgrep run on PRs
- [ ] Dependency review blocks known-vulnerable additions

**Verify:**
```bash
gitleaks detect --no-git -s .
```

**Notes for the agent:** Protected path. Record tool versions in docs/dev/ci.md.

### P0-T007 — CODEOWNERS and branch protection guide

```yaml
id: P0-T007
phase: 0
title: "CODEOWNERS and branch protection guide"
owner: devops-engineer
reviewers: [security-engineer]
depends_on: [P0-T005]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#27-protected-paths-and-checkpoint-reviews-quivers-own-repository"]
paths: [".github/CODEOWNERS", "docs/dev/branch-protection.md"]
```

**Goal:** Configure branch protection compatible with automatic merge and make protected paths visible.

**Deliverables:**
- `CODEOWNERS` covering every path in project.md §27 (used for visibility; code-owner review is NOT required, so auto-merge works)
- Step-by-step guide: PR required, required checks as in §49, no force push, no direct push to main, auto-merge enabled

**Acceptance criteria:**
- [ ] Every §27 path appears in CODEOWNERS
- [ ] Guide lists required checks exactly as in §49
- [ ] Guide states that `Require review from Code Owners` stays disabled

**Verify:**
```bash
pnpm lint
```

**Notes for the agent:** The human must apply the branch protection settings manually once; the routine cannot change repository settings.

### P0-T008 — Contracts package foundation

```yaml
id: P0-T008
phase: 0
title: "Contracts package foundation"
owner: tech-lead
reviewers: [backend-engineer, security-engineer]
depends_on: [P0-T003]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#29-input-validation", "project.md#8-skills-hub--data-model"]
paths: ["packages/contracts/src/**"]
```

**Goal:** Create shared primitives: UUIDv7, hashes, slugs, bounded strings, Result type, error codes.

**Deliverables:**
- Zod schemas for primitives with `.strict()` objects and length limits (SC-06, SC-07)
- Error code enum aligned with CLI exit codes (project.md §17)
- JSON Schema generation script

**Acceptance criteria:**
- [ ] Every string schema has a max length (test enumerates schemas)
- [ ] Generated JSON Schemas committed and up to date (CI check)

**Verify:**
```bash
pnpm --filter @quiver/contracts test
```

### P0-T009 — safeExec process wrapper

```yaml
id: P0-T009
phase: 0
title: "safeExec process wrapper"
owner: security-engineer
reviewers: [backend-engineer, qa-engineer, tech-lead]
depends_on: [P0-T008]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#30-process-execution"]
paths: ["packages/security/src/exec/**"]
```

**Goal:** Single, safe entry point for running external processes.

**Deliverables:**
- `safeExec(cmd, args, opts)` using spawn with argument arrays, no shell (SC-10)
- Env allowlist (SC-12), timeout, max output, process-group kill (SC-13)

**Acceptance criteria:**
- [ ] Tests prove shell metacharacters in args are not interpreted
- [ ] Timeout kills child and grandchildren (Linux/macOS); documented behavior on Windows
- [ ] Output beyond limit is truncated and flagged

**Verify:**
```bash
pnpm --filter @quiver/security test
```

**Notes for the agent:** Protected path. Use node:child_process only here.

### P0-T010 — resolveWithin and safe filesystem helpers

```yaml
id: P0-T010
phase: 0
title: "resolveWithin and safe filesystem helpers"
owner: security-engineer
reviewers: [backend-engineer, qa-engineer, tech-lead]
depends_on: [P0-T008]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#31-filesystem"]
paths: ["packages/security/src/fs/**"]
```

**Goal:** Path and filesystem primitives that make traversal and link attacks impossible by construction.

**Deliverables:**
- `resolveWithin(root, rel)` (SC-14)
- `walkNoFollow(root, limits)` using lstat (SC-15)
- `makePrivateTempDir()` (SC-17)
- `atomicWrite(path, data)` (SC-19)

**Acceptance criteria:**
- [ ] Property tests: no generated relative path escapes root
- [ ] Symlink, hardlink-to-outside and FIFO cases rejected
- [ ] Atomic write never leaves partial file (simulated crash test)

**Verify:**
```bash
pnpm --filter @quiver/security test
```

**Notes for the agent:** Protected path. Windows: test junctions and reserved names (CON, NUL).

### P0-T011 — Logging with redaction

```yaml
id: P0-T011
phase: 0
title: "Logging with redaction"
owner: security-engineer
reviewers: [backend-engineer, tech-lead, qa-engineer]
depends_on: [P0-T008]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#37-secrets-and-logging"]
paths: ["packages/security/src/log/**"]
```

**Goal:** Structured logger that cannot write known secret patterns.

**Deliverables:**
- JSON logger with redaction layer (SC-38)
- Error formatter for user-facing messages (SC-39)

**Acceptance criteria:**
- [ ] Tokens of known formats and Authorization headers are masked in tests
- [ ] User-facing errors contain no stack traces

**Verify:**
```bash
pnpm --filter @quiver/security test
```

**Notes for the agent:** Protected path.

### P0-T012 — URL policy (SSRF guard)

```yaml
id: P0-T012
phase: 0
title: "URL policy (SSRF guard)"
owner: security-engineer
reviewers: [backend-engineer, qa-engineer, tech-lead]
depends_on: [P0-T008]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#35-network-and-urls"]
paths: ["packages/security/src/net/**"]
```

**Goal:** Validate outbound URLs and resolved IPs before any request.

**Deliverables:**
- `checkUrl(url, policy)` (SC-29)
- IP range checks incl. IPv6, IPv4-mapped IPv6, metadata ranges (SC-30)
- Fetch wrapper with timeout, size limit, redirect re-check (SC-31)

**Acceptance criteria:**
- [ ] Tests reject http, file, private, loopback, link-local and 169.254.169.254 targets
- [ ] Redirect to a private IP is rejected

**Verify:**
```bash
pnpm --filter @quiver/security test
```

**Notes for the agent:** Protected path.

### P0-T013 — Config loader and data directory

```yaml
id: P0-T013
phase: 0
title: "Config loader and data directory"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P0-T010, P0-T011]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#31-filesystem"]
paths: ["packages/contracts/src/config/**", "apps/cli/src/config/**"]
```

**Goal:** Load and validate Quiver configuration; create ~/.quiver with safe permissions.

**Deliverables:**
- Config schema (strict)
- Data dir creation `0700`, files `0600` on POSIX (SC-18)

**Acceptance criteria:**
- [ ] Invalid config fails with exit code 2 and a clear message
- [ ] Permissions verified in tests on POSIX

**Verify:**
```bash
pnpm --filter @quiver/cli test
```

### P0-T014 — SQLite database and migrations

```yaml
id: P0-T014
phase: 0
title: "SQLite database and migrations"
owner: backend-engineer
reviewers: [security-engineer, tech-lead]
depends_on: [P0-T013]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#32-data-storage"]
paths: ["packages/database/**"]
```

**Goal:** Database access layer with prepared statements and versioned migrations.

**Deliverables:**
- SQLite driver choice recorded in ADR
- Migration runner (forward-only), first empty migration
- Repository helpers using parameters only (SC-21)

**Acceptance criteria:**
- [ ] Lint/test forbids string-built SQL
- [ ] Migrations tested on empty and populated DB (SC-22)

**Verify:**
```bash
pnpm --filter @quiver/database test
```

**Notes for the agent:** Adds a native dependency: justify it in the PR (SC-46); flagged in the next checkpoint.

### P0-T015 — TO VERIFY: keychain library

```yaml
id: P0-T015
phase: 0
title: "TO VERIFY: keychain library"
owner: security-engineer
reviewers: [tech-lead]
depends_on: [P0-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#37-secrets-and-logging", "project.md#60-open-decisions"]
paths: ["docs/adr/0005-keychain.md"]
```

**Goal:** Select a maintained cross-platform OS keychain library (OD-7).

**Deliverables:**
- ADR comparing candidates: maintenance, platform support, license, native build

**Acceptance criteria:**
- [ ] ADR cites official repos and access date
- [ ] Decision or explicit fallback documented

**Verify:**
```bash
pnpm lint
```

### P0-T016 — Legal: Quiver license

```yaml
id: P0-T016
phase: 0
title: "Legal: Quiver license"
owner: legal-advisor
reviewers: [release-owner]
depends_on: [P0-T001]
gate: human-legal
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#60-open-decisions"]
paths: ["LICENSE", "docs/adr/0006-license.md"]
```

**Goal:** Choose Quiver's own license (OD-6).

**Deliverables:**
- Briefing document prepared by tech-lead: options, implications for contributors and redistribution
- Human decision recorded

**Acceptance criteria:**
- [ ] LICENSE file committed by a human
- [ ] ADR records decision and rationale

**Verify:**
```bash
test -f LICENSE
```

**Notes for the agent:** Automation only prepares the briefing; it must not choose the license.

### P0-T017 — SECURITY.md and contribution basics

```yaml
id: P0-T017
phase: 0
title: "SECURITY.md and contribution basics"
owner: technical-writer
reviewers: [security-engineer]
depends_on: [P0-T016]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#25-vulnerability-disclosure"]
paths: ["SECURITY.md", "CONTRIBUTING.md", "README.md"]
```

**Goal:** Publish the disclosure policy and minimal contributor guide, including the Secure Coding Standard reference.

**Deliverables:**
- `SECURITY.md`
- `CONTRIBUTING.md` (link to Part C)
- README skeleton

**Acceptance criteria:**
- [ ] Disclosure channel and response targets stated
- [ ] CONTRIBUTING requires SC-xx references in security-relevant PRs

**Verify:**
```bash
pnpm lint
```

### P0-T018 — Initial ADRs

```yaml
id: P0-T018
phase: 0
title: "Initial ADRs"
owner: tech-lead
reviewers: [technical-writer, security-engineer]
depends_on: [P0-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#51-adrs"]
paths: ["docs/adr/**"]
```

**Goal:** Record foundational decisions.

**Deliverables:**
- ADR template
- ADRs: canonical hash, storage layout, secure coding standard

**Acceptance criteria:**
- [ ] Each ADR has context, decision, consequences, alternatives

**Verify:**
```bash
pnpm lint
```

### P0-T019 — Legal: product name and trademark check

```yaml
id: P0-T019
phase: 0
title: "Legal: product name and trademark check"
owner: legal-advisor
reviewers: [release-owner]
depends_on: [P0-T001]
gate: human-legal
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#60-open-decisions"]
paths: ["docs/adr/0014-name.md"]
```

**Goal:** Confirm that "Quiver" can be used (npm package, GitHub organization, trademarks) before anything is published (OD-9).

**Deliverables:**
- Briefing prepared by tech-lead: npm and GitHub availability, similar product names, alternatives
- Human decision recorded

**Acceptance criteria:**
- [ ] ADR records the final name and npm scope
- [ ] If the name changes, a FIX task is created to rename packages before Phase 4

**Verify:**
```bash
test -f docs/adr/0014-name.md
```

**Notes for the agent:** Automation only collects facts from official registries; it must not decide the name.

### P0-EXIT — Phase 0 exit review

```yaml
id: P0-EXIT
phase: 0
title: "Phase 0 exit review"
owner: qa-engineer
reviewers: [tech-lead, security-engineer]
depends_on: [P0-T004, P0-T006, P0-T007, P0-T009, P0-T010, P0-T011, P0-T012, P0-T014, P0-T015, P0-T016, P0-T017, P0-T018, P0-T019]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#59-phases"]
paths: ["docs/phases/phase-0.md"]
```

**Goal:** Confirm Phase 0 exit criterion and update the threat model.

**Deliverables:**
- Phase report: checks, coverage, open issues, threat model delta

**Acceptance criteria:**
- [ ] All required checks green on 3 OSes
- [ ] Every SC rule from §30–§31, §35, §37 has a test or lint rule

**Verify:**
```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm boundaries
```


## Phase 1 — Skills Hub vertical slice (CLI, local import)

**Exit criterion:** Golden hash vectors identical on 3 OSes

### P1-T001 — Skill fixture corpus

```yaml
id: P1-T001
phase: 1
title: "Skill fixture corpus"
owner: qa-engineer
reviewers: [security-engineer]
depends_on: [P0-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#48-testing-strategy", "project.md#10-canonical-content-hash-hashversion-1"]
paths: ["tests/fixtures/skills/**"]
```

**Goal:** Benign and adversarial skills used by all later tests.

**Deliverables:**
- Benign: minimal, with scripts, with binary asset, CRLF variant
- Adversarial: symlink, `..` path, case collision, huge file, deep nesting, NUL in name, invalid UTF-8 name, bidi in SKILL.md
- `tests/fixtures/README.md` describing each fixture

**Acceptance criteria:**
- [ ] Fixtures created by a generator script (symlinks cannot be committed reliably on Windows)
- [ ] Generator is deterministic

**Verify:**
```bash
pnpm fixtures:generate && git diff --exit-code tests/fixtures
```

**Notes for the agent:** Fixtures must be inert: no real exploit payloads, no real secrets.

### P1-T002 — Safe ingestion of local directories

```yaml
id: P1-T002
phase: 1
title: "Safe ingestion of local directories"
owner: backend-engineer
reviewers: [security-engineer, qa-engineer]
depends_on: [P1-T001]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#10-canonical-content-hash-hashversion-1", "project.md#31-filesystem"]
paths: ["packages/skill-engine/src/ingest/**"]
```

**Goal:** Copy a local skill into an isolated cache, rejecting anything unsafe.

**Deliverables:**
- `ingestLocal(path, limits)` using `walkNoFollow` and `resolveWithin`
- Configurable limits: files, file size, total size, depth

**Acceptance criteria:**
- [ ] All adversarial fixtures rejected with specific error codes
- [ ] Nothing in the skill is executed (test with a script that would create a marker file)

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

**Notes for the agent:** Protected path.

### P1-T003 — Canonical content hash v1

```yaml
id: P1-T003
phase: 1
title: "Canonical content hash v1"
owner: backend-engineer
reviewers: [security-engineer, qa-engineer]
depends_on: [P1-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#10-canonical-content-hash-hashversion-1"]
paths: ["packages/skill-engine/src/hash/**"]
```

**Goal:** Implement hashVersion 1 exactly as specified.

**Deliverables:**
- Normalization (NFC, CRLF→LF for text, modes)
- JCS serialization
- `computeContentHash(tree)`

**Acceptance criteria:**
- [ ] CRLF and LF variants produce the same hash
- [ ] One changed byte changes the hash
- [ ] File ordering on disk does not matter
- [ ] Property test: hash is deterministic over 1,000 random trees

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

**Notes for the agent:** Protected path. Use a well-tested JCS implementation or implement with RFC 8785 test vectors.

### P1-T004 — Golden hash vectors cross-platform

```yaml
id: P1-T004
phase: 1
title: "Golden hash vectors cross-platform"
owner: qa-engineer
reviewers: [backend-engineer, security-engineer]
depends_on: [P1-T003]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#10-canonical-content-hash-hashversion-1"]
paths: ["tests/golden/**"]
```

**Goal:** Freeze expected hashes for fixtures and check them on all OSes.

**Deliverables:**
- `tests/golden/hashes.json`
- Test comparing computed vs golden

**Acceptance criteria:**
- [ ] CI green on Linux, macOS, Windows with identical values

**Verify:**
```bash
pnpm test:golden
```

**Notes for the agent:** Golden values may only change together with a new hashVersion (enforced by test comment + review).

### P1-T005 — Content-addressed store

```yaml
id: P1-T005
phase: 1
title: "Content-addressed store"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P1-T003]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#10-canonical-content-hash-hashversion-1", "project.md#14-upstream-sync-diff-install"]
paths: ["packages/skill-engine/src/store/**"]
```

**Goal:** Store original file bytes by blob hash and re-verify on every read (project.md §10 storage fidelity).

**Deliverables:**
- `putSnapshot`, `getSnapshot` with atomic writes
- Blob store keyed by `blobSha256` of original bytes; manifest records `sha256` and `blobSha256`
- Verification on read

**Acceptance criteria:**
- [ ] Tampered blob is detected and reported
- [ ] Duplicate blobs stored once
- [ ] A CRLF `.bat` fixture is returned byte-identical (not normalized)
- [ ] CRLF and LF variants share contentHash but keep separate blobs

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

### P1-T006 — SKILL.md frontmatter parser

```yaml
id: P1-T006
phase: 1
title: "SKILL.md frontmatter parser"
owner: backend-engineer
reviewers: [security-engineer, qa-engineer]
depends_on: [P1-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#33-parsing-untrusted-formats"]
paths: ["packages/skill-engine/src/manifest/**"]
```

**Goal:** Parse SKILL.md and .quiver/skill.json safely.

**Deliverables:**
- Bounded frontmatter splitter (SC-24)
- YAML core schema, alias limit
- Zod schemas for both formats
- Size limits before parsing (SC-26)

**Acceptance criteria:**
- [ ] YAML alias bomb rejected within time budget
- [ ] `---js` frontmatter treated as invalid, never evaluated
- [ ] Fuzz test with fast-check (SC-28)

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

**Notes for the agent:** Protected-grade logic: parser of untrusted input and new dependency (yaml). Do not use libraries that support executable frontmatter engines.

### P1-T007 — Skills Hub schema and repositories

```yaml
id: P1-T007
phase: 1
title: "Skills Hub schema and repositories"
owner: backend-engineer
reviewers: [tech-lead]
depends_on: [P0-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#8-skills-hub--data-model"]
paths: ["packages/database/migrations/**", "packages/skill-engine/src/repo/**"]
```

**Goal:** Persist SkillRecord, SkillSource, SkillSnapshot.

**Deliverables:**
- Migration
- Repositories with prepared statements

**Acceptance criteria:**
- [ ] Round-trip tests for each entity
- [ ] Snapshots immutable (update rejected at repository level)

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

### P1-T008 — CLI skeleton with safe output

```yaml
id: P1-T008
phase: 1
title: "CLI skeleton with safe output"
owner: backend-engineer
reviewers: [security-engineer, ux-designer]
depends_on: [P0-T013]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#17-interfaces", "project.md#36-output-handling"]
paths: ["apps/cli/src/**"]
```

**Goal:** Commander-based CLI with --json, exit codes and terminal sanitization.

**Deliverables:**
- Root command, help, version
- `printUntrusted()` stripping control/ANSI and showing bidi (SC-33)
- Exit codes per §17

**Acceptance criteria:**
- [ ] ANSI escape in a skill name is neutralized in output tests
- [ ] `--json` output validates against schema

**Verify:**
```bash
pnpm --filter @quiver/cli test
```

### P1-T009 — `quiver skills import` (local)

```yaml
id: P1-T009
phase: 1
title: "`quiver skills import` (local)"
owner: backend-engineer
reviewers: [qa-engineer]
depends_on: [P1-T005, P1-T006, P1-T007, P1-T008]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#7-skills-hub--lifecycle"]
paths: ["apps/cli/src/commands/skills/import.ts", "packages/skill-engine/src/import/**"]
```

**Goal:** End-to-end local import producing an INSPECTED snapshot.

**Deliverables:**
- Command and service
- Re-import of unchanged content creates no new snapshot

**Acceptance criteria:**
- [ ] Import → snapshot with correct hash
- [ ] Changed content → new snapshot, old kept

**Verify:**
```bash
pnpm --filter @quiver/cli test
```

### P1-T010 — `skills inspect` and `skills history`

```yaml
id: P1-T010
phase: 1
title: "`skills inspect` and `skills history`"
owner: backend-engineer
reviewers: [ux-designer]
depends_on: [P1-T009]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#17-interfaces"]
paths: ["apps/cli/src/commands/skills/**"]
```

**Goal:** Show snapshot details and history without installing anything.

**Deliverables:**
- Two commands with human and JSON output

**Acceptance criteria:**
- [ ] Hashes shown shortened and copyable in full with --json
- [ ] Invisible characters flagged in output

**Verify:**
```bash
pnpm --filter @quiver/cli test
```

### P1-T011 — User guide: Phase 1

```yaml
id: P1-T011
phase: 1
title: "User guide: Phase 1"
owner: technical-writer
reviewers: [ux-designer]
depends_on: [P1-T010]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#58-roles"]
paths: ["docs/user/skills-hub-cli.md"]
```

**Goal:** Document import, inspect, history with examples.

**Deliverables:**
- CLI guide

**Acceptance criteria:**
- [ ] Every command has an example
- [ ] Every error code explained

**Verify:**
```bash
pnpm lint
```

### P1-EXIT — Phase 1 exit review

```yaml
id: P1-EXIT
phase: 1
title: "Phase 1 exit review"
owner: qa-engineer
reviewers: [tech-lead, security-engineer]
depends_on: [P1-T004, P1-T010, P1-T011]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#59-phases"]
paths: ["docs/phases/phase-1.md"]
```

**Goal:** Verify golden vectors and update the threat model.

**Deliverables:**
- Phase report

**Acceptance criteria:**
- [ ] Golden vectors identical on 3 OSes
- [ ] All adversarial fixtures rejected

**Verify:**
```bash
pnpm test && pnpm test:golden
```


## Phase 2 — Git/GitHub sources, provenance, diff

**Exit criterion:** Identical fork recognized; force push quarantined

### P2-T001 — TO VERIFY: GitHub API limits and terms

```yaml
id: P2-T001
phase: 2
title: "TO VERIFY: GitHub API limits and terms"
owner: tech-lead
reviewers: [legal-advisor]
depends_on: [P1-EXIT]
gate: human-legal
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#43-github-api"]
paths: ["docs/adr/0007-github-api.md"]
```

**Goal:** Document current rate limits, conditional requests and terms relevant to indexing.

**Deliverables:**
- ADR with official sources and access date

**Acceptance criteria:**
- [ ] Legal advisor sign-off recorded

**Verify:**
```bash
pnpm lint
```

### P2-T002 — Hardened Git execution profile

```yaml
id: P2-T002
phase: 2
title: "Hardened Git execution profile"
owner: security-engineer
reviewers: [backend-engineer, qa-engineer, tech-lead]
depends_on: [P1-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#34-git-hardening-profile"]
paths: ["packages/git/src/exec/**"]
```

**Goal:** Run Git on untrusted repositories with hooks, submodules and unsafe transports disabled.

**Deliverables:**
- `gitUntrusted(args)` on top of `safeExec`
- TO VERIFY each flag against supported Git versions; record in docs/dev/git.md

**Acceptance criteria:**
- [ ] Fixture repo with a malicious hook: hook never runs
- [ ] `file://` and `ext::` URLs refused
- [ ] Submodules not fetched

**Verify:**
```bash
pnpm --filter @quiver/git test
```

**Notes for the agent:** Protected path.

### P2-T003 — GitHub API client

```yaml
id: P2-T003
phase: 2
title: "GitHub API client"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P2-T001, P0-T012]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#43-github-api", "project.md#35-network-and-urls"]
paths: ["packages/skill-sources/src/github/client/**"]
```

**Goal:** Minimal client with ETag caching, backoff and validated responses.

**Deliverables:**
- Client using the URL-policy fetch wrapper
- Zod validation of every response (SC-05)

**Acceptance criteria:**
- [ ] Rate-limit responses trigger backoff in tests (mocked)
- [ ] Malformed API responses rejected

**Verify:**
```bash
pnpm --filter @quiver/skill-sources test
```

### P2-T004 — Git and GitHub skill sources

```yaml
id: P2-T004
phase: 2
title: "Git and GitHub skill sources"
owner: backend-engineer
reviewers: [security-engineer, qa-engineer]
depends_on: [P2-T002, P2-T003]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#8-skills-hub--data-model"]
paths: ["packages/skill-sources/src/**"]
```

**Goal:** Import skills from a repository, including skills in subfolders.

**Deliverables:**
- `SkillSourceAdapter` interface
- git and github adapters

**Acceptance criteria:**
- [ ] Repository with multiple skills discovered correctly
- [ ] Content flows through the same ingestion and hash path as local

**Verify:**
```bash
pnpm --filter @quiver/skill-sources test
```

### P2-T005 — Provenance and relations

```yaml
id: P2-T005
phase: 2
title: "Provenance and relations"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P2-T004]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#8-skills-hub--data-model", "project.md#13-trust-model"]
paths: ["packages/skill-engine/src/provenance/**"]
```

**Goal:** Track ownerId/repositoryId and classify fork/mirror/copy with evidence.

**Deliverables:**
- Relation classifier with confidence and evidence

**Acceptance criteria:**
- [ ] Identical content from a fork recognized with high confidence
- [ ] Owner rename does not create a new source

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

### P2-T006 — Ancestry check and ownership change detection

```yaml
id: P2-T006
phase: 2
title: "Ancestry check and ownership change detection"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P2-T005]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install", "project.md#19-threat-model-stride-oriented"]
paths: ["packages/skill-engine/src/provenance/ancestry/**"]
```

**Goal:** Detect force pushes and ownership changes (T3, T4).

**Deliverables:**
- Ancestry verification
- Ownership change detector

**Acceptance criteria:**
- [ ] Rewritten history → snapshot QUARANTINED
- [ ] Changed ownerId → alert + quarantine

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

**Notes for the agent:** Security-relevant decision logic.

### P2-T007 — `quiver skills diff`

```yaml
id: P2-T007
phase: 2
title: "`quiver skills diff`"
owner: backend-engineer
reviewers: [ux-designer]
depends_on: [P2-T005]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["packages/skill-engine/src/diff/**", "apps/cli/src/commands/skills/diff.ts"]
```

**Goal:** Compare two snapshots: files, capabilities, license, risk, provenance.

**Deliverables:**
- Diff service and command

**Acceptance criteria:**
- [ ] Added/removed/modified files reported
- [ ] Output sanitized for terminal

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

### P2-EXIT — Phase 2 exit review

```yaml
id: P2-EXIT
phase: 2
title: "Phase 2 exit review"
owner: qa-engineer
reviewers: [tech-lead, security-engineer]
depends_on: [P2-T006, P2-T007]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#59-phases"]
paths: ["docs/phases/phase-2.md"]
```

**Goal:** Verify exit criterion and update threat model.

**Deliverables:**
- Phase report

**Acceptance criteria:**
- [ ] Identical fork recognized
- [ ] Force push quarantined

**Verify:**
```bash
pnpm test
```


## Phase 3 — Security analysis, trust, cross-skill analysis, SARIF, external scanners, benchmark

**Exit criterion:** 100% malicious fixtures detected; benchmark baseline committed

### P3-T001 — Scanner framework and finding schema

```yaml
id: P3-T001
phase: 3
title: "Scanner framework and finding schema"
owner: security-engineer
reviewers: [tech-lead, ai-engineer, qa-engineer]
depends_on: [P2-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#11-analysis-pipeline"]
paths: ["packages/skill-scanner/src/core/**"]
```

**Goal:** Analyzer plugin interface with time and size budgets.

**Deliverables:**
- `Analyzer` interface, `Finding` schema with evidence
- Budget enforcement producing `analysis_incomplete`

**Acceptance criteria:**
- [ ] Analyzer exceeding budget yields analysis_incomplete, never pass

**Verify:**
```bash
pnpm --filter @quiver/skill-scanner test
```

**Notes for the agent:** Protected path.

### P3-T002 — Malicious fixture set for scanning

```yaml
id: P3-T002
phase: 3
title: "Malicious fixture set for scanning"
owner: qa-engineer
reviewers: [security-engineer]
depends_on: [P3-T001]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#48-testing-strategy"]
paths: ["tests/fixtures/skills/malicious/**"]
```

**Goal:** Inert fixtures that simulate each threat the scanner must detect.

**Deliverables:**
- Fixtures for: network exfiltration, `curl|sh`, base64-exec, credential file reads, hardcoded fake secret, hidden Unicode instructions, HTML-comment injection, undeclared capabilities
- Expected findings file

**Acceptance criteria:**
- [ ] Each fixture documented with the threat ID it simulates

**Verify:**
```bash
pnpm fixtures:generate
```

**Notes for the agent:** Payloads must be non-functional (fake hosts like example.invalid, fake tokens).

### P3-T003 — License detection

```yaml
id: P3-T003
phase: 3
title: "License detection"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P3-T001]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#41-licenses-and-redistribution"]
paths: ["packages/skill-scanner/src/license/**"]
```

**Goal:** Detect license, SPDX ID and confidence per snapshot.

**Deliverables:**
- LicenseSnapshot creation

**Acceptance criteria:**
- [ ] MIT, Apache-2.0, GPL-3.0 fixtures identified
- [ ] No license → `redistribution: denied`

**Verify:**
```bash
pnpm --filter @quiver/skill-scanner test
```

### P3-T004 — Legal: redistribution policy sign-off

```yaml
id: P3-T004
phase: 3
title: "Legal: redistribution policy sign-off"
owner: legal-advisor
reviewers: [release-owner]
depends_on: [P3-T003]
gate: human-legal
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#41-licenses-and-redistribution"]
paths: ["docs/legal/redistribution.md"]
```

**Goal:** Confirm the redistribution table and rules.

**Deliverables:**
- Briefing prepared by tech-lead
- Human decision recorded

**Acceptance criteria:**
- [ ] Signed-off document committed by a human

**Verify:**
```bash
test -f docs/legal/redistribution.md
```

### P3-T005 — Script static analysis

```yaml
id: P3-T005
phase: 3
title: "Script static analysis"
owner: security-engineer
reviewers: [qa-engineer, backend-engineer, tech-lead]
depends_on: [P3-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#12-capabilities-and-risk"]
paths: ["packages/skill-scanner/src/scripts/**"]
```

**Goal:** Detect dangerous patterns in Python, shell, JS/TS and PowerShell.

**Deliverables:**
- Analyzers per language with evidence (file, line, match)

**Acceptance criteria:**
- [ ] All script-related malicious fixtures detected
- [ ] No regex with catastrophic backtracking (SC-27 tests)

**Verify:**
```bash
pnpm --filter @quiver/skill-scanner test
```

**Notes for the agent:** Split into one PR per language (sub-IDs P3-T005a..d) if the change exceeds ~400 lines.

### P3-T006 — Secret scanning of skills

```yaml
id: P3-T006
phase: 3
title: "Secret scanning of skills"
owner: security-engineer
reviewers: [qa-engineer, tech-lead]
depends_on: [P3-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#12-capabilities-and-risk"]
paths: ["packages/skill-scanner/src/secrets/**"]
```

**Goal:** Find hardcoded credentials in skill content.

**Deliverables:**
- Secret analyzer with redacted evidence

**Acceptance criteria:**
- [ ] Fake secret fixture detected
- [ ] Evidence never contains the full secret

**Verify:**
```bash
pnpm --filter @quiver/skill-scanner test
```

### P3-T007 — Prompt-injection heuristics

```yaml
id: P3-T007
phase: 3
title: "Prompt-injection heuristics"
owner: ai-engineer
reviewers: [security-engineer, ux-designer]
depends_on: [P3-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#22-prompt-and-skill-injection"]
paths: ["packages/skill-scanner/src/injection/**"]
```

**Goal:** Flag hidden or manipulative instructions.

**Deliverables:**
- Detectors for invisible Unicode, bidi controls, HTML comments, override phrases, exfiltration URLs, base64 blobs

**Acceptance criteria:**
- [ ] All injection fixtures detected
- [ ] Findings labeled heuristic

**Verify:**
```bash
pnpm --filter @quiver/skill-scanner test
```

### P3-T008 — Capability inference

```yaml
id: P3-T008
phase: 3
title: "Capability inference"
owner: security-engineer
reviewers: [ai-engineer, tech-lead, qa-engineer]
depends_on: [P3-T005]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#12-capabilities-and-risk"]
paths: ["packages/skill-scanner/src/capabilities/**"]
```

**Goal:** Infer capabilities and compare with declared ones.

**Deliverables:**
- Inference from analyzer findings
- Undeclared-capability finding

**Acceptance criteria:**
- [ ] Undeclared network.access fixture produces a finding

**Verify:**
```bash
pnpm --filter @quiver/skill-scanner test
```

### P3-T009 — Risk model

```yaml
id: P3-T009
phase: 3
title: "Risk model"
owner: security-engineer
reviewers: [ux-designer, tech-lead, qa-engineer]
depends_on: [P3-T006, P3-T007, P3-T008]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#12-capabilities-and-risk"]
paths: ["packages/skill-scanner/src/risk/**"]
```

**Goal:** Per-dimension risk with evidence; optional overall summary.

**Deliverables:**
- Risk computation and documented rules

**Acceptance criteria:**
- [ ] Every risk level links to evidence
- [ ] Rules documented in docs/dev/risk-model.md

**Verify:**
```bash
pnpm --filter @quiver/skill-scanner test
```

### P3-T010 — Trust assertions, quarantine and revocation

```yaml
id: P3-T010
phase: 3
title: "Trust assertions, quarantine and revocation"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P3-T009]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#13-trust-model"]
paths: ["packages/skill-engine/src/trust/**"]
```

**Goal:** Content vs source trust, state machine, revocation.

**Deliverables:**
- Trust service and state machine
- `quiver skills verify`

**Acceptance criteria:**
- [ ] Trust never applied to a different hash
- [ ] Quarantined snapshot cannot be marked VERIFIED without explicit override recorded

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

**Notes for the agent:** Security decision logic.

### P3-T011 — Parser and analyzer fuzzing

```yaml
id: P3-T011
phase: 3
title: "Parser and analyzer fuzzing"
owner: qa-engineer
reviewers: [security-engineer]
depends_on: [P3-T009]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#33-parsing-untrusted-formats"]
paths: ["tests/fuzz/**"]
```

**Goal:** Property-based tests on all untrusted-input code paths.

**Deliverables:**
- fast-check suites for manifest, analyzers, URL policy

**Acceptance criteria:**
- [ ] No crash or timeout over configured iterations

**Verify:**
```bash
pnpm test:fuzz
```

### P3-T012 — Cross-skill toxic combination analysis

```yaml
id: P3-T012
phase: 3
title: "Cross-skill toxic combination analysis"
owner: security-engineer
reviewers: [tech-lead, qa-engineer]
depends_on: [P3-T008]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#12-capabilities-and-risk"]
paths: ["packages/skill-scanner/src/combinations/**", "tests/fixtures/skills/combinations/**"]
```

**Goal:** Detect risky capability combinations across skills installed together or assigned to the same agent.

**Deliverables:**
- Combination rules with documented rationale
- Fixture pairs: each skill clean alone, toxic together; plus a benign pair

**Acceptance criteria:**
- [ ] Toxic pairs produce a finding with evidence from both skills
- [ ] Benign pair produces no combination finding
- [ ] Rules documented in docs/dev/risk-model.md

**Verify:**
```bash
pnpm --filter @quiver/skill-scanner test
```

**Notes for the agent:** Protected path.

### P3-T013 — SARIF export

```yaml
id: P3-T013
phase: 3
title: "SARIF export"
owner: backend-engineer
reviewers: [security-engineer, devops-engineer]
depends_on: [P3-T009]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["packages/skill-scanner/src/report/sarif/**"]
```

**Goal:** Export any scan result as SARIF for GitHub code scanning.

**Deliverables:**
- `quiver skills scan --format sarif`
- Mapping of findings to SARIF rules and locations

**Acceptance criteria:**
- [ ] Output validates against the SARIF 2.1.0 JSON schema
- [ ] Secrets in evidence remain redacted in SARIF

**Verify:**
```bash
pnpm --filter @quiver/skill-scanner test
```

**Notes for the agent:** Protected path. TO VERIFY: current SARIF schema version accepted by GitHub.

### P3-T014 — External scanner plugins (opt-in)

```yaml
id: P3-T014
phase: 3
title: "External scanner plugins (opt-in)"
owner: security-engineer
reviewers: [tech-lead, qa-engineer]
depends_on: [P3-T001]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install", "project.md#19-threat-model-stride-oriented"]
paths: ["packages/skill-scanner/src/external/**", "docs/adr/0012-external-scanners.md"]
```

**Goal:** Run third-party skill scanners as optional ScannerPlugins without weakening Quiver's guarantees.

**Deliverables:**
- `ScannerPlugin` adapter for external CLIs through safeExec
- ADR: candidate scanners, licenses, output formats, data sent to remote services (TO VERIFY with official sources)
- Opt-in config with explicit notice for data-sharing scanners

**Acceptance criteria:**
- [ ] Disabled by default; enabling a data-sharing scanner requires an explicit config flag and prints what is sent
- [ ] External output validated by schema; malformed output ignored with a warning
- [ ] External results can add findings but cannot remove findings or change trust (test)

**Verify:**
```bash
pnpm --filter @quiver/skill-scanner test
```

**Notes for the agent:** Protected path. Never install external scanners automatically.

### P3-T015 — Public detection benchmark

```yaml
id: P3-T015
phase: 3
title: "Public detection benchmark"
owner: qa-engineer
reviewers: [security-engineer, tech-lead]
depends_on: [P3-T012, P3-T014]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#48-testing-strategy"]
paths: ["benchmark/**", "docs/benchmark.md"]
```

**Goal:** Reproducible corpus and script that measure precision and recall of the scanner.

**Deliverables:**
- Inert benign and malicious corpus with labels and threat IDs
- `pnpm benchmark` producing a JSON + Markdown report
- Optional comparison with external scanners only where their license and terms allow it (TO VERIFY)

**Acceptance criteria:**
- [ ] Same input produces identical results across runs
- [ ] Report includes per-threat precision/recall and false positives
- [ ] CI fails if recall drops versus the committed baseline

**Verify:**
```bash
pnpm benchmark
```

**Notes for the agent:** No real malware, real secrets or third-party skill content without a redistribution-compatible license.

### P3-EXIT — Phase 3 exit review

```yaml
id: P3-EXIT
phase: 3
title: "Phase 3 exit review"
owner: qa-engineer
reviewers: [security-engineer, tech-lead]
depends_on: [P3-T004, P3-T010, P3-T011, P3-T012, P3-T013, P3-T014, P3-T015]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#59-phases"]
paths: ["docs/phases/phase-3.md"]
```

**Goal:** Verify 100% detection on malicious fixtures; set OD-3 threshold proposal.

**Deliverables:**
- Phase report incl. detection table

**Acceptance criteria:**
- [ ] 100% expected findings, including toxic combinations
- [ ] OD-3 proposal documented

**Verify:**
```bash
pnpm test
```


## Phase 4 — Install, sync, lockfile + CI gate, audit, advisories, MCP/plugin, CLI v0.1 release

**Exit criterion:** Pentest passed; CLI v0.1 released

### P4-T001 — TO VERIFY: skill directories of target agents

```yaml
id: P4-T001
phase: 4
title: "TO VERIFY: skill directories of target agents"
owner: ai-engineer
reviewers: [tech-lead]
depends_on: [P3-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#61-external-facts-to-verify-to-verify"]
paths: ["docs/adr/0008-skill-targets.md"]
```

**Goal:** Document where Claude Code, Codex and Gemini load skills from (user and project scope).

**Deliverables:**
- ADR with official documentation links and access date

**Acceptance criteria:**
- [ ] Each target path backed by an official source or marked unsupported

**Verify:**
```bash
pnpm lint
```

**Notes for the agent:** If not officially documented, mark the target unsupported instead of guessing.

### P4-T002 — Target adapter interface and project/custom targets

```yaml
id: P4-T002
phase: 4
title: "Target adapter interface and project/custom targets"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P4-T001]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["packages/skill-targets/src/**"]
```

**Goal:** Atomic, hash-verified installation into a directory.

**Deliverables:**
- `SkillTargetAdapter` interface
- project and custom-path targets

**Acceptance criteria:**
- [ ] Install verifies hash before and after copy
- [ ] Interrupted install leaves no partial skill
- [ ] Target path validated with resolveWithin

**Verify:**
```bash
pnpm --filter @quiver/skill-targets test
```

**Notes for the agent:** Writes to user directories: security review required.

### P4-T003 — Agent targets (Claude Code, Codex, Gemini)

```yaml
id: P4-T003
phase: 4
title: "Agent targets (Claude Code, Codex, Gemini)"
owner: ai-engineer
reviewers: [security-engineer, backend-engineer]
depends_on: [P4-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["packages/skill-targets/src/agents/**"]
```

**Goal:** Targets for the agents documented in P4-T001.

**Deliverables:**
- One adapter per supported agent

**Acceptance criteria:**
- [ ] Unsupported agents fail with a clear message

**Verify:**
```bash
pnpm --filter @quiver/skill-targets test
```

### P4-T004 — Install command and Installation registry

```yaml
id: P4-T004
phase: 4
title: "Install command and Installation registry"
owner: backend-engineer
reviewers: [ux-designer, security-engineer]
depends_on: [P4-T002, P3-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["apps/cli/src/commands/skills/install.ts", "packages/skill-engine/src/install/**"]
```

**Goal:** `quiver skills install <skill@snapshot> --target`.

**Deliverables:**
- Command, Installation entity and migration
- `--accept-unverified` flow with summary

**Acceptance criteria:**
- [ ] Unverified install without flag exits with code 4
- [ ] Quarantined snapshot cannot be installed
- [ ] Every install logged

**Verify:**
```bash
pnpm --filter @quiver/cli test
```

### P4-T005 — Upstream sync

```yaml
id: P4-T005
phase: 4
title: "Upstream sync"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P4-T004, P2-T006]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["packages/skill-engine/src/sync/**", "apps/cli/src/commands/skills/sync.ts"]
```

**Goal:** Check upstream, create new snapshots, never touch installations.

**Deliverables:**
- Sync service and command

**Acceptance criteria:**
- [ ] Changed upstream → new UNVERIFIED snapshot, installation unchanged
- [ ] Unchanged upstream → no new snapshot (conditional request)

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

### P4-T006 — Update with explicit approval

```yaml
id: P4-T006
phase: 4
title: "Update with explicit approval"
owner: backend-engineer
reviewers: [ux-designer, security-engineer]
depends_on: [P4-T005]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["apps/cli/src/commands/skills/update.ts"]
```

**Goal:** Update an installation only after showing the diff and receiving approval.

**Deliverables:**
- Update command showing diff summary

**Acceptance criteria:**
- [ ] Test: no code path updates an installation without an approval record
- [ ] Non-interactive mode requires explicit `--approve <snapshotId>`

**Verify:**
```bash
pnpm --filter @quiver/cli test
```

### P4-T007 — quiver.lock and lockfile verification

```yaml
id: P4-T007
phase: 4
title: "quiver.lock and lockfile verification"
owner: backend-engineer
reviewers: [security-engineer, qa-engineer]
depends_on: [P4-T004]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["packages/skill-engine/src/lock/**", "apps/cli/src/commands/skills/lock.ts"]
```

**Goal:** Pin installed skills in a deterministic lockfile and verify installations against it.

**Deliverables:**
- Lockfile schema (strict)
- `quiver skills lock`
- `quiver skills verify --lockfile`

**Acceptance criteria:**
- [ ] Lockfile output is byte-identical across runs and OSes
- [ ] A modified installed file makes verify exit with code 4
- [ ] Missing or untrusted skill makes verify fail according to policy

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

### P4-T008 — GitHub Action: lockfile gate + SARIF

```yaml
id: P4-T008
phase: 4
title: "GitHub Action: lockfile gate + SARIF"
owner: devops-engineer
reviewers: [security-engineer, qa-engineer]
depends_on: [P4-T007, P3-T013]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install", "project.md#39-dependencies-and-supply-chain"]
paths: ["packages/github-action/**", "docs/user/ci-gate.md"]
```

**Goal:** Reusable Action running lockfile verification and uploading SARIF.

**Deliverables:**
- Action package with documented inputs/outputs
- Example workflow in docs

**Acceptance criteria:**
- [ ] Action needs only `contents: read` (+ `security-events: write` for SARIF upload)
- [ ] No repository secrets required
- [ ] Fails the job on unverified skill changes in an integration test

**Verify:**
```bash
pnpm --filter @quiver/github-action test
```

**Notes for the agent:** Pin every third-party action and dependency by SHA/exact version (SC-50).

### P4-T009 — Machine audit

```yaml
id: P4-T009
phase: 4
title: "Machine audit"
owner: backend-engineer
reviewers: [security-engineer, ux-designer]
depends_on: [P4-T001, P4-T004, P3-T012]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["packages/skill-engine/src/audit/**", "apps/cli/src/commands/skills/audit.ts"]
```

**Goal:** Inventory skills installed for supported agents on this machine and report changes and risks.

**Deliverables:**
- `quiver skills audit` with human and JSON output

**Acceptance criteria:**
- [ ] Read-only: test proves no file is modified or deleted
- [ ] Reports unknown, changed, high-risk skills and toxic combinations
- [ ] Unsupported agents listed as skipped, not guessed

**Verify:**
```bash
pnpm --filter @quiver/cli test
```

### P4-T010 — Import from `npx skills` installations

```yaml
id: P4-T010
phase: 4
title: "Import from `npx skills` installations"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P4-T009]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["packages/skill-sources/src/skills-cli/**", "docs/adr/0013-skills-cli-interop.md"]
```

**Goal:** Map skills installed by the `skills` CLI (and its lock file, if present) to Quiver sources and snapshots.

**Deliverables:**
- ADR documenting the lock file format from official sources (TO VERIFY)
- Read-only importer

**Acceptance criteria:**
- [ ] Never writes files owned by the other tool
- [ ] Unknown format versions rejected with a clear message
- [ ] Imported skills go through the normal ingestion and hash path

**Verify:**
```bash
pnpm --filter @quiver/skill-sources test
```

### P4-T011 — Shareable trust lists

```yaml
id: P4-T011
phase: 4
title: "Shareable trust lists"
owner: backend-engineer
reviewers: [security-engineer, qa-engineer]
depends_on: [P3-T010]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#13-trust-model"]
paths: ["packages/skill-engine/src/trust/list/**", "apps/cli/src/commands/trust/**"]
```

**Goal:** Export and import `quiver.trust.json` as TRUSTED_ORG assertions bound to exact hashes.

**Deliverables:**
- Schema, `quiver trust export`, `quiver trust import`

**Acceptance criteria:**
- [ ] Import accepts local files only (remote URLs refused)
- [ ] Entries apply only to identical contentHash
- [ ] Every import logged with file hash and actor

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

### P4-T012 — Advisory feed (OSV) consumption

```yaml
id: P4-T012
phase: 4
title: "Advisory feed (OSV) consumption"
owner: security-engineer
reviewers: [tech-lead, qa-engineer]
depends_on: [P4-T009]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["packages/skill-engine/src/advisories/**", "docs/adr/0015-advisories.md"]
```

**Goal:** Consume an OSV-format advisory feed for skills, fetched via hardened Git and pinned to a commit.

**Deliverables:**
- ADR: feed format (OSV schema version TO VERIFY), repository layout, pinning, override policy
- Consumer: `quiver advisories update` (explicit), matching by contentHash and source
- Initial `quiver-advisories` repository structure with test advisories only

**Acceptance criteria:**
- [ ] Advisories can block install but never grant trust (test)
- [ ] Per-hash override is logged and shown
- [ ] Scans never fetch the feed implicitly; offline mode works with the last fetched copy

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

**Notes for the agent:** Protected path.

### P4-T013 — Read-only MCP server

```yaml
id: P4-T013
phase: 4
title: "Read-only MCP server"
owner: ai-engineer
reviewers: [security-engineer, qa-engineer]
depends_on: [P4-T009, P4-T012]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install", "project.md#19-threat-model-stride-oriented"]
paths: ["apps/mcp/**", "docs/adr/0016-mcp.md"]
```

**Goal:** Expose inspect, scan, verify, audit and advisories to agents through MCP, without any write capability.

**Deliverables:**
- MCP server (SDK choice in ADR, TO VERIFY)
- Tool schemas validated with Zod

**Acceptance criteria:**
- [ ] Route/tool table test proves no install, trust, update or write tool exists
- [ ] Tool outputs sanitized (no control characters, bounded size)
- [ ] Works over stdio only; no network listener by default

**Verify:**
```bash
pnpm --filter @quiver/mcp test
```

**Notes for the agent:** Protected path (apps/mcp/src/tools). Mitigates T20.

### P4-T014 — Claude Code plugin and pre-commit hook

```yaml
id: P4-T014
phase: 4
title: "Claude Code plugin and pre-commit hook"
owner: ai-engineer
reviewers: [security-engineer, devops-engineer]
depends_on: [P4-T013, P4-T007]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["integrations/claude-code-plugin/**", "integrations/pre-commit/**"]
```

**Goal:** Package the MCP server and a check-before-use skill as a Claude Code plugin; ship a pre-commit hook.

**Deliverables:**
- Plugin manifest (format TO VERIFY from official docs)
- Skill instructing the agent to call Quiver before using a skill
- pre-commit hook config running `quiver skills verify --lockfile`

**Acceptance criteria:**
- [ ] Plugin installs only read-only MCP tools
- [ ] Hook fails on unverified skill change in a test repo

**Verify:**
```bash
pnpm --filter @quiver/claude-code-plugin test
```

### P4-T015 — First-run UX for the CLI

```yaml
id: P4-T015
phase: 4
title: "First-run UX for the CLI"
owner: ux-designer
reviewers: [technical-writer, security-engineer]
depends_on: [P4-T009]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#56-key-ux-flows"]
paths: ["docs/design/flows/00-first-run.md"]
```

**Goal:** Specify flow 0: `npx quiver audit` with zero configuration.

**Deliverables:**
- Flow spec: output layout, ordering of risks, next-step suggestion, empty and error states

**Acceptance criteria:**
- [ ] Every message follows the microcopy rules in project.md §55
- [ ] No network access in the first-run path

**Verify:**
```bash
pnpm lint
```

### P4-T016 — First-run implementation and quickstart

```yaml
id: P4-T016
phase: 4
title: "First-run implementation and quickstart"
owner: backend-engineer
reviewers: [ux-designer, qa-engineer]
depends_on: [P4-T015, P4-T012]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#56-key-ux-flows"]
paths: ["apps/cli/src/commands/audit/**", "README.md", "docs/user/quickstart.md"]
```

**Goal:** Implement flow 0 and write a quickstart that gets a user to value in one minute.

**Deliverables:**
- Zero-config audit output
- README quickstart, docs/user/quickstart.md

**Acceptance criteria:**
- [ ] E2E test: fresh HOME with fixture skills → audit completes without config and without network
- [ ] Quickstart commands tested in CI

**Verify:**
```bash
pnpm --filter @quiver/cli test
```

### P4-T017 — Release pipeline

```yaml
id: P4-T017
phase: 4
title: "Release pipeline"
owner: devops-engineer
reviewers: [security-engineer, qa-engineer]
depends_on: [P4-T016, P4-T008]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#39-dependencies-and-supply-chain"]
paths: [".github/workflows/release.yml", "docs/dev/release.md"]
```

**Goal:** npm publish with provenance, SBOM, signed tags.

**Deliverables:**
- Release workflow (manual trigger only)

**Acceptance criteria:**
- [ ] Dry run produces SBOM and provenance attestation

**Verify:**
```bash
pnpm build
```

**Notes for the agent:** Protected path. The workflow must require a manual approval environment.

### P4-T018 — External penetration test: CLI, MCP and Action

```yaml
id: P4-T018
phase: 4
title: "External penetration test: CLI, MCP and Action"
owner: external-pentester
reviewers: [security-engineer, release-owner]
depends_on: [P4-T017, P4-T014, P4-T011, P4-T010, P4-T003, P4-T006]
gate: human-pentest
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#58-roles"]
paths: ["docs/security/pentest-cli.md"]
```

**Goal:** Independent test of ingestion, scanner bypass, Git hardening, lockfile gate, MCP server and Action.

**Deliverables:**
- Scope document prepared by security-engineer
- External report summary (no exploit details) committed by a human

**Acceptance criteria:**
- [ ] No open high/critical findings

**Verify:**
```bash
test -f docs/security/pentest-cli.md
```

### P4-EXIT — Phase 4 exit and CLI v0.1 release

```yaml
id: P4-EXIT
phase: 4
title: "Phase 4 exit and CLI v0.1 release"
owner: release-owner
reviewers: [security-engineer, tech-lead]
depends_on: [P4-T018, P3-T015]
gate: human-release
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#59-phases"]
paths: ["CHANGELOG.md", "docs/phases/phase-4.md"]
```

**Goal:** Human-approved first public release: CLI, MCP server, Claude Code plugin, GitHub Action.

**Deliverables:**
- Release notes with benchmark results

**Acceptance criteria:**
- [ ] Pentest passed
- [ ] No silent update path (tests)
- [ ] Lockfile gate verified in CI integration test
- [ ] Release published with provenance and SBOM

**Verify:**
```bash
pnpm build
```


## Phase 5 — Design system, Skills Hub Web UI

**Exit criterion:** Pentest passed; Skills Hub v0.2 (Web UI) released

### P5-T001 — UX research: personas, jobs, IA

```yaml
id: P5-T001
phase: 5
title: "UX research: personas, jobs, IA"
owner: ux-designer
reviewers: [tech-lead, technical-writer]
depends_on: [P4-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#3-personas", "project.md#56-key-ux-flows"]
paths: ["docs/design/ia.md"]
```

**Goal:** Information architecture for Skills Hub Web UI.

**Deliverables:**
- Navigation map, page inventory, content priorities per persona

**Acceptance criteria:**
- [ ] Every page maps to at least one persona goal

**Verify:**
```bash
pnpm lint
```

### P5-T002 — UX flows and wireframes

```yaml
id: P5-T002
phase: 5
title: "UX flows and wireframes"
owner: ux-designer
reviewers: [security-engineer, frontend-engineer]
depends_on: [P5-T001]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#56-key-ux-flows"]
paths: ["docs/design/flows/**"]
```

**Goal:** Specify flows 1–3 of project.md §56 with wireframes.

**Deliverables:**
- One file per flow: steps, screens, empty/error states, confirmations, keyboard path
- Wireframes as SVG (script-free) or ASCII

**Acceptance criteria:**
- [ ] Security wording reviewed for accuracy
- [ ] Each flow lists accessibility notes

**Verify:**
```bash
pnpm lint
```

### P5-T003 — Microcopy guide

```yaml
id: P5-T003
phase: 5
title: "Microcopy guide"
owner: ux-designer
reviewers: [technical-writer, security-engineer]
depends_on: [P5-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#55-trust-and-risk-language"]
paths: ["docs/design/microcopy.md"]
```

**Goal:** Tone rules and approved strings for trust, risk and confirmations.

**Deliverables:**
- Guide with good/bad examples
- String catalog keys

**Acceptance criteria:**
- [ ] No string claims safety beyond evidence (review checklist)

**Verify:**
```bash
pnpm lint
```

### P5-T004 — Brand concept and logo proposals

```yaml
id: P5-T004
phase: 5
title: "Brand concept and logo proposals"
owner: visual-designer
reviewers: [ux-designer, frontend-engineer]
depends_on: [P4-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#52-identity"]
paths: ["docs/design/identity.md", "docs/design/logo/**"]
```

**Goal:** Explore directions A–C and present them for decision (OD-8).

**Deliverables:**
- Three SVG proposals with mono versions and 16 px previews
- Rationale per direction

**Acceptance criteria:**
- [ ] SVGs contain no scripts, external references or raster images
- [ ] Proposals listed as a pending decision for the next checkpoint

**Verify:**
```bash
pnpm lint:svg
```

**Notes for the agent:** Do not pick a direction: present the three proposals; the release owner chooses at the next checkpoint (OD-8).

### P5-T005 — Design tokens

```yaml
id: P5-T005
phase: 5
title: "Design tokens"
owner: visual-designer
reviewers: [ux-designer, frontend-engineer]
depends_on: [P5-T004]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#53-design-tokens"]
paths: ["packages/ui/tokens/**", "docs/design/tokens.md"]
```

**Goal:** Finalize tokens for light and dark themes with verified contrast.

**Deliverables:**
- Token JSON, CSS export script
- Contrast table

**Acceptance criteria:**
- [ ] Automated contrast test: text ≥ 4.5:1, UI ≥ 3:1
- [ ] Every semantic state has a token in both themes

**Verify:**
```bash
pnpm --filter @quiver/ui test
```

### P5-T006 — Icon set

```yaml
id: P5-T006
phase: 5
title: "Icon set"
owner: visual-designer
reviewers: [ux-designer, frontend-engineer]
depends_on: [P5-T005]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#54-iconography"]
paths: ["packages/ui/icons/**"]
```

**Goal:** Create the minimum icon set as optimized SVG.

**Deliverables:**
- Icons listed in §54
- Icon gallery page in docs

**Acceptance criteria:**
- [ ] All icons on 24-unit grid, `currentColor`, no scripts
- [ ] Legible at 16 px (visual check documented)

**Verify:**
```bash
pnpm lint:svg
```

### P5-T007 — Local server hardening

```yaml
id: P5-T007
phase: 5
title: "Local server hardening"
owner: security-engineer
reviewers: [backend-engineer, qa-engineer, tech-lead]
depends_on: [P4-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#38-local-server"]
paths: ["apps/server/src/security/**"]
```

**Goal:** Fastify server with loopback bind, Host/Origin checks, session token, CSP, limits.

**Deliverables:**
- Security plugin implementing SC-41..SC-45

**Acceptance criteria:**
- [ ] Requests with foreign Host or Origin rejected
- [ ] Missing/invalid session token → 401
- [ ] No route mutates state on GET (route table test)
- [ ] CSP header without unsafe-inline/unsafe-eval

**Verify:**
```bash
pnpm --filter @quiver/server test
```

**Notes for the agent:** Protected path.

### P5-T008 — Skills API routes

```yaml
id: P5-T008
phase: 5
title: "Skills API routes"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P5-T007]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#17-interfaces"]
paths: ["apps/server/src/routes/skills/**"]
```

**Goal:** Expose Skills Hub services over the local API.

**Deliverables:**
- Routes from §17 with Zod-validated input and output

**Acceptance criteria:**
- [ ] Each route has validation and error tests

**Verify:**
```bash
pnpm --filter @quiver/server test
```

### P5-T009 — SPA scaffold and UI components

```yaml
id: P5-T009
phase: 5
title: "SPA scaffold and UI components"
owner: frontend-engineer
reviewers: [visual-designer, ux-designer]
depends_on: [P5-T005, P5-T006]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#45-stack"]
paths: ["apps/web/**", "packages/ui/src/**"]
```

**Goal:** Vite + React app using tokens; base components (button, badge, table, dialog).

**Deliverables:**
- Scaffold, theme switch, components with stories or gallery

**Acceptance criteria:**
- [ ] No inline scripts/styles requiring unsafe-inline
- [ ] Trust badge always renders text + icon

**Verify:**
```bash
pnpm --filter @quiver/web test
```

**Notes for the agent:** Fonts bundled locally.

### P5-T010 — Safe rendering of untrusted content

```yaml
id: P5-T010
phase: 5
title: "Safe rendering of untrusted content"
owner: frontend-engineer
reviewers: [security-engineer]
depends_on: [P5-T009]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#36-output-handling"]
paths: ["apps/web/src/render/**"]
```

**Goal:** Render SKILL.md and files without XSS and with invisible characters visible.

**Deliverables:**
- Markdown renderer (html disabled) + DOMPurify
- Code viewer highlighting bidi/invisible characters

**Acceptance criteria:**
- [ ] XSS payload corpus renders inert
- [ ] javascript: and data: links not rendered as links

**Verify:**
```bash
pnpm --filter @quiver/web test
```

**Notes for the agent:** Protected path.

### P5-T011 — Discover and skill detail pages

```yaml
id: P5-T011
phase: 5
title: "Discover and skill detail pages"
owner: frontend-engineer
reviewers: [ux-designer]
depends_on: [P5-T008, P5-T010, P5-T003]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#56-key-ux-flows"]
paths: ["apps/web/src/pages/skills/**"]
```

**Goal:** Implement flow 1 (inspect without installing).

**Deliverables:**
- Search, filters, detail with sources, risk, capabilities, license, history

**Acceptance criteria:**
- [ ] Matches wireframe; empty and error states present

**Verify:**
```bash
pnpm --filter @quiver/web test
```

### P5-T012 — Snapshot diff viewer

```yaml
id: P5-T012
phase: 5
title: "Snapshot diff viewer"
owner: frontend-engineer
reviewers: [ux-designer, security-engineer]
depends_on: [P5-T011]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install"]
paths: ["apps/web/src/pages/diff/**"]
```

**Goal:** Visual diff of files, capabilities, license, risk, provenance.

**Deliverables:**
- Diff page

**Acceptance criteria:**
- [ ] Changes conveyed by text/icon, not color alone

**Verify:**
```bash
pnpm --filter @quiver/web test
```

### P5-T013 — Install and update flows in UI

```yaml
id: P5-T013
phase: 5
title: "Install and update flows in UI"
owner: frontend-engineer
reviewers: [ux-designer, security-engineer]
depends_on: [P5-T012]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#56-key-ux-flows"]
paths: ["apps/web/src/pages/install/**"]
```

**Goal:** Implement flows 2 and 3 with confirmation sheets.

**Deliverables:**
- Install and update screens

**Acceptance criteria:**
- [ ] Unverified install requires explicit checkbox; hash shown
- [ ] Quarantined snapshot shows reason and no install action

**Verify:**
```bash
pnpm --filter @quiver/web test
```

### P5-T014 — E2E and accessibility tests

```yaml
id: P5-T014
phase: 5
title: "E2E and accessibility tests"
owner: qa-engineer
reviewers: [ux-designer, frontend-engineer]
depends_on: [P5-T013]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#48-testing-strategy", "project.md#57-accessibility"]
paths: ["tests/e2e/**"]
```

**Goal:** Playwright tests for flows 1–3 plus axe checks.

**Deliverables:**
- E2E suite, CI jobs `e2e` and `a11y`

**Acceptance criteria:**
- [ ] Zero serious/critical axe violations
- [ ] Keyboard-only path passes for each flow

**Verify:**
```bash
pnpm test:e2e
```

### P5-T015 — Skills Hub documentation

```yaml
id: P5-T015
phase: 5
title: "Skills Hub documentation"
owner: technical-writer
reviewers: [ux-designer]
depends_on: [P5-T013]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#58-roles"]
paths: ["docs/user/**", "README.md"]
```

**Goal:** User guide for Web UI and CLI; README with visuals.

**Deliverables:**
- Guides and README

**Acceptance criteria:**
- [ ] Screens described in text for accessibility

**Verify:**
```bash
pnpm lint
```

### P5-T017 — External penetration test: Skills Hub Web UI

```yaml
id: P5-T017
phase: 5
title: "External penetration test: Skills Hub Web UI"
owner: external-pentester
reviewers: [security-engineer, release-owner]
depends_on: [P5-T014, P5-T015]
gate: human-pentest
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#58-roles"]
paths: ["docs/security/pentest-skills-hub.md"]
```

**Goal:** Independent test of the local server and Web UI: auth, Host/Origin checks, rendering of untrusted content, API validation.

**Deliverables:**
- Scope document prepared by security-engineer
- External report summary (no exploit details) committed by a human

**Acceptance criteria:**
- [ ] No open high/critical findings

**Verify:**
```bash
test -f docs/security/pentest-skills-hub.md
```

### P5-EXIT — Phase 5 exit and Skills Hub v0.2 (Web UI) release

```yaml
id: P5-EXIT
phase: 5
title: "Phase 5 exit and Skills Hub v0.2 (Web UI) release"
owner: release-owner
reviewers: [security-engineer, tech-lead]
depends_on: [P5-T017]
gate: human-release
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#59-phases"]
paths: ["CHANGELOG.md", "docs/phases/phase-5.md"]
```

**Goal:** Human-approved first public release of Skills Hub.

**Deliverables:**
- Release notes

**Acceptance criteria:**
- [ ] Pentest passed
- [ ] Release published with provenance

**Verify:**
```bash
pnpm build
```


## Phase 6 — Orchestrator core

**Exit criterion:** Dev → Test → Review → Commit end-to-end on fixture repo

### P6-T001 — TO VERIFY: provider terms and CLI permission models

```yaml
id: P6-T001
phase: 6
title: "TO VERIFY: provider terms and CLI permission models"
owner: ai-engineer
reviewers: [legal-advisor, security-engineer]
depends_on: [P5-EXIT]
gate: human-legal
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#42-ai-provider-terms", "project.md#61-external-facts-to-verify-to-verify"]
paths: ["docs/adr/0009-providers.md"]
```

**Goal:** For Claude Code, Codex, Gemini, Ollama: automation terms and native permission/sandbox controls.

**Deliverables:**
- ADR with official sources and access date
- Proposed usagePolicy and enforcement levels per provider

**Acceptance criteria:**
- [ ] Legal sign-off on automation values

**Verify:**
```bash
pnpm lint
```

### P6-T002 — Orchestrator contracts

```yaml
id: P6-T002
phase: 6
title: "Orchestrator contracts"
owner: tech-lead
reviewers: [ai-engineer, security-engineer]
depends_on: [P6-T001]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#15-orchestrator"]
paths: ["packages/contracts/src/orchestrator/**"]
```

**Goal:** Schemas for Agent, Role, Workflow, Run, Artifacts, Policies.

**Deliverables:**
- Zod schemas + generated JSON Schema

**Acceptance criteria:**
- [ ] Artifacts strict; unknown keys rejected

**Verify:**
```bash
pnpm --filter @quiver/contracts test
```

### P6-T003 — ProviderAdapter interface

```yaml
id: P6-T003
phase: 6
title: "ProviderAdapter interface"
owner: ai-engineer
reviewers: [security-engineer, tech-lead]
depends_on: [P6-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#15-orchestrator"]
paths: ["packages/agent-runtime/src/provider/**"]
```

**Goal:** Adapter contract including usagePolicy and permissionMapping.

**Deliverables:**
- Interface, conformance test kit for adapters

**Acceptance criteria:**
- [ ] Conformance kit fails an adapter that claims `enforced` without a test

**Verify:**
```bash
pnpm --filter @quiver/agent-runtime test
```

### P6-T004 — Ollama adapter

```yaml
id: P6-T004
phase: 6
title: "Ollama adapter"
owner: ai-engineer
reviewers: [backend-engineer]
depends_on: [P6-T003]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#15-orchestrator"]
paths: ["providers/ollama/**"]
```

**Goal:** Local-model provider as first adapter.

**Deliverables:**
- Adapter passing conformance kit

**Acceptance criteria:**
- [ ] Works against a mocked endpoint in CI

**Verify:**
```bash
pnpm --filter @quiver/provider-ollama test
```

### P6-T005 — Claude Code adapter

```yaml
id: P6-T005
phase: 6
title: "Claude Code adapter"
owner: ai-engineer
reviewers: [security-engineer]
depends_on: [P6-T003]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#15-orchestrator", "project.md#20-enforcement-points"]
paths: ["providers/anthropic/**"]
```

**Goal:** Headless Claude Code invocation with permission mapping.

**Deliverables:**
- Adapter; permission mapping in `src/permissions` (protected)

**Acceptance criteria:**
- [ ] Conformance kit passes
- [ ] Enforcement levels match ADR 0009

**Verify:**
```bash
pnpm --filter @quiver/provider-anthropic test
```

**Notes for the agent:** Protected path for permission mapping.

### P6-T006 — Permission engine

```yaml
id: P6-T006
phase: 6
title: "Permission engine"
owner: security-engineer
reviewers: [ai-engineer, backend-engineer]
depends_on: [P6-T003]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#15-orchestrator"]
paths: ["packages/agent-runtime/src/permissions/**"]
```

**Goal:** Compute effective permissions and block when enforcement is insufficient.

**Deliverables:**
- Intersection logic, risk-acceptance records

**Acceptance criteria:**
- [ ] Required control mapped to `none` blocks the workflow unless an acceptance record exists

**Verify:**
```bash
pnpm --filter @quiver/agent-runtime test
```

**Notes for the agent:** Security decision logic.

### P6-T007 — Artifact validation

```yaml
id: P6-T007
phase: 6
title: "Artifact validation"
owner: ai-engineer
reviewers: [security-engineer]
depends_on: [P6-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#15-orchestrator"]
paths: ["packages/agent-runtime/src/artifacts/**"]
```

**Goal:** Reject malformed model output.

**Deliverables:**
- Validator with size limits

**Acceptance criteria:**
- [ ] Invalid or oversized artifact rejected, never partially used

**Verify:**
```bash
pnpm --filter @quiver/agent-runtime test
```

### P6-T008 — Workflow state machine (sequential)

```yaml
id: P6-T008
phase: 6
title: "Workflow state machine (sequential)"
owner: backend-engineer
reviewers: [tech-lead]
depends_on: [P6-T006, P6-T007]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#15-orchestrator"]
paths: ["packages/workflow-engine/**"]
```

**Goal:** Plan → Implement → Test → Review → Commit with review loop and max cycles.

**Deliverables:**
- State machine, persistence of runs

**Acceptance criteria:**
- [ ] max_cycles reached → paused for human
- [ ] Pause/resume/cancel supported

**Verify:**
```bash
pnpm --filter @quiver/workflow-engine test
```

### P6-T009 — Git adapter for projects

```yaml
id: P6-T009
phase: 6
title: "Git adapter for projects"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P6-T008]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#26-git-safety-defaults-orchestrator"]
paths: ["packages/git/src/project/**"]
```

**Goal:** Branch per task, commit, protected-branch rules, no force push.

**Deliverables:**
- Git operations through safeExec

**Acceptance criteria:**
- [ ] Commit to main refused by default
- [ ] Force push impossible through the API

**Verify:**
```bash
pnpm --filter @quiver/git test
```

### P6-T010 — Budget engine

```yaml
id: P6-T010
phase: 6
title: "Budget engine"
owner: backend-engineer
reviewers: [ai-engineer]
depends_on: [P6-T008]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#15-orchestrator"]
paths: ["packages/agent-runtime/src/budget/**"]
```

**Goal:** Paid API off by default; fallback chain ends with STOP.

**Deliverables:**
- Budget policy evaluation

**Acceptance criteria:**
- [ ] No path reaches a paid provider when `paid_api.enabled=false`

**Verify:**
```bash
pnpm --filter @quiver/agent-runtime test
```

### P6-T011 — Hash-chained audit log

```yaml
id: P6-T011
phase: 6
title: "Hash-chained audit log"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P6-T008]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#24-audit"]
paths: ["packages/security/src/audit/**", "apps/cli/src/commands/audit/**"]
```

**Goal:** Append-only audit with `quiver audit verify`.

**Deliverables:**
- Audit writer, verifier

**Acceptance criteria:**
- [ ] Modified or removed event detected by verify

**Verify:**
```bash
pnpm --filter @quiver/security test
```

**Notes for the agent:** Protected path.

### P6-T012 — Orchestrator CLI

```yaml
id: P6-T012
phase: 6
title: "Orchestrator CLI"
owner: backend-engineer
reviewers: [ux-designer]
depends_on: [P6-T009, P6-T010, P6-T011]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#17-interfaces"]
paths: ["apps/cli/src/commands/{project,providers,agent,workflow,run}/**"]
```

**Goal:** Commands to configure and run the sequential workflow.

**Deliverables:**
- Commands with --json

**Acceptance criteria:**
- [ ] Each command documented and tested

**Verify:**
```bash
pnpm --filter @quiver/cli test
```

### P6-T013 — End-to-end workflow on fixture repo

```yaml
id: P6-T013
phase: 6
title: "End-to-end workflow on fixture repo"
owner: qa-engineer
reviewers: [ai-engineer, security-engineer]
depends_on: [P6-T012, P6-T004, P6-T005]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#59-phases"]
paths: ["tests/e2e/orchestrator/**"]
```

**Goal:** Dev → Test → Review → Commit on a fixture repository with a mocked provider.

**Deliverables:**
- E2E test

**Acceptance criteria:**
- [ ] Run completes; audit verifies; no commit on main

**Verify:**
```bash
pnpm test:e2e
```

### P6-EXIT — Phase 6 exit review

```yaml
id: P6-EXIT
phase: 6
title: "Phase 6 exit review"
owner: qa-engineer
reviewers: [tech-lead, security-engineer]
depends_on: [P6-T013]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#59-phases"]
paths: ["docs/phases/phase-6.md"]
```

**Goal:** Verify exit criterion and update threat model.

**Deliverables:**
- Phase report

**Acceptance criteria:**
- [ ] E2E green on 3 OSes

**Verify:**
```bash
pnpm test && pnpm test:e2e
```


## Phase 7 — Multi-agent, scheduler, Orchestrator UI

**Exit criterion:** Pentest passed; Orchestrator v0.1 released

### P7-T001 — Project Lead and multi-agent modes

```yaml
id: P7-T001
phase: 7
title: "Project Lead and multi-agent modes"
owner: ai-engineer
reviewers: [tech-lead]
depends_on: [P6-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#15-orchestrator"]
paths: ["packages/agent-runtime/src/modes/**"]
```

**Goal:** Fixed, Alternating, Round Robin, Four Hands with a Project Lead.

**Deliverables:**
- Mode implementations

**Acceptance criteria:**
- [ ] Each mode covered by a mocked-provider test

**Verify:**
```bash
pnpm --filter @quiver/agent-runtime test
```

### P7-T002 — Consensus and Adversarial Review

```yaml
id: P7-T002
phase: 7
title: "Consensus and Adversarial Review"
owner: ai-engineer
reviewers: [security-engineer]
depends_on: [P7-T001]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#15-orchestrator"]
paths: ["packages/agent-runtime/src/modes/**"]
```

**Goal:** Comparison and adversarial review loops.

**Deliverables:**
- Mode implementations

**Acceptance criteria:**
- [ ] Disagreement resolved by Lead decision artifact

**Verify:**
```bash
pnpm --filter @quiver/agent-runtime test
```

### P7-T003 — Scheduler with usage-policy enforcement

```yaml
id: P7-T003
phase: 7
title: "Scheduler with usage-policy enforcement"
owner: backend-engineer
reviewers: [security-engineer, ai-engineer]
depends_on: [P6-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#15-orchestrator"]
paths: ["packages/scheduler/**"]
```

**Goal:** Cron/interval/event triggers, kill switch, unattended-run rules.

**Deliverables:**
- Scheduler, `quiver schedule add`

**Acceptance criteria:**
- [ ] `disallowed` provider refuses unattended run
- [ ] `unknown` requires logged acknowledgement
- [ ] Kill switch file stops all runs

**Verify:**
```bash
pnpm --filter @quiver/scheduler test
```

**Notes for the agent:** Automation safety logic.

### P7-T004 — Orchestrator UX flows

```yaml
id: P7-T004
phase: 7
title: "Orchestrator UX flows"
owner: ux-designer
reviewers: [security-engineer, frontend-engineer]
depends_on: [P6-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#56-key-ux-flows"]
paths: ["docs/design/flows/**"]
```

**Goal:** Flows 4 and 5: agent configuration, run inspection/pause.

**Deliverables:**
- Flow specs with wireframes

**Acceptance criteria:**
- [ ] Enforcement level shown for every permission

**Verify:**
```bash
pnpm lint
```

### P7-T005 — Workflow builder visual design

```yaml
id: P7-T005
phase: 7
title: "Workflow builder visual design"
owner: visual-designer
reviewers: [ux-designer, frontend-engineer]
depends_on: [P7-T004]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#54-iconography"]
paths: ["docs/design/workflow-builder.md", "packages/ui/icons/workflow/**"]
```

**Goal:** Node, edge and state visuals for the graph editor.

**Deliverables:**
- Node icon set, state styles

**Acceptance criteria:**
- [ ] States distinguishable without color

**Verify:**
```bash
pnpm lint:svg
```

### P7-T006 — Orchestrator API routes

```yaml
id: P7-T006
phase: 7
title: "Orchestrator API routes"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P6-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#17-interfaces"]
paths: ["apps/server/src/routes/orchestrator/**"]
```

**Goal:** Expose Orchestrator services locally.

**Deliverables:**
- Routes with validation

**Acceptance criteria:**
- [ ] Mutating routes require session token and Origin check

**Verify:**
```bash
pnpm --filter @quiver/server test
```

### P7-T007 — Orchestrator UI pages

```yaml
id: P7-T007
phase: 7
title: "Orchestrator UI pages"
owner: frontend-engineer
reviewers: [ux-designer]
depends_on: [P7-T004, P7-T006]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#56-key-ux-flows"]
paths: ["apps/web/src/pages/orchestrator/**"]
```

**Goal:** Projects, agents, runs, providers, run timeline with pause/resume.

**Deliverables:**
- Pages

**Acceptance criteria:**
- [ ] Pause/cancel require confirmation
- [ ] Run artifacts rendered through src/render

**Verify:**
```bash
pnpm --filter @quiver/web test
```

### P7-T008 — Workflow builder

```yaml
id: P7-T008
phase: 7
title: "Workflow builder"
owner: frontend-engineer
reviewers: [ux-designer, visual-designer]
depends_on: [P7-T005, P7-T007]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#15-orchestrator"]
paths: ["apps/web/src/pages/workflows/**"]
```

**Goal:** Graph editor for workflows.

**Deliverables:**
- Builder with keyboard support

**Acceptance criteria:**
- [ ] Fully operable by keyboard
- [ ] Invalid graphs cannot be saved

**Verify:**
```bash
pnpm --filter @quiver/web test
```

### P7-T009 — Codex and Gemini adapters

```yaml
id: P7-T009
phase: 7
title: "Codex and Gemini adapters"
owner: ai-engineer
reviewers: [security-engineer]
depends_on: [P7-T001]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#15-orchestrator"]
paths: ["providers/openai/**", "providers/google/**"]
```

**Goal:** Additional provider adapters per ADR 0009.

**Deliverables:**
- Adapters passing conformance kit

**Acceptance criteria:**
- [ ] Enforcement levels match ADR 0009

**Verify:**
```bash
pnpm -r --filter './providers/**' test
```

**Notes for the agent:** Protected permission paths.

### P7-T010 — E2E, a11y and docs for Orchestrator

```yaml
id: P7-T010
phase: 7
title: "E2E, a11y and docs for Orchestrator"
owner: qa-engineer
reviewers: [technical-writer, ux-designer]
depends_on: [P7-T008, P7-T009, P7-T003, P7-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#48-testing-strategy"]
paths: ["tests/e2e/orchestrator-ui/**", "docs/user/orchestrator*.md"]
```

**Goal:** Tests and user docs for Orchestrator.

**Deliverables:**
- E2E, axe checks, user guides

**Acceptance criteria:**
- [ ] Zero serious axe violations

**Verify:**
```bash
pnpm test:e2e
```

### P7-T011 — External penetration test: Orchestrator

```yaml
id: P7-T011
phase: 7
title: "External penetration test: Orchestrator"
owner: external-pentester
reviewers: [security-engineer, release-owner]
depends_on: [P7-T010]
gate: human-pentest
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#58-roles"]
paths: ["docs/security/pentest-orchestrator.md"]
```

**Goal:** Independent test of permission enforcement, scheduler, server, Git safety.

**Deliverables:**
- Scope by security-engineer; report summary committed by a human

**Acceptance criteria:**
- [ ] No open high/critical findings

**Verify:**
```bash
test -f docs/security/pentest-orchestrator.md
```

### P7-EXIT — Phase 7 exit and Orchestrator v0.1 release

```yaml
id: P7-EXIT
phase: 7
title: "Phase 7 exit and Orchestrator v0.1 release"
owner: release-owner
reviewers: [security-engineer, tech-lead]
depends_on: [P7-T011]
gate: human-release
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#59-phases"]
paths: ["CHANGELOG.md", "docs/phases/phase-7.md"]
```

**Goal:** Human-approved Orchestrator release.

**Deliverables:**
- Release notes

**Acceptance criteria:**
- [ ] Pentest passed

**Verify:**
```bash
pnpm build
```


## Phase 8 — Integration Bridge

**Exit criterion:** Pinned skill executed with permission reconciliation and audit

### P8-T001 — Bridge contracts and boundaries

```yaml
id: P8-T001
phase: 8
title: "Bridge contracts and boundaries"
owner: tech-lead
reviewers: [security-engineer]
depends_on: [P7-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#16-integration-bridge"]
paths: ["integrations/orchestrator-skills/src/contracts/**"]
```

**Goal:** Define the only allowed cross-domain dependency.

**Deliverables:**
- Bridge contracts, boundary rule update

**Acceptance criteria:**
- [ ] Boundary check still forbids direct imports between domains

**Verify:**
```bash
pnpm boundaries
```

### P8-T002 — Skill assignment and hash pinning

```yaml
id: P8-T002
phase: 8
title: "Skill assignment and hash pinning"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P8-T001]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#16-integration-bridge"]
paths: ["integrations/orchestrator-skills/src/assign/**"]
```

**Goal:** Assign snapshots to agents; re-verify hash before each execution.

**Deliverables:**
- Assignment service

**Acceptance criteria:**
- [ ] `@latest` rejected in autonomous workflows
- [ ] Hash mismatch blocks execution

**Verify:**
```bash
pnpm --filter @quiver/integration-skills test
```

### P8-T003 — Permission reconciliation

```yaml
id: P8-T003
phase: 8
title: "Permission reconciliation"
owner: security-engineer
reviewers: [ai-engineer]
depends_on: [P8-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#16-integration-bridge"]
paths: ["integrations/orchestrator-skills/src/permissions/**"]
```

**Goal:** Match skill capabilities with agent permissions.

**Deliverables:**
- Reconciler

**Acceptance criteria:**
- [ ] Required-but-not-permitted capability refuses assignment
- [ ] Inferred-undeclared capability warns

**Verify:**
```bash
pnpm --filter @quiver/integration-skills test
```

**Notes for the agent:** Security decision logic.

### P8-T004 — Trust revocation propagation

```yaml
id: P8-T004
phase: 8
title: "Trust revocation propagation"
owner: backend-engineer
reviewers: [security-engineer]
depends_on: [P8-T002]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#16-integration-bridge"]
paths: ["integrations/orchestrator-skills/src/events/**"]
```

**Goal:** skill.trust.revoked → workflows BLOCKED.

**Deliverables:**
- Event handler

**Acceptance criteria:**
- [ ] Revocation blocks affected workflows in test

**Verify:**
```bash
pnpm --filter @quiver/integration-skills test
```

### P8-T005 — Skill picker UI and execution audit

```yaml
id: P8-T005
phase: 8
title: "Skill picker UI and execution audit"
owner: frontend-engineer
reviewers: [ux-designer, security-engineer]
depends_on: [P8-T003, P8-T004]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#16-integration-bridge"]
paths: ["apps/web/src/pages/orchestrator/skills/**"]
```

**Goal:** Pick, pin and see reconciliation warnings; audit shows snapshots used.

**Deliverables:**
- Picker UI

**Acceptance criteria:**
- [ ] Warnings shown with evidence
- [ ] Audit record lists snapshot hashes

**Verify:**
```bash
pnpm test:e2e
```

### P8-EXIT — Phase 8 exit review

```yaml
id: P8-EXIT
phase: 8
title: "Phase 8 exit review"
owner: qa-engineer
reviewers: [tech-lead, security-engineer]
depends_on: [P8-T005]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#59-phases"]
paths: ["docs/phases/phase-8.md"]
```

**Goal:** Verify integration exit criterion.

**Deliverables:**
- Phase report

**Acceptance criteria:**
- [ ] Pinned skill executed with reconciliation and audit in E2E

**Verify:**
```bash
pnpm test:e2e
```


## Phase 9 — Ecosystem

**Exit criterion:** Plugin SDK published; registry legal sign-off

### P9-T001 — Plugin SDK with plugin permission manifest

```yaml
id: P9-T001
phase: 9
title: "Plugin SDK with plugin permission manifest"
owner: tech-lead
reviewers: [security-engineer, ai-engineer]
depends_on: [P8-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#45-stack"]
paths: ["packages/plugin-sdk/**"]
```

**Goal:** Stable SDK for adapters, scanners and nodes; plugins declare capabilities.

**Deliverables:**
- SDK, examples, docs

**Acceptance criteria:**
- [ ] Plugins without a manifest refused
- [ ] Example plugin passes conformance kit

**Verify:**
```bash
pnpm --filter @quiver/plugin-sdk test
```

### P9-T002 — Community infrastructure

```yaml
id: P9-T002
phase: 9
title: "Community infrastructure"
owner: community-maintainer
reviewers: [technical-writer, security-engineer]
depends_on: [P8-EXIT]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#58-roles"]
paths: [".github/ISSUE_TEMPLATE/**", "CODE_OF_CONDUCT.md"]
```

**Goal:** Templates, code of conduct, triage labels.

**Deliverables:**
- Templates EN, Code of Conduct

**Acceptance criteria:**
- [ ] Security issue template redirects to private reporting

**Verify:**
```bash
pnpm lint
```

**Notes for the agent:** Protected path (.github): mandatory security-engineer review.

### P9-T003 — Shared registry design

```yaml
id: P9-T003
phase: 9
title: "Shared registry design"
owner: tech-lead
reviewers: [security-engineer, legal-advisor]
depends_on: [P9-T001]
gate: human-legal
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#41-licenses-and-redistribution", "project.md#44-personal-data"]
paths: ["docs/adr/0010-registry.md"]
```

**Goal:** Design a registry serving only redistributable content, with removal procedure.

**Deliverables:**
- ADR

**Acceptance criteria:**
- [ ] Legal sign-off on redistribution and GDPR procedure

**Verify:**
```bash
pnpm lint
```

### P9-T004 — Signed snapshot attestations (research)

```yaml
id: P9-T004
phase: 9
title: "Signed snapshot attestations (research)"
owner: security-engineer
reviewers: [tech-lead]
depends_on: [P9-T001]
gate: auto
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#60-open-decisions"]
paths: ["docs/adr/0011-attestations.md"]
```

**Goal:** Evaluate signing options (OD-5); TO VERIFY current tooling.

**Deliverables:**
- ADR with options and recommendation

**Acceptance criteria:**
- [ ] Official sources cited with access date

**Verify:**
```bash
pnpm lint
```

### P9-T005 — Advisory publishing and coordinated disclosure

```yaml
id: P9-T005
phase: 9
title: "Advisory publishing and coordinated disclosure"
owner: security-engineer
reviewers: [tech-lead, qa-engineer, legal-advisor]
depends_on: [P9-T003]
gate: human-legal
status: todo
attempts: 0
max_attempts: 3
size: M
spec_refs: ["project.md#14-upstream-sync-diff-install", "project.md#25-vulnerability-disclosure"]
paths: ["docs/advisories/process.md", "packages/skill-engine/src/advisories/publish/**"]
```

**Goal:** Process and tooling to publish advisories about third-party skills responsibly.

**Deliverables:**
- Disclosure process: notify maintainer, embargo period, evidence standard, appeal
- Tool generating OSV records from confirmed findings

**Acceptance criteria:**
- [ ] Legal sign-off on the process (naming third parties)
- [ ] Generated records validate against the OSV schema

**Verify:**
```bash
pnpm --filter @quiver/skill-engine test
```

**Notes for the agent:** Protected path.

### P9-EXIT — Phase 9 exit review

```yaml
id: P9-EXIT
phase: 9
title: "Phase 9 exit review"
owner: release-owner
reviewers: [tech-lead, security-engineer]
depends_on: [P9-T002, P9-T003, P9-T004, P9-T005]
gate: human-release
status: todo
attempts: 0
max_attempts: 3
size: S
spec_refs: ["project.md#59-phases"]
paths: ["docs/phases/phase-9.md"]
```

**Goal:** Ecosystem milestone approval.

**Deliverables:**
- Phase report

**Acceptance criteria:**
- [ ] Plugin SDK published
- [ ] Registry legal sign-off

**Verify:**
```bash
pnpm build
```


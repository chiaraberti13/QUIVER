# QUIVER — project.md

> **Language:** source code, runtime UI and engineering specifications remain in English. The README and public-facing presentation, contribution and security documentation are available in English and Italian; see [ADR 0004](docs/adr/0004-bilingual-public-documentation.md).
>
> **Status:** v3.2 — product specification; implementation is at the monorepo scaffold stage. See the [development status](docs/presentation/development-status.md) for the distinction between existing foundations and planned capabilities.
> **Derived from:** `progetto.md` v2. All v2 decisions remain valid; changes are listed in §0 and in *Open Decisions* (§60).

---

## Table of contents

- Part A — Product: §1–§17
- Part B — Security: §18–§27
- Part C — Secure Coding Standard: §28–§40
- Part D — Legal & compliance: §41–§44
- Part E — Engineering: §45–§51
- Part F — Design System: §52–§57
- Part G — Team & role perspectives: §58
- Part H — Delivery: §59–§63

---

## 0. What changed from v2

| Area | v2 | v3 |
|---|---|---|
| Language | Italian only | English only (code, docs, UI) |
| Secure coding | Principles only | Full Secure Coding Standard (Part C) with mandatory rules per area |
| Protected code | Not defined | Protected paths with mandatory independent security review + human checkpoint every 5 tasks (§27) |
| Frontmatter parsing | Not specified | Custom splitter + safe YAML; libraries that evaluate code are forbidden (§33) |
| Git operations | Not specified | Hardened Git invocation profile (§34) |
| Untrusted output | Not specified | Terminal and HTML output sanitization (§36) |
| Team | 13 roles listed | 14 roles with mission, deliverables, quality bar, review duties (Part G) |
| Design | UI rules only | Full design system: identity, tokens, icons, trust/risk language, UX flows (Part F) |
| Positioning | Not analyzed | Landscape of existing tools and differentiation (§2.1) |
| CI and team use | Not defined | `quiver.lock`, lockfile gate, GitHub Action, SARIF, shareable trust lists (§13, §14) |
| Interoperability | Not defined | Import from `npx skills`, optional external scanners, machine audit (§14) |
| Combined risk | Single skill only | Cross-skill toxic combinations (§12) |
| Storage fidelity | Not specified | Original bytes preserved; hash computed on normalized bytes (§10) |
| Time to value | First release after Phase 5 | CLI v0.1 released after Phase 4; Web UI in v0.2 (§59) |
| Ecosystem reach | Not defined | Read-only MCP server, Claude Code plugin, pre-commit hook (§14) |
| Shared intelligence | Not defined | Skill advisory database (OSV format) and public detection benchmark (§14, §48) |
| Naming | Assumed | Name and trademark check before first release (OD-9) |

---

# PART A — PRODUCT

## 1. What Quiver is

Quiver is an open-source, local-first, provider-agnostic ecosystem made of two independent products:

1. **Quiver Skills Hub** — discover, inspect, verify, version and safely install **Agent Skills** (folders containing a `SKILL.md`, scripts and references).
2. **Quiver Orchestrator** — run multiple AI agents (Claude Code, Codex, Gemini, local models) on the same software project, with roles, permissions, workflows and schedules.

An optional **Integration Bridge** lets the Orchestrator use pinned, verified Skill Snapshots from Skills Hub. Neither product requires the other.

*Practical example:* a developer finds a "secure-code-review" skill on GitHub. With Skills Hub they can see who wrote it, whether it contains scripts that open network connections, whether it changed since last week, and under which license it is published — **before** copying a single file into their project.

## 2. Problem statement

Agent Skills are spreading across GitHub with no reliable way to answer:

- Where does this skill really come from (original, fork, copy)?
- What does it do (scripts, network, filesystem, secrets)?
- Has it changed since I last checked it?
- Under which license can I use or redistribute it?
- Can I trust **this exact version**?

Running several AI agents on one project raises a second set of questions: who decides, who writes code, who reviews, which permissions each one has, and how to avoid hidden costs or uncontrolled pushes.

### 2.1 Existing tools and differentiation

The space is active. Quiver must interoperate with existing tools, not ignore them. Landscape as of October 2026 (`TO VERIFY` again before each release):

| Area | Existing tools (examples) | What they cover |
|---|---|---|
| Skill install and catalog | `skills` CLI (`npx skills`) + skills.sh directory | Cross-agent install, update, lock file, popularity directory |
| Skill security scanning | Snyk Agent Scan, Mondoo AI Agent Skill Check, SkillGuard, brunnr | Pattern-based detection of injection, exfiltration, malware; some cloud-based |
| Multi-agent orchestration | Vibe Kanban, Claude Squad, Microsoft Conductor, ccg-workflow, Raven, OmniAgent | Parallel agents in worktrees, cross-model review, pipelines |

**Where Quiver is different:**

1. **Trust bound to content:** approval applies to an exact canonical hash; one changed byte resets it.
2. **Provenance:** original vs fork vs copy, ownership changes, history rewrites.
3. **Risk diff between versions:** not only "what text changed" but "what the skill can now do".
4. **Local-first analysis:** no skill content leaves the machine unless the user opts in to an external scanner.
5. **Lockfile gate in CI:** `quiver.lock` fails a build when a skill changes without re-verification (§14).
6. **Shared intelligence:** an open advisory database of known-bad skill hashes and a public, reproducible detection benchmark.
7. **Inside the agent:** a read-only MCP server and a Claude Code plugin let the agent ask Quiver before using a skill.
8. **Orchestrator with honest enforcement:** every permission shows whether the provider really enforces it; skills are pinned by hash; audit is hash-chained.

## 3. Personas

| Persona | Goal | Main fear |
|---|---|---|
| **Solo developer** | Add useful skills to their agent quickly | Installing something malicious without noticing |
| **Team lead** | Standardize skills and agent workflows across a team | Inconsistent, unreviewed changes |
| **Security reviewer** | Audit what skills and agents can do | Claims of safety without evidence |
| **Skill maintainer** | Publish skills and be credited correctly | Copies and forks presented as originals |

## 4. Principles

1. **Two autonomous products.** Only the Integration Bridge may depend on both domains.
2. **Local-first.** Everything works on `localhost`; no mandatory Quiver cloud.
3. **Provider-agnostic.** Never `if (provider === "claude")` in domain code; use `provider.capabilities()`.
4. **No hidden spending.** Paid APIs are off by default; never a silent fallback to paid services.
5. **Explicit trust bound to content.** `DISCOVERED ≠ INSPECTED ≠ SCANNED ≠ VERIFIED ≠ INSTALLED ≠ UNIVERSALLY SAFE`.
6. **Immutable history.** Runs, snapshots and audit events are never rewritten.
7. **Enforcement outside the model.** No security control relies on an LLM obeying an instruction.
8. **Honest guarantees.** Every control declares its strength: `enforced`, `partial`, `advisory`.
9. **Human override.** Every autonomous workflow supports `PAUSE`, `RESUME`, `CANCEL`, `INSPECT`, `OVERRIDE`.
10. **Separation of concepts.** `MODEL ≠ AGENT ≠ ROLE ≠ SKILL ≠ WORKFLOW ≠ PROJECT`.
11. **Secure by default.** The safest option is the default; less safe options require an explicit, logged choice.

## 5. Glossary

| Term | Meaning | Example |
|---|---|---|
| **Skill** | A folder with `SKILL.md` and optional `scripts/`, `references/`, `assets/` | `secure-code-review/` |
| **SkillRecord** | Stable logical identity of a skill, survives renames and moves | ID `0192…` for "secure-code-review" |
| **SkillSource** | One place the skill comes from | `github.com/alice/skills/secure-code-review` |
| **SkillSnapshot** | Immutable content of a skill at one moment | Commit `a1b2c3`, hash `sha256:ab83…` |
| **contentHash** | Canonical SHA-256 of the snapshot content (§10) | One changed byte → different hash |
| **Capability** | Something a skill can do | `network.access`, `filesystem.write` |
| **Declared / Inferred / Observed** | Capability stated by the author / deduced by analysis / seen at runtime | `requests` import → `network.access` inferred |
| **TrustAssertion** | A recorded decision "I trust this exact content" | User verified snapshot `ab83…` |
| **Quarantine** | Snapshot blocked from installation pending review | Upstream history was rewritten |
| **Adapter** | Plugin that connects Quiver to an external system | Claude Code provider adapter |
| **Gate** | A point where automation stops for a human decision | Legal review before redistribution |
| **Artifact** | Structured, schema-validated output passed between agents | `ReviewArtifact` with findings |

## 6. Architecture

```text
                      QUIVER ECOSYSTEM
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌──────────────────────┐             ┌──────────────────────┐
│  QUIVER SKILLS HUB   │             │ QUIVER ORCHESTRATOR  │
│ Ingest / Inspect     │             │ Agent Runtime        │
│ Snapshot / Hash      │             │ Workflow Engine      │
│ Scan / Trust         │             │ Scheduler            │
│ Install / Sync       │             │ Policy / Budget      │
└──────────┬───────────┘             └──────────┬───────────┘
           └───────── INTEGRATION BRIDGE ───────┘
```

Shared packages (`contracts`, `events`, `database`, `security`, `ui`) contain **no domain logic** of either product. A CI rule enforces import boundaries (§47).

Usage modes:

```bash
quiver serve                       # Web UI on http://127.0.0.1:7317
quiver                             # interactive CLI
quiver skills scan ./skill --json  # headless / CI
```

---

## 7. Skills Hub — lifecycle

```text
DISCOVERED ──► INSPECTED ──► SCANNED ──► VERIFIED / TRUSTED
     │                          │
     │                          └──► QUARANTINED / REVOKED
     └── explicit decision at any time ──► INSTALLED
```

| State | Meaning |
|---|---|
| DISCOVERED | Known by URL or path; content not downloaded |
| INSPECTED | Downloaded into an isolated cache; snapshot created; **nothing executed** |
| SCANNED | Analysis pipeline completed |
| VERIFIED / TRUSTED | Trust assertion recorded on this snapshot |
| QUARANTINED | Blocked from installation until reviewed |
| INSTALLED | Active copy in a target; unverified install requires explicit confirmation and is logged |

**No phase executes skill code.** Analysis is static only.

## 8. Skills Hub — data model

```ts
type SkillRecord = {
  id: UUIDv7;
  canonicalName: string;
  slug: string;              // [a-z0-9-], max 64
  description?: string;      // max 1024, plain text
  primarySourceId?: UUIDv7;
  createdAt: Date;
  updatedAt: Date;
};

type SkillSource = {
  id: UUIDv7;
  skillId: UUIDv7;
  type: "github" | "git" | "local" | "registry" | "archive";
  url?: string;              // https only, validated (§35)
  repository?: string;
  path?: string;             // normalized relative path inside the repo
  owner?: string;
  ownerId?: string;          // numeric GitHub ID: stable across renames
  repositoryId?: string;     // numeric GitHub ID
  relation: "original" | "fork" | "mirror" | "derived" | "copy" | "unknown";
  relationConfidence: "high" | "medium" | "low";
  discoveredAt: Date;
  lastSyncedAt?: Date;
};

type SkillSnapshot = {
  id: UUIDv7;
  skillId: UUIDv7;
  sourceId: UUIDv7;
  commitSha?: string;        // 40 or 64 hex chars
  hashVersion: 1;
  contentHash: `sha256:${string}`;
  metadataHash?: `sha256:${string}`; // hash of .quiver/skill.json, separate
  manifest: SkillManifest;
  licenseSnapshotId?: UUIDv7;
  scanResultId?: UUIDv7;
  createdAt: Date;
};
```

Every content change produces a new snapshot. Old snapshots are never deleted by sync.

## 9. Skill format

```text
skill/
├── SKILL.md        # YAML frontmatter + instructions
├── scripts/
├── references/
├── assets/
└── .quiver/skill.json   # optional Quiver metadata, excluded from contentHash
```

```json
{
  "schemaVersion": 1,
  "declaredCapabilities": ["filesystem.read", "git.read"],
  "compatibility": ["anthropic", "openai", "google"]
}
```

Quiver **never modifies** the original `SKILL.md`.

## 10. Canonical content hash (hashVersion 1)

Goal: the same content produces the same hash on any OS, from any source.

1. **File set:** all regular files under the skill root, excluding `.git/`, `.quiver/`, `.DS_Store`, `Thumbs.db`.
2. **Rejected (ingestion fails):** symlinks, hardlinks, devices, FIFOs, sockets, paths containing `..`, absolute paths, case-insensitive collisions, paths that are not valid UTF-8.
3. **Paths:** relative, `/` separator, Unicode NFC, sorted by UTF-8 bytes.
4. **Content:** text files (valid UTF-8, no NUL byte) → `CRLF` → `LF`; binary files → raw bytes.
5. **Modes:** only `100644` and `100755`.
6. **Per file:** `sha256(normalizedBytes)`.
7. **Manifest:** list `[{ path, mode, size, sha256 }]`, serialized with RFC 8785 (JCS). (`blobSha256` is stored alongside but is **not** part of the hashed manifest.)
8. **Result:** `contentHash = "sha256:" + sha256("quiver-skill-v1\n" + JCS(manifest))`.

The domain prefix allows a future `hashVersion: 2` without invalidating existing snapshots.

**Golden vectors** (committed test fixtures) must pass identically on Linux, macOS and Windows.

**Storage fidelity.** Normalization is used **only to compute the hash**. The store keeps the **original bytes** of every file, addressed by `blobSha256 = sha256(originalBytes)`; the snapshot manifest records both `sha256` (normalized) and `blobSha256` (original) per file. Installation writes the original bytes, so a Windows script that needs `CRLF` is installed unchanged. Two sources whose files differ only in line endings share a `contentHash` (same trust) but keep separate blobs.

## 11. Analysis pipeline

```text
INGEST (isolated cache, nothing executed)
  → VALIDATE (limits, links, traversal, collisions)
  → NORMALIZE + HASH
  → MANIFEST PARSE (§33)
  → LICENSE SCAN
  → STATIC ANALYSIS
  → SCRIPT ANALYSIS
  → SECRET SCAN
  → PROMPT-INJECTION HEURISTICS
  → CAPABILITY INFERENCE
  → RISK ANALYSIS
  → SNAPSHOT + SCAN RESULT (with scanner version)
```

Each analyzer runs with a **time budget and a size budget**. An analyzer that exceeds its budget produces a finding `analysis_incomplete`, never a silent pass.

## 12. Capabilities and risk

Capabilities: `filesystem.read`, `filesystem.write`, `shell.execute`, `network.access`, `git.read`, `git.write`, `process.spawn`, `environment.read`, `secret.read`.

Each capability has three independent flags: **declared**, **inferred**, **observed** (observed only in a future sandboxed dynamic analysis). An inferred capability that is not declared is itself a finding.

```json
{
  "capability": "network.access",
  "declared": false,
  "inferred": true,
  "evidence": { "file": "scripts/fetch.py", "line": 3, "match": "import requests" }
}
```

Risk is shown per dimension with evidence, never as a single number alone:

```text
Code execution         HIGH     scripts/run.sh, scripts/check.py
Filesystem write       MEDIUM   scripts/check.py:44
Network access         HIGH     scripts/fetch.py:3
Secret access          NONE
Prompt injection       LOW      SKILL.md:88 (HTML comment)
Obfuscated code        NONE
License confidence     HIGH
Provenance confidence  HIGH
```

**A negative result means "nothing found by these analyzers", never "safe".** The UI states this explicitly.

**Cross-skill analysis.** Risks can emerge from combinations: skill A reads secrets, skill B can open network connections. When several skills are installed in the same target (or assigned to the same agent), Quiver evaluates the combined capability set and reports **toxic combinations** (e.g. `secret.read` + `network.access`, `filesystem.write` on agent config + `shell.execute`) with evidence from each skill.

## 13. Trust model

States: `UNSCANNED`, `SCANNED`, `VERIFIED`, `TRUSTED_LOCAL`, `TRUSTED_ORG`, `REVOKED`, `QUARANTINED`.

```ts
type TrustAssertion = {
  id: UUIDv7;
  snapshotId: UUIDv7;
  contentHash: string;
  scope: "user" | "organization" | "registry";
  kind: "content" | "source";
  status: TrustStatus;
  actorId: UUIDv7;
  reason?: string;
  createdAt: Date;
  revokedAt?: Date;
};
```

- **Content trust**: "these exact bytes were verified". Valid for any source producing the same `contentHash`.
- **Source trust**: "I trust whoever maintains this source". Valid only for that SkillSource.
- Trust is never propagated automatically to new snapshots.
- A fork with identical content shows *"content identical to a verified snapshot (source: X)"*, but does not inherit source trust.

**Shareable trust lists.** A team can commit `quiver.trust.json` to a repository: a list of `{ contentHash, scope, status, actor, reason, date }` entries. Importing it creates `TRUSTED_ORG` assertions bound to those exact hashes. The file is reviewed like code (PR), never fetched automatically from remote URLs, and entries for unknown hashes are ignored. Cryptographic signing of trust lists is evaluated in Phase 9 (OD-5).

## 14. Upstream sync, diff, install

**Sync:**

```text
CHECK UPSTREAM (conditional request)
  ├── unchanged → nothing
  └── changed → VERIFY ANCESTRY
        ├── linear → FETCH → NEW SNAPSHOT → SCAN → UNVERIFIED
        └── rewritten (force push) → NEW SNAPSHOT → QUARANTINED + alert
```

Owner or repository ID change → alert and quarantine of new snapshots.

**Diff:**

```bash
quiver skills diff secure-code-review@<snapA> secure-code-review@<snapB>
```

Shows file changes, capability changes, license change, risk change, provenance change.

**Install:**

- always a precise snapshot, never `latest`;
- original bytes copied from the content-addressed store; blob hashes and `contentHash` re-verified before and after copy;
- atomic: write into a temporary directory inside the target parent, then rename;
- unverified snapshot requires `--accept-unverified` (CLI) or explicit confirmation (UI), logged;
- each install recorded as `Installation`.

Targets via `SkillTargetAdapter`: Quiver Library, Claude Code, OpenAI Codex, Gemini, project directory, custom path. Target directory locations are `TO VERIFY` per provider (§61).

**Lockfile (`quiver.lock`).** A project can pin its skills:

```json
{
  "lockfileVersion": 1,
  "skills": [
    {
      "name": "secure-code-review",
      "target": "claude-code/project",
      "source": "github:alice/skills/secure-code-review",
      "snapshotId": "0192…",
      "contentHash": "sha256:ab83…",
      "trust": "TRUSTED_ORG"
    }
  ]
}
```

- `quiver skills lock` writes the file from current installations.
- `quiver skills verify --lockfile` recomputes the hash of every installed skill and fails (exit `4`) if any differs from the lock, is missing, or is not trusted according to policy.
- The file contains no secrets and is deterministic (sorted, JCS-compatible).
- **A matching hash is not enough:** verify also requires each pinned hash to satisfy the trust policy, so a PR that edits `quiver.lock` to pin an unverified snapshot fails.
- Recommended for user repositories: `CODEOWNERS` entries on `quiver.lock` and `quiver.trust.json`, because a PR could change both together (T19). The Action writes a summary of lock and trust-list changes to the job summary.

**CI gate.** A GitHub Action wraps `quiver skills verify --lockfile` and `quiver skills scan --format sarif`, uploading SARIF so findings appear in GitHub code scanning. The Action runs with `contents: read`, pins its own dependencies, and never needs repository secrets.

**Machine audit.** `quiver skills audit` inventories the skill directories of supported agents on the local machine (locations from the target ADR, §61), creates snapshots for what it finds, and reports: unknown skills, skills changed since last audit, skills with high-risk findings, toxic combinations. Read-only: audit never modifies or deletes skills.

**Advisory database.** Quiver consumes an open advisory feed of known-malicious or vulnerable skills, in OSV format, keyed by `contentHash` and source:

- distributed as a public Git repository (`quiver-advisories`), fetched through the hardened Git profile (§34) and pinned to a commit in the local config;
- advisories can only **add** warnings or block installation; they can never grant trust;
- each advisory shows its source and date; the user may override a block for a specific hash, and the override is logged;
- works offline with the last fetched copy; fetching is never automatic during scans;
- publishing new advisories follows a coordinated-disclosure process with legal review (Phase 9).

**Agent integrations.**

- **Read-only MCP server** (`quiver mcp`): tools `inspect`, `scan`, `verify`, `audit`, `advisories`. It never exposes `install`, `trust`, `update` or any write operation: an agent can ask whether a skill is safe, but cannot approve it.
- **Claude Code plugin**: packages the MCP server and a skill that instructs the agent to check skills with Quiver before use (plugin format `TO VERIFY`).
- **pre-commit hook**: runs `quiver skills verify --lockfile` locally.

**Interoperability.**

- **Import from `npx skills` installations:** Quiver reads skills installed by the `skills` CLI and, where present, its lock file, mapping each entry to a SkillSource. Lock format `TO VERIFY`; Quiver never writes the other tool's files.
- **External scanners as optional plugins** (`ScannerPlugin`): e.g. SkillGuard, Snyk Agent Scan. Rules: disabled by default; scanners that send data to a remote service require explicit per-configuration opt-in with a clear notice of what is sent; executed through `safeExec` from an **absolute path set in config** (never resolved via `PATH`); output validated with a schema; external findings can **add** findings but never remove Quiver findings or set trust.
- **SARIF export** for any scan result.

## 15. Orchestrator

Multi-agent runtime that connects models, coding agents, local models, Git and GitHub. It does not provide a model.

```ts
interface ProviderAdapter {
  detect(): Promise<ProviderStatus>;
  authenticate(): Promise<AuthResult>;
  listModels(): Promise<Model[]>;
  capabilities(): Promise<Capability[]>;
  usagePolicy(): ProviderUsagePolicy;
  permissionMapping(): PermissionEnforcement;
  invoke(request: AgentRequest): Promise<AgentResponse>;
  usage(): Promise<UsageInfo | null>;
}

type ProviderUsagePolicy = {
  accessMode: "subscription-cli" | "api" | "local";
  automation: "allowed" | "unknown" | "disallowed";
  termsUrl?: string;
  checkedAt?: Date;
};

type EnforcementLevel = "enforced" | "partial" | "none";
type PermissionEnforcement = {
  filesystem: EnforcementLevel;
  shell: EnforcementLevel;
  network: EnforcementLevel;
  git: EnforcementLevel;
};
```

- **Agent** = Provider + Model + Role + Instructions + Tools + Permissions + Context Policy + Trigger Policy + optional Skills.
- **Roles:** Project Lead, Architect, Planner, Developer, Reviewer, Security Reviewer, Test Engineer, Documentation Agent, Release Manager, custom.
- **Multi-agent modes:** Fixed, Four Hands, Alternating, Round Robin, Consensus, Adversarial Review.
- **Reviewer triggers:** `after_plan`, `after_implementation`, `after_test`, `on_test_failure`, `on_security_failure`, `before_commit`, `before_push`, `before_merge`, `manual`; `max_cycles` then `pause_for_human`.
- **Workflow nodes:** Agent, Command, Test, Condition, Review, Approval, Git, GitHub, Script, Webhook, Wait, Notification, Skill (only with integration).
- **Artifacts** (`Task`, `Plan`, `Implementation`, `Diff`, `Test`, `Review`, `Decision`) are schema-validated; invalid model output is **rejected**, not interpreted.
- **Budget:** `Subscription → Free Tier → Local Model → STOP`; paid API off by default.
- **Automation policy:** `disallowed` → scheduler refuses unattended runs; `unknown` → explicit, logged user acknowledgement required.
- **Permissions:** effective = Agent ∩ Workflow ∩ Project ∩ User ∩ Skill. If a required control maps to `none`, the workflow is blocked or requires explicit, logged risk acceptance.

## 16. Integration Bridge

- Skill picker with sources: Installed, Skills Hub, Local, Project (`.agents/skills/`).
- Assignment pins `snapshot_id` and `contentHash`; hash re-verified before every execution.
- Permission reconciliation: required capability not permitted → assignment refused; inferred-but-undeclared capability → warning.
- `skill.trust.revoked` → affected workflows go `READY → BLOCKED` (or warning, per policy).
- Selection policy: **Manual** (default), Recommended, Automatic Trusted Only (content + source trust, risk ≤ threshold, compatible permissions, accepted license). Never automatic installation of arbitrary remote skills.

## 17. Interfaces

**API (local server):**

```text
GET    /api/skills                     GET    /api/skills/:id
GET    /api/skills/:id/snapshots       GET    /api/snapshots/:id
POST   /api/skills/import              POST   /api/skills/:id/sync
POST   /api/snapshots/:id/scan         POST   /api/snapshots/:id/trust
GET    /api/snapshots/:a/diff/:b       POST   /api/installations
GET/POST /api/projects | /api/agents | /api/workflows
GET    /api/providers                  POST   /api/providers/detect
POST   /api/runs                       GET    /api/runs/:id
POST   /api/runs/:id/{pause|resume|cancel}
```

**CLI:**

```bash
quiver skills search|inspect|import|scan|verify|diff|install|update|sync|history
quiver skills lock | verify --lockfile | audit | scan --format sarif
quiver trust export|import <quiver.trust.json>
quiver project add . | providers detect | agent create | workflow create
quiver run [--workflow <id>] [--headless] | schedule add | status | audit run <id>
```

All commands support `--json` and documented exit codes (`0` ok, `1` generic error, `2` usage error, `3` validation/security refusal, `4` blocked by policy/gate, `5` external service error).

---

# PART B — SECURITY

## 18. Security objectives

1. Never execute untrusted skill code outside an enforced sandbox.
2. Never let untrusted content (skills, repositories, model output) change policy, permissions or trust.
3. Never leak credentials (logs, database, artifacts, error messages, UI).
4. Make every trust decision traceable to evidence and to an actor.
5. Make tampering detectable (hash verification, hash-chained audit).

## 19. Threat model (STRIDE-oriented)

| # | Threat | STRIDE | Example | Mitigation |
|---|---|---|---|---|
| T1 | Malicious skill | E, I | Script exfiltrates `~/.ssh` | Static scan, quarantine, no execution during ingest, install gate |
| T2 | Compromised upstream | T | Maintainer account hijacked | New snapshots always UNVERIFIED, no silent update |
| T3 | Ownership change | S | Repo transferred, old name re-registered | Numeric `ownerId`/`repositoryId`; change → alert + quarantine |
| T4 | History rewrite | T | Force push replaces verified commits | Ancestry check; non-linear → QUARANTINED |
| T5 | Typosquatting | S | `secure-code-reveiw` | Name-similarity warning |
| T6 | Prompt injection | E | Hidden instructions in `SKILL.md` | Heuristics + enforcement outside the model |
| T7 | Malicious archive / repo | D, E | Zip slip, decompression bomb, symlink to `/etc` | Ingestion limits and path rules (§31) |
| T8 | Git-level attacks | E | Malicious hooks, submodules, `file://` transport | Hardened Git profile (§34) |
| T9 | Local UI attack | S, E | DNS rebinding, CSRF from a website | Loopback bind, Host/Origin checks, session token (§38) |
| T10 | Output injection | T | ANSI escapes in terminal, XSS in rendered Markdown | Output sanitization (§36) |
| T11 | Parser abuse | D | YAML bombs, ReDoS, huge JSON | Size limits, safe parsers, regex budget (§33) |
| T12 | SSRF | I | Import URL pointing to `169.254.169.254` | URL policy (§35) |
| T13 | Credential theft | I | Token in logs or DB | OS keychain, redaction (§37) |
| T14 | Runaway agent | E, T | Push to `main`, force push | Git safety defaults (§26) |
| T15 | Store tampering | T | File modified in local store | Hash re-verified before every use |
| T16 | Supply chain | E | Malicious npm dependency | Dependency policy (§39) |
| T17 | Self-modifying automation | E | Development routine weakens its own guardrails | Mandatory security review, checkpoint every 5 tasks, guardrail changes highlighted (§27) |
| T18 | External scanner data leakage | I | Skill content sent to a cloud scanner without consent | External scanners off by default; explicit opt-in with notice (§14) |
| T19 | Poisoned trust list | S, T | Malicious `quiver.trust.json` marks a bad hash trusted | Imported only from reviewed files, never remote URLs; bound to exact hashes; import logged (§13) |
| T20 | Agent self-approval | E | An agent uses the MCP server to mark a skill trusted | MCP server is read-only; no trust/install tools (§14) |
| T21 | Poisoned advisory feed | T, D | False advisories block legitimate skills | Feed pinned to a commit; advisories never grant trust; per-hash logged override (§14) |

The threat model is a living document: every phase exit (§59) reviews it.

## 20. Enforcement points

A skill installed in Claude Code or Codex runs **inside that agent's process**, not inside Quiver. Quiver cannot isolate it directly.

| Point | Applied by | Strength |
|---|---|---|
| Install gate (scan, trust, quarantine) | Quiver | `enforced` |
| Hash verification before use | Quiver | `enforced` |
| Scripts executed by Quiver itself | Quiver sandbox | `enforced` where available |
| Agent permissions | Provider's native permission system, configured by the adapter | `enforced` / `partial` / `none` |
| Textual instructions to the model | The model | `advisory` (never a control) |

## 21. Sandbox (scripts executed by Quiver)

```text
filesystem   → read-only + private temp dir
network      → disabled
environment  → allowlist only
secrets      → unavailable
processes    → CPU, memory, wall-time, process-count limits
```

- Linux: bubblewrap (user, mount, network namespaces).
- macOS / Windows: container (Podman or Docker) if available.
- No sandbox available → execution of untrusted scripts is **refused**.

## 22. Prompt and skill injection

Authority levels: `SYSTEM POLICY > PROJECT POLICY > AGENT INSTRUCTIONS > SKILL INSTRUCTIONS > REPOSITORY CONTENT > EXTERNAL CONTENT`.

1. Permissions are enforced outside the model.
2. High-impact actions go through controlled tools, never free-form commands accepted unfiltered.
3. The scanner flags: instructions to ignore rules, requests for credentials, exfiltration URLs, `curl|sh`, HTML comments, invisible Unicode (tag characters U+E0000–U+E007F, zero-width characters), bidirectional controls (U+202A–U+202E, U+2066–U+2069), base64 blobs.
4. Results are heuristic; the UI says so.

## 23. Security boundaries

`Quiver Core │ Agent Process │ Skill Process │ Project Workspace │ Credentials │ Network` — every crossing goes through the Permission Engine and is audited.

## 24. Audit

Each run records: ID, project, workflow, trigger, times, agents, providers, models, skill snapshots, commands, files changed, tests, reviews, approvals, Git operations, usage, cost, accepted risks, result.

Audit events are append-only and **hash-chained**: `event.hash = sha256(prevHash + JCS(eventWithoutHash))`. `quiver audit verify` recomputes the chain.

## 25. Vulnerability disclosure

`SECURITY.md` defines a private reporting channel (GitHub private vulnerability reporting), response targets and supported versions. Security fixes get a GitHub Security Advisory.

## 26. Git safety defaults (Orchestrator)

```yaml
git:
  allow_commit: true
  allow_push: false
  protected_branches: [main]
  direct_main: { allowed: false }
  force_push: { allowed: false }
```

Autonomous workflows work on dedicated branches and deliver through Pull Requests.

## 27. Protected paths and checkpoint reviews (Quiver's own repository)

Development is done by an autonomous routine with automatic merge. Human oversight happens through **checkpoints**, not through per-PR approval.

**Protected paths** — changes here are auto-mergeable only with additional controls:

```text
packages/security/**
packages/skill-engine/src/ingest/**
packages/skill-engine/src/hash/**
packages/skill-scanner/**
packages/sandbox/**
packages/git/src/exec/**
apps/server/src/security/**
apps/web/src/render/**
apps/mcp/src/tools/**
packages/skill-engine/src/advisories/**
providers/*/src/permissions/**
.github/**
LICENSE*
package.json, pnpm-lock.yaml, pnpm-workspace.yaml (dependency changes)
```

Additional controls for protected paths:

1. `security-engineer` review is **mandatory**, in a clean context with read-only tools. If `security-engineer` is the owner, two other reviewers are required (`tech-lead` and `qa-engineer`).
2. The PR description lists every protected file changed and the `SC-xx` rules applied.
3. All security CI checks (§49) must pass; no check may be disabled, skipped or weakened in the same PR.
4. Every change is flagged in the next checkpoint report.

**Checkpoint every 5 completed tasks:**

1. After the 5th task merged by the routine since the last checkpoint, the routine writes `docs/checkpoints/CP-NNN.md` and creates `.quiver/CHECKPOINT_PENDING`.
2. While `.quiver/CHECKPOINT_PENDING` exists, the routine starts **no new task**.
3. The report contains: tasks completed, merged PRs, cumulative diff statistics, protected paths touched (with diff links), dependencies added or changed, guardrail or CI changes, security findings, threat model delta, open risks, and decisions waiting for the release owner.
4. The release owner reviews the report and either:
   - **approves:** sets `status: approved` in the report and deletes `.quiver/CHECKPOINT_PENDING` (the routine resumes);
   - **requests changes:** sets `status: changes_requested` and lists corrective items; the routine creates fix tasks (`FIX-NNN`) at the top of the queue before resuming.
5. Tasks completed by humans (legal, pentest, release gates) do not count toward the 5.

**Residual risk (accepted by design):** between two checkpoints up to 5 tasks, including protected-path changes, are merged without human review. Mitigations: mandatory independent security review, CI enforcement, small PRs, and the ability to revert any checkpoint window as a whole.

---

# PART C — SECURE CODING STANDARD

Mandatory for every contribution, human or AI. Reviewers reject code that violates a **MUST** rule. Each rule has an ID (`SC-xx`) to be cited in reviews.

## 28. Language and type safety

- **SC-01** TypeScript `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`.
- **SC-02** No `any` in production code; `unknown` + validation instead. Lint rule enforced.
- **SC-03** No `eval`, `new Function`, `vm.runIn*`, dynamic `require`/`import()` with non-literal paths.
- **SC-04** No prototype-polluting merges of untrusted objects; parsed objects created with schemas, never `Object.assign(target, untrusted)`.

## 29. Input validation

- **SC-05** Every trust boundary (CLI args, HTTP body/query/params, config files, `SKILL.md`, `.quiver/skill.json`, GitHub API responses, model output) is validated with a **Zod schema** before use.
- **SC-06** Schemas are strict (`.strict()`): unknown keys rejected.
- **SC-07** Every string has a maximum length; every array a maximum size; every number a range.
- **SC-08** Validation errors return a generic message to the client and a detailed message only to local debug logs.

## 30. Process execution

- **SC-09** Use only the `safeExec` wrapper from `packages/security`. Direct `child_process` imports are forbidden by lint outside that package.
- **SC-10** `safeExec` uses `execFile`/`spawn` with **argument arrays**; `shell: true` is forbidden.
- **SC-11** Always pass `--` before user-controlled positional arguments (e.g. `git checkout -- <path>`).
- **SC-12** Environment is built from an allowlist; never pass `process.env` wholesale.
- **SC-13** Every execution has a timeout, a maximum output size, and is killed with its process group on timeout.

## 31. Filesystem

- **SC-14** Resolve every path with `resolveWithin(root, relative)`: rejects absolute paths, `..` escapes, NUL bytes, and verifies the real path stays inside `root`.
- **SC-15** Use `lstat`, never `stat`, when walking untrusted trees; symlinks and special files are rejected.
- **SC-16** Avoid TOCTOU: open files with `O_NOFOLLOW` where supported and validate the opened handle, not the path.
- **SC-17** Temporary directories via `mkdtemp` with mode `0700`; cleaned up in `finally`.
- **SC-18** Quiver data directories `0700`, database and config files `0600` (POSIX).
- **SC-19** Writes that must not be partial are atomic: write temp file in same directory, `fsync`, `rename`.
- **SC-20** Archive extraction: reject entries with absolute paths, `..`, links; enforce maximum entries, total uncompressed size, and compression ratio.

## 32. Data storage

- **SC-21** SQL only through prepared statements / the query builder; string concatenation into SQL is forbidden.
- **SC-22** Migrations are versioned, forward-only in production, tested on an empty and a populated database.
- **SC-23** No secrets in the database. Credentials are references to the OS keychain.

## 33. Parsing untrusted formats

- **SC-24** `SKILL.md` frontmatter is split by a **custom, bounded splitter** and parsed with a YAML parser configured for the core schema only (no custom tags, no merge-key expansion beyond limits, alias count limited).
- **SC-25** Libraries that can **evaluate code** from frontmatter (e.g. engines that execute `---js` blocks) are forbidden.
- **SC-26** Size limits: `SKILL.md` ≤ 256 KB, frontmatter ≤ 16 KB, JSON files ≤ 1 MB (configurable, enforced before parsing).
- **SC-27** Regular expressions applied to untrusted text must be linear-time safe (reviewed for catastrophic backtracking, tested with adversarial inputs) or run under a time budget.
- **SC-28** Parsers and the hash function have property-based / fuzz tests.

## 34. Git hardening profile

All Git invocations on untrusted repositories go through `packages/git/src/exec` with:

- `GIT_TERMINAL_PROMPT=0`, `GIT_ASKPASS` unset, `GIT_CONFIG_NOSYSTEM=1`, isolated `HOME`/`XDG_CONFIG_HOME`;
- `-c core.hooksPath=<empty dir>` — no hooks ever run;
- `-c core.symlinks=false`, `-c core.fsmonitor=false`;
- `-c protocol.allow=never -c protocol.https.allow=always` — HTTPS only (no `file://`, `ext::`, `ssh` for untrusted sources);
- `--no-recurse-submodules`; submodules never fetched automatically;
- shallow/partial clone where possible; timeouts and size limits;
- no checkout into the user's working tree: content is read into the isolated cache.

Exact flags are verified against the installed Git version in a dedicated task (`TO VERIFY`).

## 35. Network and URLs

- **SC-29** Outbound URLs are parsed with the WHATWG `URL` API and checked against a policy: `https:` only; host allowlist for ingestion (initially `github.com`, `api.github.com`, `codeload.github.com`, `raw.githubusercontent.com`).
- **SC-30** Resolved IPs in private, loopback, link-local and metadata ranges are rejected for remote sources (SSRF), re-checked after redirects; redirects limited.
- **SC-31** All outbound requests have timeouts, response-size limits and a descriptive `User-Agent`.
- **SC-32** TLS verification is never disabled.

## 36. Output handling

- **SC-33** **Terminal:** untrusted text printed by the CLI is stripped of control characters and ANSI escape sequences, and bidi controls are made visible (e.g. `<U+202E>`).
- **SC-34** **Web:** untrusted Markdown is rendered with raw HTML disabled, then sanitized (DOMPurify); `dangerouslySetInnerHTML` is allowed only in `apps/web/src/render/**` (protected path).
- **SC-35** Links from untrusted content get `rel="noopener noreferrer nofollow"`; non-`https` schemes are not rendered as links.
- **SC-36** Invisible and bidi characters are highlighted in the skill file viewer.

## 37. Secrets and logging

- **SC-37** Credentials live in the OS keychain (library choice `TO VERIFY`); env vars only as temporary input.
- **SC-38** Structured JSON logs; a redaction layer masks known token patterns, `Authorization` headers and keychain values before writing.
- **SC-39** Error messages shown to users never include stack traces, tokens or full environment.
- **SC-40** CI runs a secret scanner (gitleaks) on every PR.

## 38. Local server

- **SC-41** Bind `127.0.0.1` by default; binding elsewhere requires an explicit flag and prints a warning.
- **SC-42** Validate `Host` (must be `127.0.0.1:<port>` or `localhost:<port>`) and `Origin` on every request → DNS rebinding and CSRF protection.
- **SC-43** Session token generated with a CSPRNG at startup, delivered via one-time URL that is exchanged on first request and immediately invalidated (redirect to a clean URL, `Cache-Control: no-store`), then stored in an `HttpOnly`, `SameSite=Strict` cookie; compared in constant time.
- **SC-44** No state change on `GET`; CORS disabled; body size limits; rate limiting on mutating routes.
- **SC-45** Headers: strict CSP without `unsafe-inline`/`unsafe-eval`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `frame-ancestors 'none'`.

## 39. Dependencies and supply chain

- **SC-46** Minimal dependencies; each new dependency needs a justification in the PR (purpose, maintenance, downloads, license, alternatives) and is listed in the next checkpoint report (§27).
- **SC-47** Exact versions, committed lockfile, `pnpm install --frozen-lockfile` in CI; install scripts disabled by default with an explicit allowlist.
- **SC-48** CI: `osv-scanner` (or equivalent) on the lockfile, GitHub dependency review, CodeQL, Semgrep, gitleaks.
- **SC-49** Releases: npm provenance, SBOM (CycloneDX), signed tags.
- **SC-50** GitHub Actions pinned to full commit SHA; workflow `permissions` minimal (`contents: read` by default); no `pull_request_target` with checkout of PR code.

## 40. Cryptography and identifiers

- **SC-51** Only SHA-256 (hashing) and Node's `crypto.randomBytes`/`randomUUID` (randomness); no custom crypto.
- **SC-52** Constant-time comparison for tokens and hashes used in security decisions.
- **SC-53** IDs are UUIDv7; never use IDs as authorization.

---

# PART D — LEGAL & COMPLIANCE

> Design decisions, not legal advice. Every item marked `TO VERIFY` requires the Legal Advisor (human gate).

## 41. Licenses and redistribution

| Situation | Index metadata + link | Local cache for analysis | Redistribute (shared registry) |
|---|---|---|---|
| Permissive (MIT, Apache-2.0, BSD) | Yes | Yes | Yes, with attribution and notices |
| Copyleft (GPL, AGPL) | Yes | Yes | Yes, honoring license obligations |
| Unrecognized license | Yes | Yes | No, until verified |
| **No license** | Yes | Yes | **No** — all rights reserved |

## 42. AI provider terms

Each adapter documents its `ProviderUsagePolicy`, the terms URL and the verification date. Consumer subscriptions default to `automation: unknown` until verified (`TO VERIFY`).

## 43. GitHub API

Authenticated, conditional requests (`ETag`), primary and secondary rate limits respected with backoff, no HTML scraping where an API exists, compliance with GitHub Terms of Service.

## 44. Personal data

Only public data needed for attribution and provenance is stored. A future public registry provides a removal procedure (GDPR).

---

# PART E — ENGINEERING

## 45. Stack

| Component | Choice | Docs |
|---|---|---|
| Language | TypeScript (strict) | https://www.typescriptlang.org/docs/ |
| Runtime | Node.js LTS (exact version `TO VERIFY`) | https://nodejs.org/docs/latest/api/ |
| Monorepo | pnpm workspaces | https://pnpm.io/workspaces |
| Server | Fastify | https://fastify.dev/docs/latest/ |
| Web UI | Vite + React SPA | https://vite.dev/guide/ · https://react.dev/ |
| CLI | Commander | https://github.com/tj/commander.js |
| Validation | Zod (single source) → generated JSON Schema | https://zod.dev |
| Local DB | SQLite | https://www.sqlite.org/docs.html |
| YAML | `yaml` (core schema) | https://eemeli.org/yaml/ |
| Markdown | markdown-it (`html: false`) + DOMPurify | https://markdown-it.github.io/ · https://github.com/cure53/DOMPurify |
| Unit tests | Vitest + fast-check | https://vitest.dev/ · https://fast-check.dev/ |
| E2E | Playwright | https://playwright.dev/docs/intro |
| Boundaries | dependency-cruiser | https://github.com/sverweij/dependency-cruiser |

Library versions and any library not listed above are chosen in dedicated tasks and recorded in ADRs.

## 46. Monorepo

```text
quiver/
├── apps/
│   ├── web/                 # Vite + React SPA
│   ├── server/              # Fastify: API + static SPA
│   └── cli/
├── packages/
│   ├── contracts/           # Zod schemas (single source)
│   ├── database/
│   ├── events/
│   ├── security/            # safeExec, resolveWithin, redaction, url policy
│   ├── sandbox/
│   ├── git/
│   ├── ui/                  # design tokens + React components
│   ├── skill-engine/        # ingest, hash, store, manifest
│   ├── skill-scanner/
│   ├── skill-sources/
│   ├── skill-targets/
│   ├── agent-runtime/
│   ├── workflow-engine/
│   └── scheduler/
├── providers/               # anthropic, openai, google, ollama, lm-studio
├── integrations/orchestrator-skills/
├── docs/{adr,design,routine,user,dev}/
└── tests/fixtures/skills/   # including simulated malicious skills
```

## 47. Boundary rules (CI-enforced)

- `packages/skill-*` must not import Orchestrator packages and vice versa.
- Only `integrations/orchestrator-skills` may import both.
- Only `packages/security` may import `node:child_process`.
- Only `apps/web/src/render/**` may use `dangerouslySetInnerHTML`.

## 48. Testing strategy

| Level | Tooling | Minimum |
|---|---|---|
| Unit | Vitest | Line coverage ≥ 85% on `skill-engine`, `skill-scanner`, `security` |
| Property / fuzz | fast-check | Hash, path resolution, frontmatter, URL policy |
| Integration | Vitest + temp dirs | Ingest → hash → store → scan → install |
| Security fixtures | `tests/fixtures/skills/malicious/*` | 100% expected findings |
| Public benchmark | `benchmark/` corpus (benign + malicious, inert) | Precision and recall published with every release; regressions block release |
| E2E | Playwright | Key UX flows (§56) |
| Accessibility | axe-core in Playwright | Zero serious/critical violations |
| Cross-platform | CI matrix Linux/macOS/Windows | Golden hash vectors identical |

## 49. CI pipeline (required checks)

`lint` · `typecheck` · `test (linux, macos, windows)` · `boundaries` · `coverage` · `secret-scan` · `dependency-scan` · `codeql` · `semgrep` · `e2e` (from Phase 5) · `a11y` (from Phase 5).

## 50. Definition of Done

A task is done when: acceptance criteria pass, all required checks are green, reviewers approved, docs updated, no new `TODO` without an issue, threat model updated if the attack surface changed, `roadmap.md` status updated in the same merge.

## 51. ADRs

Architecture Decision Records in `docs/adr/NNNN-title.md` (context, decision, consequences, alternatives). Initial set: stack, canonical hash, storage layout, secure coding standard, design tokens.

---

# PART F — DESIGN SYSTEM

Owned jointly by the **Visual Designer** (how it looks) and the **UX Designer** (how it works and what it says).

## 52. Identity

**Concept.** A *quiver* holds arrows ready to be used. Skills are the arrows: chosen deliberately, checked before use, each one with a known origin. The identity must communicate **precision and control**, not speed or hype.

**Logo directions** (to be explored, one chosen by the release owner at a checkpoint):

| Direction | Description | Rationale |
|---|---|---|
| A — Fletching mark | Three stylized arrow fletchings arranged as a stack | Reads as "collection of tools"; scales well to 16 px |
| B — Q-arrow | Letter Q whose tail is an arrow shaft | Strong wordmark link; risk of looking generic |
| C — Verified quiver | Quiver outline with a single arrow and a check notch | Directly evokes verification; more detailed, test at small sizes |

Constraints: single-color version mandatory; legible at 16 px; built on a 24-unit grid; SVG optimized, no embedded raster, no scripts in SVG.

## 53. Design tokens

Tokens live in `packages/ui/tokens/*.json` and are exported as CSS custom properties. Values below are the starting proposal; the Visual Designer finalizes them and **verifies contrast with a tool**, recording ratios in `docs/design/tokens.md`.

**Color — neutral base (light / dark):**

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#FAFAF7` | `#0F1115` |
| `--color-surface` | `#FFFFFF` | `#171A21` |
| `--color-border` | `#D9DCE1` | `#2A2F3A` |
| `--color-text` | `#14171C` | `#E8EAED` |
| `--color-text-muted` | `#555B66` | `#A3A9B4` |
| `--color-accent` | `#1F4FD1` | `#7EA2FF` |

**Color — semantic (trust and risk):**

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-verified` | `#0E7A43` | `#4CC38A` | VERIFIED / TRUSTED |
| `--color-caution` | `#8A5A00` | `#F0B74A` | SCANNED with findings, MEDIUM |
| `--color-danger` | `#B3261E` | `#FF8A80` | HIGH risk, REVOKED |
| `--color-quarantine` | `#6B3FA0` | `#C3A3F0` | QUARANTINED |
| `--color-unknown` | `#555B66` | `#A3A9B4` | UNSCANNED, unknown |

Requirement: text tokens ≥ 4.5:1 against their background, UI components and icons ≥ 3:1 (WCAG 2.2 AA).

**Typography:** UI sans-serif with system fallback stack; monospace for hashes, paths and code. Scale (rem): 0.75 / 0.875 / 1 / 1.125 / 1.25 / 1.5 / 2. Line height 1.5 for body, 1.25 for headings. Hashes always monospace, shown shortened (`sha256:ab83…9f1c`) with copy-full action.

**Spacing:** 4-px base: 4, 8, 12, 16, 24, 32, 48, 64. **Radius:** 4 (controls), 8 (cards). **Elevation:** two levels only. **Motion:** 120–200 ms, ease-out; all non-essential motion disabled under `prefers-reduced-motion`.

Fonts are bundled locally (no remote font requests) to respect the strict CSP and local-first principle.

## 54. Iconography

- 24-unit grid, 1.5-unit stroke, rounded caps and joins, outline style; filled variant only for active states.
- Pure SVG, `currentColor` fill/stroke, `aria-hidden="true"` when paired with text.
- Minimum set: verified, trusted-local, trusted-org, scanned, unscanned, quarantined, revoked, risk-high, risk-medium, risk-low, risk-none, capability icons (filesystem, network, shell, git, secret, process), diff (added/removed/modified), provenance (original, fork, mirror, copy).

## 55. Trust and risk language

**Rule: text + icon + color, never color alone.**

| State | Icon | Color token | Label | Microcopy tone |
|---|---|---|---|---|
| UNSCANNED | dashed circle | unknown | Not scanned | Neutral: "Not analyzed yet." |
| SCANNED | magnifier | caution / unknown | Scanned — N findings | Factual: "Analysis found 3 items to review." |
| VERIFIED | shield-check | verified | Verified | Bounded: "Verified by you on 4 Oct. Applies to this exact content only." |
| TRUSTED_ORG | shield-people | verified | Trusted by organization | Bounded, names the organization |
| QUARANTINED | lock-box | quarantine | Quarantined | Explanatory: "Blocked because the source history was rewritten." |
| REVOKED | shield-x | danger | Trust revoked | Direct: "Trust revoked on 5 Oct: reason." |

**Microcopy principles:** clear; never alarmist; **never more reassuring than the evidence**; always say what was checked and what was not; actions labeled with verbs describing the outcome ("Install unverified snapshot", not "OK").

| Good | Bad |
|---|---|
| "No secrets found by the secret scanner." | "This skill is safe." |
| "This script can open network connections (scripts/fetch.py:3)." | "Dangerous skill!!" |
| "Install unverified snapshot" | "Continue" |

## 56. Key UX flows

Each flow is specified in `docs/design/flows/` with steps, screens, empty states, errors, confirmations and keyboard path.

0. **First run (CLI):** `npx quiver audit` with zero configuration → inventory of installed skills across detected agents → top risks first → one suggested next command. Success = useful result in under a minute, no account, nothing sent over the network.
1. **Inspect without installing:** search → skill detail → files with highlighted invisible characters → risk evidence → provenance → *no install button pressed*. Success = user understands risk without leaving the page.
2. **Install an unverified snapshot:** install → confirmation sheet summarizing capabilities, risks, license and the exact hash → explicit checkbox "I understand this snapshot is not verified" → install → result with undo/uninstall.
3. **Approve an update:** update badge → diff (files, capabilities, license, risk, provenance) → scan if needed → approve or keep current.
4. **Configure an agent and assign skills:** provider → role → permissions (with enforcement level shown per provider) → skills picker → permission reconciliation warnings → save.
5. **Pause and inspect an autonomous run:** run timeline → current node → artifacts → pause/resume/cancel/override with confirmation.

Empty states always suggest the next action; errors say what happened, why, and what the user can do.

## 57. Accessibility

WCAG 2.2 AA: full keyboard navigation, visible focus (≥ 2 px, ≥ 3:1), logical heading order, labeled controls, live regions for long operations (scan progress), screen reader names for status badges ("Trust status: verified"), target size ≥ 24×24 px, no information conveyed by color alone, `prefers-reduced-motion` and `prefers-color-scheme` respected.

---

# PART G — TEAM AND ROLE PERSPECTIVES

## 58. Roles

Each role is a "hat" the development agent wears. Roles marked **HUMAN GATE** are never simulated: automation stops and asks a person.

### 58.1 Tech Lead / Software Architect (`tech-lead`)

- **Mission:** keep Quiver coherent: two independent products, stable contracts, explicit decisions.
- **Owns:** package boundaries, `packages/contracts`, ADRs, task decomposition, Open Decisions.
- **Deliverables:** `docs/adr/*`, boundary config, contracts, phase-exit reviews.
- **Quality bar:** boundary check green; every architectural change has an ADR; no circular dependencies.
- **Interfaces:** all roles; final arbiter on cross-role conflicts (except security-critical, where security-engineer can block).
- **Risks:** scope creep, coupling between products → mitigated by boundary CI and sequential phases.
- **Review duties:** contracts, boundary config, any change spanning more than one package group.

### 58.2 Backend Engineer (`backend-engineer`)

- **Mission:** implement the core engine correctly, deterministically and safely.
- **Owns:** skill-engine (non-protected parts), database, CLI, API routes, sources, targets, workflow engine, scheduler.
- **Deliverables:** packages and apps listed in §46 with tests.
- **Quality bar:** coverage thresholds (§48); deterministic outputs; all inputs validated (SC-05).
- **Interfaces:** security-engineer (safe primitives), qa-engineer (fixtures), frontend-engineer (API contracts).
- **Risks:** platform-specific bugs (paths, line endings) → golden vectors on three OSes.
- **Review duties:** CLI and API changes made by others; database migrations.

### 58.3 Application Security Engineer (`security-engineer`)

- **Mission:** make Quiver's trust claims true.
- **Owns:** threat model, Secure Coding Standard, `packages/security`, `packages/sandbox`, `packages/skill-scanner`, Git hardening, server security, URL policy.
- **Deliverables:** safe primitives (`safeExec`, `resolveWithin`, redaction, URL policy), scanner analyzers, security tests, `SECURITY.md`.
- **Quality bar:** every rule SC-xx has at least one test or lint rule; malicious fixtures 100% detected; no high CodeQL/Semgrep findings open.
- **Interfaces:** mandatory reviewer of all protected paths; works with qa-engineer on fixtures and ai-engineer on permission mapping.
- **Risks:** false sense of safety → explicit "not found ≠ safe" language with ux-designer.
- **Review duties:** **mandatory reviewer** on every protected path (§27) and every task touching parsing, I/O, network, process execution, auth or rendering of untrusted content. Can block any merge.

### 58.4 AI / LLM Engineer (`ai-engineer`)

- **Mission:** connect providers honestly, with real permission enforcement.
- **Owns:** provider adapters, `usagePolicy`, `permissionMapping`, artifacts, multi-agent modes, prompt-injection heuristics (with security-engineer).
- **Deliverables:** `providers/*`, `packages/agent-runtime`, artifact schemas.
- **Quality bar:** every adapter declares enforcement levels backed by tests; invalid artifacts rejected; no provider-specific branches in domain code.
- **Interfaces:** security-engineer, backend-engineer, legal-advisor (terms).
- **Risks:** overstating enforcement → each `enforced` claim has an automated test.
- **Review duties:** anything touching provider integration or artifact schemas.

### 58.5 Frontend Engineer (`frontend-engineer`)

- **Mission:** turn the design system into a fast, accessible, secure UI.
- **Owns:** `apps/web` (except `src/render`, co-owned with security), `packages/ui` components.
- **Deliverables:** pages, components, diff viewer, workflow builder, Playwright tests.
- **Quality bar:** zero serious axe violations; no inline scripts (CSP); untrusted content only through `src/render`; tokens only, no hard-coded colors.
- **Interfaces:** ux-designer, visual-designer, backend-engineer.
- **Risks:** XSS via rendered skill content → SC-34.
- **Review duties:** UI changes by others.

### 58.6 Visual Designer (`visual-designer`)

- **Mission:** give Quiver a precise, trustworthy, recognizable look.
- **Owns:** logo, icon set, palette, typography, tokens, illustrations, light/dark themes.
- **Deliverables:** `docs/design/identity.md`, `packages/ui/tokens/*.json`, `packages/ui/icons/*.svg`, `docs/design/tokens.md` with contrast ratios.
- **Quality bar:** all SVGs optimized and script-free; contrast verified (§53); icons legible at 16 px; consistent 24-unit grid.
- **Interfaces:** ux-designer (semantics of states), frontend-engineer (implementation), technical-writer (README visuals).
- **Risks:** decorative choices that weaken meaning → every color has a semantic token and a text equivalent.
- **Review duties:** any change to tokens, icons or visual assets.

### 58.7 UX Designer (`ux-designer`)

- **Mission:** make risk, trust and automation understandable and controllable.
- **Owns:** information architecture, flows (§56), microcopy guide, accessibility requirements, empty/error states.
- **Deliverables:** `docs/design/ia.md`, `docs/design/flows/*.md` with wireframes (ASCII or SVG), `docs/design/microcopy.md`.
- **Quality bar:** every flow has keyboard path, error and empty states; microcopy follows §55; usability heuristics checklist passed.
- **Interfaces:** visual-designer, frontend-engineer, security-engineer (accuracy of security wording), technical-writer.
- **Risks:** over-reassurance or alarm fatigue → bounded wording rules.
- **Review duties:** all user-facing text and flows.

### 58.8 DevOps / Release Engineer (`devops-engineer`)

- **Mission:** reproducible builds, trustworthy CI, signed releases.
- **Owns:** `.github/**` (protected), CI matrix, branch protection documentation, release pipeline, SBOM, provenance.
- **Deliverables:** workflows, `docs/dev/ci.md`, `docs/dev/branch-protection.md`, release scripts.
- **Quality bar:** SC-47..SC-50 satisfied; CI time tracked; required checks match §49.
- **Interfaces:** security-engineer, release-owner.
- **Risks:** CI as attack vector → pinned actions, minimal permissions.
- **Review duties:** CI and release changes (always also reviewed by security-engineer).

### 58.9 QA / Test Engineer (`qa-engineer`)

- **Mission:** prove that the system behaves as specified, especially under attack.
- **Owns:** test strategy, fixtures (benign and malicious), golden hash vectors, e2e and a11y tests, phase-exit checks.
- **Deliverables:** `tests/fixtures/**`, `docs/dev/testing.md`, phase-exit reports.
- **Quality bar:** every acceptance criterion maps to a test; fixtures documented (what each malicious fixture simulates).
- **Interfaces:** all engineering roles.
- **Risks:** tests modified to pass → guardrail: a PR must not weaken its own tests or criteria.
- **Review duties:** reviewer on every task with acceptance criteria involving behavior.

### 58.10 Technical Writer (`technical-writer`)

- **Mission:** make Quiver usable and contributable by people who never saw the code.
- **Owns:** `README`, `docs/user/**`, `docs/dev/**`.
- **Deliverables:** user guide per phase, CLI reference, plugin developer guide.
- **Quality bar:** every command documented with an example; plain, consistent English (style guide in `docs/dev/writing.md`).
- **Interfaces:** ux-designer (tone), all roles.
- **Risks:** stale docs → docs part of Definition of Done.
- **Review duties:** documentation changes by others.

### 58.11 Community Maintainer (`community-maintainer`) — from Phase 9

- **Mission:** grow a healthy contributor base.
- **Owns:** `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, issue/PR templates, triage labels.
- **Quality bar:** templates require security-relevant info; first-response targets documented.

### 58.12 Legal Advisor (`legal-advisor`) — HUMAN GATE

Decides: Quiver's own license, redistribution rules, provider terms verification, GitHub terms compliance, privacy/removal procedure. Automation prepares a briefing document; a human decides and records the outcome.

### 58.13 External Penetration Tester (`external-pentester`) — HUMAN GATE

Tests before each public release: local server, ingestion, scanner bypass, Git hardening, rendering. Findings tracked as security issues; release blocked on open high/critical findings.

### 58.14 Release Owner (`release-owner`) — HUMAN GATE

The project owner. Approves releases, exceptions to guardrails and brand choice, and reviews a **checkpoint every 5 completed tasks** (§27).

---

# PART H — DELIVERY

## 59. Phases

Sequential; detailed tasks in `roadmap.md`.

| Phase | Goal | Exit criterion |
|---|---|---|
| 0 | Foundations, secure primitives, CI | Required checks green on 3 OSes; SC primitives tested |
| 1 | Skills Hub vertical slice (CLI, local import) | Golden hash vectors identical on 3 OSes |
| 2 | Git/GitHub sources, provenance, diff | Identical fork recognized; force push quarantined |
| 3 | Security analysis, trust, cross-skill analysis, SARIF, external scanner plugins | 100% malicious fixtures detected, including toxic combinations |
| 4 | Install, sync, lockfile + CI gate, machine audit, advisories, MCP/plugin, **CLI v0.1 release** | Pentest passed; CLI v0.1 released |
| 5 | Design system + Skills Hub Web UI | Pentest passed; Skills Hub v0.2 (Web UI) released |
| 6 | Orchestrator core | Dev → Test → Review → Commit end-to-end on fixture repo |
| 7 | Multi-agent, scheduler, Orchestrator UI | Pentest passed; Orchestrator v0.1 released |
| 8 | Integration Bridge | Pinned skill executed with permission reconciliation and audit |
| 9 | Ecosystem | Plugin SDK published; registry legal sign-off |

## 60. Open Decisions

| # | Question | Current position | Owner |
|---|---|---|---|
| OD-1 | Quiver metadata: separate `.quiver/skill.json` only? | Yes, separate file | tech-lead |
| OD-2 | Provider automation terms | `unknown` until verified | legal-advisor |
| OD-3 | Default risk threshold for Automatic Trusted Only | Defined after Phase 3 fixtures | security-engineer |
| OD-4 | Sandbox on macOS/Windows without containers | Refuse execution | security-engineer |
| OD-5 | Snapshot signing (e.g. Sigstore) | Phase 9 | security-engineer |
| OD-6 | Quiver's own license | Decided in Phase 0 | legal-advisor |
| OD-7 | Keychain library | Decided in Phase 0 | security-engineer |
| OD-8 | Logo direction | Decided in Phase 5 | release-owner |
| OD-9 | Final product name (npm, GitHub, trademark availability of "Quiver") | Checked in Phase 0, before any publication | legal-advisor |

## 61. External facts to verify (`TO VERIFY`)

Node.js LTS version · keychain library for Node on Linux/macOS/Windows · Git flags in §34 on supported Git versions · `skills` CLI lock file format · external scanner output formats, licenses and data-sharing terms · GitHub API rate limits and terms · skill directory locations for Claude Code, Codex and Gemini · each provider's terms on automated use · each provider CLI's permission/sandbox model · bubblewrap availability on target distributions · MCP TypeScript SDK and Claude Code plugin format · OSV schema version · npm/GitHub/trademark availability of the name.

## 62. Non-goals

A new LLM; a full IDE; a GitHub replacement; a commercial marketplace; a mandatory cloud; a general-purpose container orchestrator; a single-provider framework; a proprietary skill format; a promise to isolate skills executed by third-party agents.

## 63. Product definitions

- **Quiver Skills Hub** — An independent platform to discover, inspect, verify, version and safely install reusable Agent Skills, with trust bound to immutable, content-addressed snapshots.
- **Quiver Orchestrator** — A local-first, provider-agnostic runtime for collaborative AI agents, development workflows and scheduled project automation.
- **Quiver Integration Bridge** — An optional bridge that assigns pinned, verified Skill Snapshots to agents and workflow nodes, reconciling their capabilities with the agent's enforced permissions.

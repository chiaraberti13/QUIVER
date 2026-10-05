# ADR 0003 — Lint and format toolchain: ESLint flat config + Babel parser, Prettier

- Status: accepted
- Date: 2026-10-05
- Deciders: tech-lead (owner); reviewers: security-engineer (required — protected paths: package.json, pnpm-lock.yaml; SC rules enforced)
- Related: project.md §28 (language & type safety), §47 (boundary rules), §49 (CI `lint`), §51 (ADRs), SC-02, SC-03, SC-09, SC-34, SC-46, SC-47; roadmap task P0-T003
- Depends on: ADR 0002 (TypeScript native 7.x compiler)

## Context

Task P0-T003 requires linting that enforces a subset of the Secure Coding
Standard (project.md Part C) **mechanically**, so reviewers do not have to catch
these by eye:

- SC-02 — no `any` in production code;
- SC-03 — no `eval` / `new Function`;
- SC-09 — `child_process` only inside `packages/security`;
- SC-34 — `dangerouslySetInnerHTML` only under `apps/web/src/render/**`.

The roadmap deliverable names an **ESLint flat config**. The obvious companion,
`typescript-eslint`, is however **incompatible with this repository's compiler**:
ADR 0002 pins the native TypeScript 7 compiler, whose `typescript` package no
longer exposes the classic JS compiler API that `typescript-eslint` reads. Run
against TS 7 it aborts:

```
typescript-eslint does not support TS 7.0.
```

Its peer range is `typescript@>=4.8.4 <6.1.0` (upstream tracking issue
typescript-eslint#10940). Verified locally on 2026-10-05 with
`typescript-eslint@8.71.0` + `typescript@7.0.2`: the parser throws before any
rule runs.

## Decision

Use **ESLint 9 (flat config)** and parse TypeScript/TSX with
**`@babel/eslint-parser`** instead of `typescript-eslint`. The Babel parser turns
TS/TSX into an ESTree-compatible AST **without** loading the TypeScript compiler
API, so it is unaffected by the native-compiler change. Every rule above is
expressible syntactically, so type information is not required:

| Rule | Mechanism |
|---|---|
| SC-02 | `no-restricted-syntax` selector `TSAnyKeyword` |
| SC-03 | core `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url`, plus `no-restricted-syntax` selectors for `vm.runIn*`/`vm.compileFunction` and for dynamic `import()` with a non-literal path |
| SC-09 | `no-restricted-imports` on static `child_process`/`node:child_process` imports (relaxed by a `packages/security/**` override), **plus** `no-restricted-syntax` selectors — applied everywhere, security included — that forbid the non-static ways to reach it: `require('child_process')`, dynamic `import('…child_process')`, and `process.getBuiltinModule`/`process.binding` of it |
| SC-34 | `no-restricted-syntax` selector `JSXAttribute[name.name='dangerouslySetInnerHTML']`, relaxed by an override for `apps/web/src/render/**` |

`.tsx` needs JSX parsing enabled explicitly (`@babel/plugin-syntax-jsx`), because
`@babel/preset-typescript` does not infer JSX from the file extension when driven
through `@babel/eslint-parser`.

**Guardrail integrity.** `no-restricted-imports` sees only *static* ES imports,
so a security rule that stopped there would be trivially bypassable by
`require()`, dynamic `import()`, `process.getBuiltinModule`/`binding`, or a
one-line `/* eslint-disable */`. The config therefore (a) bans every non-static
path to `child_process` with the SC-09 syntax selectors above (safeExec uses a
static import, so even `packages/security` has no need of the dynamic forms),
and (b) sets `linterOptions.noInlineConfig: true` with
`reportUnusedDisableDirectives: 'error'`, so inline directives cannot switch a
rule off and any stray disable directive is itself an error. `packages/security`
keeps the SC-09 static exemption only (`no-restricted-imports: 'off'`); because
`child_process` is currently the single restricted import, turning the rule off
there is exact — if more restricted imports are added later, re-specify an
allowlist in that override rather than leaving the whole rule off.

**Formatting:** Prettier, configured in `.prettierrc`. Prettier governs code and
JSON; hand-maintained prose (`*.md`: specification, roadmap, ADRs) and the
`pnpm-workspace.yaml` manifest are in `.prettierignore` so Prettier does not fight
their curated layout. No `eslint-config-prettier` is needed: the ESLint config
carries only security rules, no stylistic rules, so the two tools do not conflict.

**Expect-failure guardrail:** `tests/lint-fixtures/` holds files that violate a
rule on purpose — one per enforced rule: SC-02 (`any`), SC-03 (`eval`), SC-09
(both the static-import and the dynamic-import forms), and SC-34
(`dangerouslySetInnerHTML` outside render). They are excluded from a normal
`pnpm lint` (ignored unless `ESLINT_INCLUDE_FIXTURES=1`) and from any TypeScript
build. `pnpm lint:fixtures` lints them with that flag set and asserts each is
rejected **as an error** (severity 2) by its intended rule — and, for the
custom-message rules, that the message carries the expected `SC-xx` tag — so a
rule silently downgraded to a warning or a broken selector fails the check
(acceptance criterion 2).

### Pinned versions (exact, lockfile-committed — SC-47)

| Package | Version | Why |
|---|---|---|
| `eslint` | `9.39.5` | Linter runtime. The `9.x` **maintenance** line; `@babel/eslint-parser` declares support only up to ESLint 9, so ESLint 10 is deferred until the parser's peer range includes it. |
| `@babel/eslint-parser` | `7.29.9` | ESTree parser for TS/TSX without the TS compiler API. |
| `@babel/core` | `7.29.7` | Peer required by the Babel parser and presets. |
| `@babel/preset-typescript` | `7.29.7` | Strips/understands TypeScript syntax. |
| `@babel/plugin-syntax-jsx` | `7.29.7` | Enables JSX parsing for `.tsx`. |
| `prettier` | `3.9.9` | Formatter. |

All six are **dev-only, build-time** tools; none ships at runtime. The Babel line
is kept on `7.x` uniformly so peer ranges resolve with no warnings (the Babel 8
presets require `@babel/core@^8`, which `@babel/eslint-parser@7` does not accept).

## Consequences

- Positive: all four SC rules are enforced in CI (`lint`); the path-scoped
  exceptions for `packages/security` (SC-09) and `apps/web/src/render` (SC-34)
  are expressed as config overrides, matching project.md §47.
- Positive: no second, side-by-side TypeScript install purely for the linter —
  the compiler stays exactly as ADR 0002 pinned it.
- Negative / limitation: `@babel/eslint-parser` gives **no type-aware** linting
  (e.g. `no-floating-promises`). This is acceptable for the SC rules in scope,
  which are all syntactic. If type-aware rules are needed later, revisit once
  `typescript-eslint` supports TS 7 (issue #10940), or run those checks through
  the TypeScript compiler API directly.
- Negative: six dev dependencies added (SC-46). Justified above; listed in the
  next checkpoint report (project.md §27).
- Limitation / residual risk (syntactic matching): the SC-09 and SC-03 selectors
  match literal shapes and the identifiers `require` / `process` / `vm`. They
  catch every natural and common form — static/dynamic/`require`d
  `child_process` (literal, concatenated or template-literal path),
  `process.getBuiltinModule`/`binding` of it, `eval`/`Function`/`vm.runIn*`, and
  non-literal `import()`/`require()`. They **cannot** catch deliberate
  obfuscation that computes the target at runtime through an alias
  (`const p = process; p.getBuiltinModule(...)`, `globalThis.process…`,
  `createRequire(...)(...)`), nor can they know that a local object literally
  named `vm` is unrelated to `node:vm` (a low-probability false positive). These
  are inherent limits of a type-free syntactic linter, not gaps to be chased with
  ever-more selectors. The authoritative controls are outside the model
  (project.md §4.7): the §47 import-boundary enforcement via dependency-cruiser
  (P0-T004) and the mandatory protected-path security review (§27), which an
  obfuscated process-spawn would not survive.

## Alternatives considered

- **`typescript-eslint`.** The default choice. Rejected: hard-fails on the native
  TS 7 compiler pinned by ADR 0002 (evidence above).
- **A second, side-by-side TypeScript 5/6 just for the linter.** Rejected:
  reintroduces the compiler duplication ADR 0002 deliberately avoids, doubles the
  type-checker attack surface, and risks the linter and compiler disagreeing on
  syntax.
- **oxlint (Rust, no TS-API dependency).** Technically a clean fit and fewer
  dependencies, but it is not ESLint; the roadmap deliverable names an ESLint flat
  config. Reconsider if the project later standardizes on oxlint.
- **ESLint 10.** Rejected for now: `@babel/eslint-parser@7` declares peers only
  through ESLint 9, so 10 would introduce an unmet-peer warning. Revisit when the
  parser supports it.

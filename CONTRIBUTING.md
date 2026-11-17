# Contributing to QUIVER

This repository covers a local-first, provider-agnostic Agent Skills inspection ecosystem and collaborative AI-agent orchestrator.

## Before you start
1. Read `README.md`, `SECURITY.md`, roadmap and relevant ADR/design documentation.
2. Search existing issues and use a dedicated branch.
3. Keep each pull request focused and avoid unrelated refactors.
4. Never commit secrets, private data, production exports or untrusted generated artefacts.
5. Report vulnerabilities privately.

## Setup
```bash
corepack enable
pnpm install --frozen-lockfile
```

## Checks
```bash
pnpm typecheck
pnpm lint
pnpm lint:fixtures
pnpm format:check
```
At the current scaffold stage, do not document planned scanner, sandbox, provider or runtime controls as implemented. Trust claims must remain content-bound, versioned and evidence-based.

## Engineering expectations
Validate untrusted input, fail safely, preserve explicit permission boundaries, keep dependencies minimal and justified, and update tests for behavioural changes. Document data/schema/protocol changes and migration impact. Write documentation in English and keep both README editions semantically aligned.

## Pull requests
Describe what changed, why, verification performed, security/privacy impact, compatibility implications and rollback/migration notes. Participation follows `CODE_OF_CONDUCT.md`.

## Reporting and contribution checks

Use the [issue templates](https://github.com/chiaraberti13/QUIVER/issues/new/choose) and check for duplicates first. Useful context: Node.js and pnpm versions, workspace, provider and minimal skill without secrets.

Write community and technical documentation in English; maintain equivalent English and Italian READMEs. Preserve existing application translations. Fill in the pull request template with commands, results and checks not performed, including the reason. Use synthetic examples without secrets or personal data.

See [the code of conduct](CODE_OF_CONDUCT.md), [security policy](SECURITY.md) and [accessibility statement](ACCESSIBILITY.md). Report vulnerabilities only through the security policy process.

## Project-specific review gates

Read [project.md](project.md) and [roadmap.md](roadmap.md). Follow the protected-path and checkpoint reviews in project.md §27. Cite applicable SC-xx secure-coding rules in security-relevant changes. Never simulate human approval or mark roadmap tasks complete without evidence. Use a dedicated branch and pull request; do not force-push or rewrite other contributors' work.

Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm lint:fixtures` and `pnpm format:check`. Keep dependency installation restrictions active. Scaffold checks do not establish that planned product features are operational. Preserve historical reports and distinguish specifications from implemented behaviour.

The current owner-directed language policy is English documentation with English and Italian READMEs; it supersedes the earlier bilingual-guide convention for these community documents.

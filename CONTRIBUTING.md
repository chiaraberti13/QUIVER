# Contributing to QUIVER

[English](CONTRIBUTING.md) · [Italiano](CONTRIBUTING.it.md) · [Documentation](docs/README.md)

QUIVER is at the scaffold stage. Before proposing an implementation, read the
[specification](project.md), [roadmap](roadmap.md) and
[development status](docs/presentation/development-status.md).

## Contribution workflow

1. For a new idea, open an [issue](https://github.com/chiaraberti13/QUIVER/issues)
   describing the problem and its connection to Skills Hub or Orchestrator.
2. Work on a dedicated branch and submit a focused pull request. Do not push
   directly to `main`, force-push or rewrite another contributor's work.
3. Explain the resulting behaviour, affected files and relevant verification.
   Reference applicable `SC-xx` rules for security-relevant code changes.
4. Follow the protected-path reviews and gates in
   [project.md §27](project.md#27-protected-paths-and-checkpoint-reviews-quivers-own-repository).
   Do not simulate human approvals or mark roadmap tasks complete without evidence.

## Local checks

Use the prerequisites in the [README](README.md#development-setup):

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm lint:fixtures
pnpm format:check
```

Keep dependency install restrictions enabled. Product tests, CI workflows and
runtime entry points will arrive in their own tasks; scaffold checks do not
prove that a planned feature works.

## Documentation contributions

Update public English and Italian counterparts together, including links,
examples, status and alternative text. Use `README.md` / `README.it.md` and the
same `.it.md` convention in guides. Both metadata guides keep the About text
in English. Technical specifications, ADRs and the machine-read roadmap remain
in English; see [ADR 0004](docs/adr/0004-bilingual-public-documentation.md).

Keep existing historical reports intact. Distinguish specifications from
implemented features, and verify local links and SVG rendering when changed.
Report potential vulnerabilities using [SECURITY.md](SECURITY.md), rather than
including exploit details or secrets in a public issue.

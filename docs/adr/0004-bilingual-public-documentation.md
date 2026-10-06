# ADR 0004 — Bilingual public documentation

- Status: accepted
- Date: 2026-10-06
- Decision authority: explicit repository-owner request
- Related: project.md language policy; roadmap.md language policy

## Context

The owner requested an English About description, a repository presentation
aligned with the other portfolio repositories, and public documentation in
English and Italian. The original English-only policy would conflict with this.

## Decision

1. Use `README.md` as the English entry point and `README.it.md` as its Italian
   counterpart. Apply the same `.it.md` convention to public documentation.
2. Keep each pair aligned in scope, commands, status, limitations and links.
3. Localize banner copy and alternative text. Retain the portfolio's SVG format,
   terminal styling and palette without animation, scripts or remote resources.
4. Keep source code, runtime UI, technical specifications, ADRs and the
   machine-read `roadmap.md` in English. This request does not localize the app.
5. Keep the English About text canonical in both repository-metadata guides.

## Consequences

The historical English-only decision in project.md §0 describes the original
v3 change, not the current public-documentation policy. Verification routines
must accept and check the new EN/IT pairs. Historical verification reports stay
unchanged. Roadmap tasks, gates and acceptance criteria are not marked complete
by this presentation work; runtime, release and licence decisions stay separate.

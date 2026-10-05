# Lint fixtures

These files are **intentionally non-compliant** with the Secure Coding Standard
(project.md Part C). They exist so we can prove that the ESLint configuration
actually rejects the patterns it is meant to reject — a linter that silently
passes everything is worse than none.

They are excluded from:

- the normal `pnpm lint` run (listed under `ignores` in `eslint.config.js`), so
  a green `pnpm lint` on the real source tree is not spoiled by these files;
- any TypeScript build (no `tsconfig.json` includes this directory).

The expectation that each fixture **fails** lint is enforced by
`pnpm lint:fixtures`, which runs ESLint over this directory with ignore rules
disabled and asserts a non-zero result carrying the expected `SC-xx` rule.

| Fixture | Must trigger |
|---|---|
| `child-process-outside-security.ts` | SC-09 (`no-restricted-imports` on `child_process`) |

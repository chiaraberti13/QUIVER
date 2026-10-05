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
disabled and asserts, for each fixture, that the expected rule reports an
**error** (severity 2) — and, where the rule carries a custom message, that the
message includes the expected `SC-xx` tag.

| Fixture | Must trigger |
|---|---|
| `child-process-outside-security.ts` | SC-09 — static `import` of `child_process` (`no-restricted-imports`) |
| `child-process-dynamic.ts` | SC-09 — dynamic `import()` of `child_process` (`no-restricted-syntax`) |
| `any-type.ts` | SC-02 — explicit `any` (`no-restricted-syntax`) |
| `eval-call.ts` | SC-03 — `eval` (`no-eval`) |
| `require-non-literal.cjs` | SC-03 — non-literal `require()` path, also an SC-09 evasion (`no-restricted-syntax`) |
| `dangerous-html.tsx` | SC-34 — `dangerouslySetInnerHTML` outside render (`no-restricted-syntax`) |

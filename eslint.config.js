// Quiver ESLint flat configuration.
//
// Purpose (roadmap P0-T003): enforce a subset of the Secure Coding Standard
// (project.md Part C) mechanically, so reviewers never have to catch these by
// eye. The rules wired here are:
//
//   SC-02  No `any` in production code.
//   SC-03  No `eval` / `new Function` / implied eval.
//   SC-09  `child_process` may only be imported inside `packages/security`
//          (the home of the `safeExec` wrapper).
//   SC-34  `dangerouslySetInnerHTML` may only appear under
//          `apps/web/src/render/**` (the one sanctioned sink for untrusted
//          HTML, co-owned with security-engineer).
//
// Parser note: the repository pins the native TypeScript 7 compiler
// (typescript@7, P0-T002). typescript-eslint does not support TS 7 — it reads
// the classic `typescript` JS compiler API, which the native package no longer
// exposes, and aborts with "typescript-eslint does not support TS 7.0". Rather
// than install a second, side-by-side TypeScript purely for the linter, we parse
// TS/TSX syntax with @babel/eslint-parser, which needs no TypeScript compiler
// API. Every rule above is syntactic, so type information is not required.
// Rationale recorded in docs/adr/0002-lint-and-format.md.

import babelParser from '@babel/eslint-parser';

/**
 * Security rules that apply to every JavaScript and TypeScript file regardless
 * of syntax flavour. Kept in one object so the per-language blocks below stay in
 * sync.
 */
const sharedSecurityRules = {
  // SC-03: forbid dynamic code evaluation in all its forms.
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-script-url': 'error',

  // SC-09: no direct process spawning outside packages/security. The security
  // package re-enables these imports via an override below.
  'no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: 'child_process',
          message:
            'SC-09: import process execution only through safeExec in @quiver/security.',
        },
        {
          name: 'node:child_process',
          message:
            'SC-09: import process execution only through safeExec in @quiver/security.',
        },
      ],
    },
  ],
};

/**
 * TypeScript-syntax rules. `no-restricted-syntax` selectors let us enforce
 * SC-02 and SC-34 against the ESTree-compatible AST that @babel/eslint-parser
 * produces, without a TypeScript-aware plugin.
 */
const typeScriptSyntaxRules = {
  'no-restricted-syntax': [
    'error',
    {
      // SC-02: the explicit `any` type keyword.
      selector: 'TSAnyKeyword',
      message:
        'SC-02: `any` is forbidden in production code; use `unknown` plus validation.',
    },
    {
      // SC-34: React escape hatch for raw HTML.
      selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
      message:
        'SC-34: dangerouslySetInnerHTML is allowed only under apps/web/src/render/**.',
    },
  ],
};

const babelParserOptions = {
  requireConfigFile: false,
  babelOptions: {
    presets: ['@babel/preset-typescript'],
  },
};

// .tsx needs JSX parsing turned on explicitly: @babel/preset-typescript does not
// infer it from the file extension when driven through @babel/eslint-parser.
const babelParserOptionsTsx = {
  requireConfigFile: false,
  babelOptions: {
    presets: ['@babel/preset-typescript'],
    plugins: ['@babel/plugin-syntax-jsx'],
  },
};

// Lint fixtures are deliberately broken (see tests/lint-fixtures/README.md) and
// must not spoil a normal `pnpm lint`. They are ignored by default and only
// linted by the expect-failure step `pnpm lint:fixtures`, which opts them back
// in by setting ESLINT_INCLUDE_FIXTURES=1.
const includeFixtures = process.env.ESLINT_INCLUDE_FIXTURES === '1';

export default [
  {
    // Paths ESLint must never walk.
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.d.ts',
      ...(includeFixtures ? [] : ['tests/lint-fixtures/**']),
    ],
  },
  {
    // Plain JavaScript / ESM tooling files (e.g. this config).
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
    rules: {
      ...sharedSecurityRules,
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: babelParser,
      parserOptions: babelParserOptions,
    },
    rules: {
      ...sharedSecurityRules,
      ...typeScriptSyntaxRules,
    },
  },
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: babelParserOptionsTsx,
    },
    rules: {
      ...sharedSecurityRules,
      ...typeScriptSyntaxRules,
    },
  },
  {
    // SC-09 exception: packages/security owns the safeExec wrapper and is the
    // only place allowed to touch child_process directly.
    files: ['packages/security/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    // SC-34 exception: the sole sanctioned sink for rendering untrusted HTML.
    files: ['apps/web/src/render/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSAnyKeyword',
          message:
            'SC-02: `any` is forbidden in production code; use `unknown` plus validation.',
        },
      ],
    },
  },
];

// Quiver ESLint flat configuration.
//
// Purpose (roadmap P0-T003): enforce a subset of the Secure Coding Standard
// (project.md Part C) mechanically, so reviewers never have to catch these by
// eye. The rules wired here are:
//
//   SC-02  No `any` in production code.
//   SC-03  No dynamic code execution: `eval`, `new Function`, implied eval,
//          `javascript:` URLs, `vm.runIn*` / `vm.compileFunction`, and dynamic
//          `import()` with a non-literal path.
//   SC-09  `child_process` may only be imported inside `packages/security`
//          (the home of the `safeExec` wrapper) — and only via a *static*
//          import. Every dynamic way to reach it (require, dynamic import,
//          `process.getBuiltinModule`, `process.binding`) is forbidden
//          everywhere, since the wrapper never needs them.
//   SC-34  `dangerouslySetInnerHTML` may only appear under
//          `apps/web/src/render/**` (the one sanctioned sink for untrusted
//          HTML, co-owned with security-engineer).
//
// Guardrail integrity: inline `eslint-disable` comments are turned off
// (`noInlineConfig`), so a contributor cannot defeat a security rule with a
// one-line comment; any stray disable directive is itself an error.
//
// Parser note: the repository pins the native TypeScript 7 compiler
// (typescript@7, P0-T002 / ADR 0002). typescript-eslint does not support TS 7 —
// it reads the classic `typescript` JS compiler API, which the native package
// no longer exposes, and aborts with "typescript-eslint does not support
// TS 7.0". Rather than install a second, side-by-side TypeScript purely for the
// linter, we parse TS/TSX syntax with @babel/eslint-parser, which needs no
// TypeScript compiler API. Every rule above is syntactic, so type information is
// not required. Rationale recorded in docs/adr/0003-lint-and-format.md.

import babelParser from '@babel/eslint-parser';

// SC-03: dynamic code-execution rules that are plain core-ESLint rules.
const dynamicCodeCoreRules = {
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-script-url': 'error',
};

// SC-09: forbid *static* `import ... from 'child_process'`. The security
// package re-enables this via an override below; everywhere else it is the
// documented lint boundary from project.md §47.
const restrictedImportsRule = {
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

// SC-09: non-static ways to reach child_process. `no-restricted-imports` only
// sees static ES imports, so these selectors close the require / dynamic-import
// / process.getBuiltinModule / process.binding bypasses. Forbidden in every
// package, including packages/security (safeExec uses a static import).
const childProcessSyntaxSelectors = [
  {
    selector:
      "CallExpression[callee.name='require'] > Literal[value=/^(node:)?child_process$/]",
    message:
      'SC-09: require() of child_process is forbidden; use safeExec in @quiver/security.',
  },
  {
    selector: 'ImportExpression > Literal[value=/^(node:)?child_process$/]',
    message:
      'SC-09: dynamic import of child_process is forbidden; use safeExec in @quiver/security.',
  },
  {
    selector:
      "CallExpression[callee.object.name='process'][callee.property.name=/^(getBuiltinModule|binding)$/] > Literal[value=/child_process/]",
    message:
      'SC-09: reaching child_process via process.getBuiltinModule/binding is forbidden; use safeExec in @quiver/security.',
  },
];

// SC-03: dynamic code execution expressible only as syntax selectors.
const dynamicCodeSyntaxSelectors = [
  {
    selector:
      "CallExpression[callee.object.name='vm'][callee.property.name=/^(runInNewContext|runInThisContext|runInContext|compileFunction)$/]",
    message:
      'SC-03: vm dynamic code execution (runIn*/compileFunction) is forbidden.',
  },
  {
    selector: "ImportExpression:not([source.type='Literal'])",
    message:
      'SC-03: dynamic import() must use a string literal path, never a computed one.',
  },
  {
    // Symmetric with the import() rule: a non-literal require() path (string
    // concatenation, template literal, variable) is forbidden. This also closes
    // the two most natural SC-09 evasions — require('child'+'_process') and
    // require(`child_process`) — that a literal-only selector would miss.
    selector:
      "CallExpression[callee.name='require'][arguments.0.type!='Literal']",
    message:
      'SC-03: require() must use a string literal path, never a computed one.',
  },
];

// SC-02: the explicit `any` type keyword.
const anySyntaxSelector = {
  selector: 'TSAnyKeyword',
  message:
    'SC-02: `any` is forbidden in production code; use `unknown` plus validation.',
};

// SC-34: React escape hatch for raw HTML.
const dangerousHtmlSyntaxSelector = {
  selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
  message:
    'SC-34: dangerouslySetInnerHTML is allowed only under apps/web/src/render/**.',
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
    // Guardrail integrity: a security rule must not be silently switchable off.
    // Inline eslint directives are ignored, and any stray disable directive is
    // itself reported as an error.
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    // Plain JavaScript / ESM tooling files (e.g. this config).
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
    rules: {
      ...dynamicCodeCoreRules,
      ...restrictedImportsRule,
      'no-restricted-syntax': [
        'error',
        ...childProcessSyntaxSelectors,
        ...dynamicCodeSyntaxSelectors,
      ],
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: babelParser,
      parserOptions: babelParserOptions,
    },
    rules: {
      ...dynamicCodeCoreRules,
      ...restrictedImportsRule,
      'no-restricted-syntax': [
        'error',
        ...childProcessSyntaxSelectors,
        ...dynamicCodeSyntaxSelectors,
        anySyntaxSelector,
      ],
    },
  },
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: babelParserOptionsTsx,
    },
    rules: {
      ...dynamicCodeCoreRules,
      ...restrictedImportsRule,
      'no-restricted-syntax': [
        'error',
        ...childProcessSyntaxSelectors,
        ...dynamicCodeSyntaxSelectors,
        anySyntaxSelector,
        dangerousHtmlSyntaxSelector,
      ],
    },
  },
  {
    // SC-09 exception: packages/security owns the safeExec wrapper and is the
    // only place allowed to import child_process — via a *static* import only.
    // Scope note: child_process is currently the single restricted import, so
    // turning the rule off here is exact. If more restricted imports are added
    // to restrictedImportsRule later, re-specify an allowlist here rather than
    // leaving the whole rule off. The dynamic-form bans (childProcessSyntax)
    // stay active even here.
    files: ['packages/security/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    // SC-34 exception: the sole sanctioned sink for rendering untrusted HTML.
    // Everything else (SC-02 any, SC-03 dynamic code, SC-09 dynamic forms)
    // still applies here; only the dangerouslySetInnerHTML ban is lifted.
    files: ['apps/web/src/render/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...childProcessSyntaxSelectors,
        ...dynamicCodeSyntaxSelectors,
        anySyntaxSelector,
      ],
    },
  },
];

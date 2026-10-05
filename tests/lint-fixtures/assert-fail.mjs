// Expect-failure check for the lint fixtures (roadmap P0-T003, acceptance
// criterion 2). Each fixture under tests/lint-fixtures violates a Secure Coding
// rule on purpose; this script lints them with ESLint's programmatic API and
// asserts that every one is rejected, as an ERROR (severity 2), by the rule it
// is meant to trip — and, for the message-tagged rules, that the reported
// message carries the expected SC-xx tag. If a fixture ever passes lint, or a
// rule is quietly downgraded to a warning, the guardrail has regressed and this
// script exits non-zero so CI fails.
//
// Fixtures are ignored by a normal `pnpm lint`; setting ESLINT_INCLUDE_FIXTURES
// opts them back in (see eslint.config.js).

process.env.ESLINT_INCLUDE_FIXTURES = '1';

const { ESLint } = await import('eslint');

/**
 * @type {{ file: string, ruleId: string, sc: string, messageIncludes?: string }[]}
 * `messageIncludes` is checked when set (custom no-restricted-* messages carry
 * the SC tag; core rules such as no-eval do not, so only the ruleId is checked).
 */
const expectations = [
  {
    file: 'tests/lint-fixtures/child-process-outside-security.ts',
    ruleId: 'no-restricted-imports',
    sc: 'SC-09 (static import)',
    messageIncludes: 'SC-09',
  },
  {
    file: 'tests/lint-fixtures/child-process-dynamic.ts',
    ruleId: 'no-restricted-syntax',
    sc: 'SC-09 (dynamic import)',
    messageIncludes: 'SC-09',
  },
  {
    file: 'tests/lint-fixtures/any-type.ts',
    ruleId: 'no-restricted-syntax',
    sc: 'SC-02',
    messageIncludes: 'SC-02',
  },
  {
    file: 'tests/lint-fixtures/eval-call.ts',
    ruleId: 'no-eval',
    sc: 'SC-03 (eval)',
  },
  {
    file: 'tests/lint-fixtures/require-non-literal.cjs',
    ruleId: 'no-restricted-syntax',
    sc: 'SC-03 (non-literal require)',
    messageIncludes: 'SC-03',
  },
  {
    file: 'tests/lint-fixtures/dangerous-html.tsx',
    ruleId: 'no-restricted-syntax',
    sc: 'SC-34',
    messageIncludes: 'SC-34',
  },
];

const eslint = new ESLint();
let allFailedAsExpected = true;

for (const { file, ruleId, sc, messageIncludes } of expectations) {
  const results = await eslint.lintFiles([file]);
  const messages = results.flatMap((result) => result.messages);
  const match = messages.find(
    (message) =>
      message.ruleId === ruleId &&
      message.severity === 2 &&
      (messageIncludes ? message.message.includes(messageIncludes) : true),
  );

  if (match) {
    console.log(`ok   ${file} rejected (error) by ${ruleId} — ${sc}`);
  } else {
    allFailedAsExpected = false;
    const seen =
      messages
        .map((message) => `${message.ruleId}@sev${message.severity}`)
        .join(', ') || 'none';
    console.error(
      `FAIL ${file} should fail ${ruleId} as an error — ${sc}. Seen: ${seen}`,
    );
  }
}

if (!allFailedAsExpected) {
  console.error('\nLint fixtures did not fail as expected: guardrail regressed.');
  process.exit(1);
}

console.log('\nAll lint fixtures failed as expected.');

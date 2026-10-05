// Expect-failure check for the lint fixtures (roadmap P0-T003, acceptance
// criterion 2). Each fixture under tests/lint-fixtures violates a Secure Coding
// rule on purpose; this script lints them with ESLint's programmatic API and
// asserts that every one is rejected by the rule it is meant to trip. If a
// fixture ever passes lint, the guardrail has regressed and this script exits
// non-zero so CI fails.
//
// Fixtures are ignored by a normal `pnpm lint`; setting ESLINT_INCLUDE_FIXTURES
// opts them back in (see eslint.config.js).

process.env.ESLINT_INCLUDE_FIXTURES = '1';

const { ESLint } = await import('eslint');

/** @type {{ file: string, ruleId: string, sc: string }[]} */
const expectations = [
  {
    file: 'tests/lint-fixtures/child-process-outside-security.ts',
    ruleId: 'no-restricted-imports',
    sc: 'SC-09',
  },
];

const eslint = new ESLint();
let allFailedAsExpected = true;

for (const { file, ruleId, sc } of expectations) {
  const results = await eslint.lintFiles([file]);
  const messages = results.flatMap((result) => result.messages);
  const triggered = messages.some((message) => message.ruleId === ruleId);

  if (triggered) {
    console.log(`ok   ${file} rejected by ${ruleId} (${sc})`);
  } else {
    allFailedAsExpected = false;
    const seen = messages.map((message) => message.ruleId).join(', ') || 'none';
    console.error(
      `FAIL ${file} should fail ${ruleId} (${sc}) but did not. Rules seen: ${seen}`,
    );
  }
}

if (!allFailedAsExpected) {
  console.error('\nLint fixtures did not fail as expected: guardrail regressed.');
  process.exit(1);
}

console.log('\nAll lint fixtures failed as expected.');

// LINT FIXTURE — intentionally violates SC-03.
//
// Calls `eval`, which the ESLint config must reject with the core `no-eval`
// rule. Do not "fix" this file: its job is to break.

export const result = eval('1 + 1');

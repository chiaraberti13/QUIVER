// LINT FIXTURE — intentionally violates SC-09.
//
// This module imports `node:child_process` from outside `packages/security`,
// which the ESLint configuration must reject. `pnpm lint:fixtures` asserts that
// linting this file fails with the `no-restricted-imports` rule. Do not "fix"
// this file: its job is to break.

import { execSync } from 'node:child_process';

export function listFiles(): string {
  return execSync('ls').toString();
}

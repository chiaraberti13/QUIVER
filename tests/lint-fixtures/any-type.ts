// LINT FIXTURE — intentionally violates SC-02.
//
// Uses the explicit `any` type, which the ESLint config must reject with a
// `no-restricted-syntax` SC-02 selector. Do not "fix" this file: its job is to
// break.

export const value: any = 1;

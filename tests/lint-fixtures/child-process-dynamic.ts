// LINT FIXTURE — intentionally violates SC-09 via a non-static import.
//
// Dynamic import of child_process is a bypass of the static-import ban; the
// ESLint config must reject it with a `no-restricted-syntax` SC-09 selector.
// Do not "fix" this file: its job is to break.

export async function load(): Promise<unknown> {
  return import('node:child_process');
}

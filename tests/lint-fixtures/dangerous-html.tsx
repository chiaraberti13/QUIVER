// LINT FIXTURE — intentionally violates SC-34.
//
// Uses dangerouslySetInnerHTML outside apps/web/src/render/**, which the ESLint
// config must reject with a `no-restricted-syntax` SC-34 selector. Do not "fix"
// this file: its job is to break.

export const Unsafe = (html: string) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

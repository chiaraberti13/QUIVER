// LINT FIXTURE — intentionally violates SC-03 (and closes an SC-09 evasion).
//
// A non-literal require() path (here, string concatenation) must be rejected by
// the `no-restricted-syntax` SC-03 selector. This also blocks the
// require('child' + '_process') bypass of SC-09. Do not "fix" this file.

const target = 'child' + '_process';
module.exports = require(target);

/**
 * Relatives a record names who have no record of their own. The phone shows them as a plain name (on the ring, a tap
 * opens the sentence that names them), which the owner kept (2026-11-22). The website's graph needs a row for each, so
 * a new one is a choice to make, not a slip: add it here on purpose (data/catalog/catalogRules.test.ts fails otherwise).
 */
export const UNPROFILED_PEOPLE: ReadonlySet<string> = new Set([
  'atik-ibn-jabr',
  'abdullah-ibn-jabr',
  'umm-thabit-bint-jabr',
  'al-harith-ibn-qais-ibn-hayshah-al-awsi',
  'abd-al-rahman-ibn-umayr-ibn-saad',
]);

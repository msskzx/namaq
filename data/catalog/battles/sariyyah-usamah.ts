import type { CatalogBattle } from '@/lib/catalog/types';

/**
 * The last thing the Prophet ordered and the first thing Abu Bakr had to
 * decide. The old seed never had it, so the catalog creates the row.
 *
 * A سرية by the same test as مؤتة in chapter ten: he appointed Usamah, tied
 * the لواء with his own hand, and did not go — he fell ill on the Wednesday
 * and the army was still camped at الجرف when he died.
 *
 * Abu Bakr, Umar and Abu Ubaydah are named as having answered the muster, but
 * not as having marched: the chapter says انتدب, and the expedition did not
 * leave in the Prophet's lifetime. A roster records who was at a battle, and
 * the sentence describes an enlistment rather than an attendance.
 */
const sariyyahUsamah = {
  kind: 'BATTLE',
  slug: 'sariyyah-usamah',
  name: 'سرية أسامة بن زيد',
  nameTransliterated: 'Expedition of Usamah ibn Zayd',
  fields: {
    engagement: { value: 'SARIYYAH', claims: ['sariyyah-usamah/engagement'] },
    hijriYear: { value: 11, claims: ['sariyyah-usamah/year'] },
  },
  participants: [{ person: 'usamah-ibn-zaid', isMuslim: true, claims: ['usamah/sariyyah-command'] }],
} satisfies CatalogBattle;

export default sariyyahUsamah;

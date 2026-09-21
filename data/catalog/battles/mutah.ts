import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. No batch has read this battle, so every value below is in use with
// its evidence owed.
//
// The carried values contradict each other and are kept that way rather than
// quietly reconciled. The Prophet sent Zayd ibn Harithah and did not go, which
// is a سرية by the vocabulary in src/lib/catalog/types.ts, but the seed named
// the battle غزوة مؤتة and recorded him as a participant. Whichever a batch
// settles, one of the two is wrong; see ADR 0013 on why attendance is its own
// question.
const mutah = {
  kind: 'BATTLE',
  slug: 'mutah',
  name: 'غزوة مؤتة',
  nameTransliterated: 'Battle of Mu\'tah',
  fields: {
    engagement: { value: 'SARIYYAH', claims: legacyUnreviewed },
    hijriYear: { value: 8, claims: legacyUnreviewed },
    location: { value: 'مؤتة', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'prophet-muhammad', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default mutah;

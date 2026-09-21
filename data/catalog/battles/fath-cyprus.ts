import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. No batch has read this battle, so every value below is in use with
// its evidence owed.
const fathCyprus = {
  kind: 'BATTLE',
  slug: 'fath-cyprus',
  name: 'فتح قبرص',
  nameTransliterated: 'Conquest of Cyprus',
  fields: {
    engagement: { value: 'BATTLE', claims: legacyUnreviewed },
    hijriYear: { value: 28, claims: legacyUnreviewed },
    location: { value: 'قبرص', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'uthman-ibn-affan', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default fathCyprus;

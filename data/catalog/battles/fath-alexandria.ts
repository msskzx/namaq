import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. No batch has read this battle, so every value below is in use with
// its evidence owed.
const fathAlexandria = {
  kind: 'BATTLE',
  slug: 'fath-alexandria',
  name: 'فتح الإسكندرية',
  nameTransliterated: 'Conquest of Alexandria',
  fields: {
    engagement: { value: 'BATTLE', claims: legacyUnreviewed },
    hijriYear: { value: 20, claims: legacyUnreviewed },
    location: { value: 'مصر', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default fathAlexandria;

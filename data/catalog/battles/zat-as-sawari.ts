import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. No batch has read this battle, so every value below is in use with
// its evidence owed.
const zatAsSawari = {
  kind: 'BATTLE',
  slug: 'zat-as-sawari',
  name: 'معركة ذات الصواري',
  nameTransliterated: 'Battle of the Masts',
  fields: {
    engagement: { value: 'BATTLE', claims: legacyUnreviewed },
    hijriYear: { value: 34, claims: legacyUnreviewed },
    location: { value: 'البحر المتوسط', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'uthman-ibn-affan', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default zatAsSawari;

import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. No batch has read this battle, so every value below is in use with
// its evidence owed.
const nahrawan = {
  kind: 'BATTLE',
  slug: 'nahrawan',
  name: 'معركة النهروان',
  nameTransliterated: 'Battle of Nahrawan',
  fields: {
    engagement: { value: 'BATTLE', claims: legacyUnreviewed },
    hijriYear: { value: 38, claims: legacyUnreviewed },
    location: { value: 'العراق', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'ali-ibn-abi-talib', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default nahrawan;

import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. No batch has read this battle, so every value below is in use with
// its evidence owed.
const siffin = {
  kind: 'BATTLE',
  slug: 'siffin',
  name: 'معركة صفين',
  nameTransliterated: 'Battle of Siffin',
  fields: {
    engagement: { value: 'BATTLE', claims: legacyUnreviewed },
    hijriYear: { value: 37, claims: legacyUnreviewed },
    location: { value: 'سوريا', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'ali-ibn-abi-talib', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default siffin;

import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. No batch has read this battle, so every value below is in use with
// its evidence owed.
const khaybar = {
  kind: 'BATTLE',
  slug: 'khaybar',
  name: 'غزوة خيبر',
  nameTransliterated: 'Battle of Khaybar',
  fields: {
    engagement: { value: 'GHAZWAH', claims: legacyUnreviewed },
    hijriYear: { value: 7, claims: legacyUnreviewed },
    location: { value: 'خيبر', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'ali-ibn-abi-talib', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: legacyUnreviewed },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default khaybar;

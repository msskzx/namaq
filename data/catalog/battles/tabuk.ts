import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. No batch has read this battle, so every value below is in use with
// its evidence owed.
const tabuk = {
  kind: 'BATTLE',
  slug: 'tabuk',
  name: 'غزوة تبوك',
  nameTransliterated: 'Expedition of Tabuk',
  fields: {
    engagement: { value: 'GHAZWAH', claims: legacyUnreviewed },
    hijriYear: { value: 9, claims: legacyUnreviewed },
    location: { value: 'تبوك', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: legacyUnreviewed },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    { person: 'uthman-ibn-affan', isMuslim: true, claims: legacyUnreviewed },
    { person: 'ali-ibn-abi-talib', isMuslim: true, relation: 'ABSENT_FROM', status: ['ABSENT_EXCUSED'], claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default tabuk;

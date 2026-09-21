import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. No batch has read this battle, so every value below is in use with
// its evidence owed.
const taif = {
  kind: 'BATTLE',
  slug: 'taif',
  name: 'غزوة الطائف',
  nameTransliterated: 'Siege of Taif',
  fields: {
    engagement: { value: 'GHAZWAH', claims: legacyUnreviewed },
    hijriYear: { value: 8, claims: legacyUnreviewed },
    location: { value: 'الطائف', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: legacyUnreviewed },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default taif;

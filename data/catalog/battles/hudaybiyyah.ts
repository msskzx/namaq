import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. No batch has read this battle, so every value below is in use with
// its evidence owed.
const hudaybiyyah = {
  kind: 'BATTLE',
  slug: 'hudaybiyyah',
  name: 'صلح الحديبية',
  nameTransliterated: 'Treaty of Hudaybiyyah',
  fields: {
    engagement: { value: 'GHAZWAH', claims: legacyUnreviewed },
    hijriYear: { value: 6, claims: legacyUnreviewed },
    location: { value: 'الحديبية', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: legacyUnreviewed },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    { person: 'uthman-ibn-affan', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default hudaybiyyah;

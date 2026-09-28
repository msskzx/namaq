import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. His father, also a companion, died in the year of the Conquest
 * of Mecca while en route -- not named beyond "Abd Nahm ibn Afif" already
 * in the nasab, no separate node needed.
 */
const abdullahIbnMughaffal = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-mughaffal',
  name: 'عبد الله بن مغفل',
  nameTransliterated: 'Abdullah ibn Mughaffal',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عبد الله بن مغفل بن عبد نهم بن عفيف المزني',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abdullahIbnMughaffal;

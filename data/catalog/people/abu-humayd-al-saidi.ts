import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No settled
 * name -- his page offers two candidates ("Abd al-Rahman" or "al-Mundhir
 * ibn Sa'd") with no preference stated, so no fullName is recorded rather
 * than guessing.
 */
const abuHumaydAlSaidi = {
  kind: 'PERSON',
  slug: 'abu-humayd-al-saidi',
  name: 'أبو حميد الساعدي',
  nameTransliterated: 'Abu Humayd al-Saidi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuHumaydAlSaidi;

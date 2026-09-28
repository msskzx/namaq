import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No
 * father's-father chain given on his own page.
 */
const maqilIbnYasar = {
  kind: 'PERSON',
  slug: 'maqil-ibn-yasar',
  name: 'معقل بن يسار',
  nameTransliterated: 'Maqil ibn Yasar',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'معقل بن يسار المزني',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default maqilIbnYasar;

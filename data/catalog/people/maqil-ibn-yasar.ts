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
    fullName: {
      value: 'معقل بن يسار المزني',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default maqilIbnYasar;

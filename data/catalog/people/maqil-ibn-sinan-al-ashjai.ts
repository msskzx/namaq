import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No
 * father's-father chain given on his own page; distinct from Maqil ibn
 * Yasar (different father, different tribe).
 */
const maqilIbnSinanAlAshjai = {
  kind: 'PERSON',
  slug: 'maqil-ibn-sinan-al-ashjai',
  name: 'معقل بن سنان الأشجعي',
  nameTransliterated: 'Maqil ibn Sinan al-Ashjai',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'معقل بن سنان الأشجعي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default maqilIbnSinanAlAshjai;

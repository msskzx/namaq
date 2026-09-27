import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker.
 */
const imranIbnHusain = {
  kind: 'PERSON',
  slug: 'imran-ibn-husain',
  name: 'عمران بن حصين',
  nameTransliterated: 'Imran ibn Husain',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عمران بن حصين بن عبيد بن خلف الخزاعي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default imranIbnHusain;

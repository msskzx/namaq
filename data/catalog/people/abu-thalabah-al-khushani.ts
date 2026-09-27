import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No nasab at
 * all given on his own page, so no fullName is recorded rather than
 * guessing.
 */
const abuThalabahAlKhushani = {
  kind: 'PERSON',
  slug: 'abu-thalabah-al-khushani',
  name: 'أبو ثعلبة الخشني',
  nameTransliterated: 'Abu Thalabah al-Khushani',
  hasProfile: true,
  fields: {},
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuThalabahAlKhushani;

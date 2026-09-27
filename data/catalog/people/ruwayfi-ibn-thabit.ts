import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData14.ts entry. No
 * father's-father chain given on his own page.
 */
const ruwayfiIbnThabit = {
  kind: 'PERSON',
  slug: 'ruwayfi-ibn-thabit',
  name: 'رويفع بن ثابت',
  nameTransliterated: 'Ruwayfi ibn Thabit',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'رويفع بن ثابت الأنصاري النجاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default ruwayfiIbnThabit;

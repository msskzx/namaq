import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData6.ts entry, which took it
 * from the nasab chain on his own page without citing it. His edge to his
 * father is already declared on al-baraa-ibn-marur.ts.
 */
const bishrIbnAlBaraa = {
  kind: 'PERSON',
  slug: 'bishr-ibn-al-baraa',
  name: 'بشر بن البراء',
  nameTransliterated: 'Bishr ibn al-Baraa',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'بشر بن البراء بن معرور بن صخر بن خنساء بن سنان الأنصاري الخزرجي السلمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default bishrIbnAlBaraa;

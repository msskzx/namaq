import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker.
 */
const rafiIbnKhudayj = {
  kind: 'PERSON',
  slug: 'rafi-ibn-khudayj',
  name: 'رافع بن خديج',
  nameTransliterated: 'Rafi ibn Khudayj',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'رافع بن خديج بن رافع بن عدي بن تزيد الأنصاري الخزرجي المدني',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default rafiIbnKhudayj;

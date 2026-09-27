import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData11.ts entry. Children
 * Abdullah, Abd al-Rahman, Sawdah, Amrah, and Umm Kulthum are not yet their
 * own entries in this pipeline (the "Sawdah" named on his page is unrelated
 * to sawdah-bint-zamah, a wife of the Prophet).
 */
const harithahIbnAlNuman = {
  kind: 'PERSON',
  slug: 'harithah-ibn-al-numan',
  name: 'حارثة بن النعمان',
  nameTransliterated: 'Harithah ibn al-Numan',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'حارثة بن النعمان بن نفع بن زيد بن عبيد بن ثعلبة بن غنم بن مالك بن النجار الأنصاري النجاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default harithahIbnAlNuman;

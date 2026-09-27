import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData9.ts entry. Her FATHER edge
 * (umar-ibn-al-khattab.ts) and HUSBAND edge (prophet-muhammad.ts) are
 * already declared from the other side.
 */
const hafsaBintUmar = {
  kind: 'PERSON',
  slug: 'hafsa-bint-umar',
  name: 'حفصة بنت عمر',
  nameTransliterated: 'Hafsa bint Umar',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'حفصة بنت عمر بن الخطاب بن نفيل بن عبد العزى بن رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشية العدوية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
    { title: 'mother-of-believers', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default hafsaBintUmar;

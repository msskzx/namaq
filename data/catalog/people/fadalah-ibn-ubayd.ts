import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker.
 */
const fadalahIbnUbayd = {
  kind: 'PERSON',
  slug: 'fadalah-ibn-ubayd',
  name: 'فضالة بن عبيد',
  nameTransliterated: 'Fadalah ibn Ubayd',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'فضالة بن عبيد بن نافذ بن قيس بن صهيب بن أصرم بن جحجبى الأنصاري الأوسي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default fadalahIbnUbayd;

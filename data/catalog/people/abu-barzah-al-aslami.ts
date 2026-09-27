import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData14.ts entry. His own page
 * lists five further candidate names besides the one used here ("per the
 * correct view"). Son al-Mughirah and granddaughter Muniyah bint Ubayd,
 * narrators from him, are not yet in this pipeline.
 */
const abuBarzahAlAslami = {
  kind: 'PERSON',
  slug: 'abu-barzah-al-aslami',
  name: 'أبو برزة الأسلمي',
  nameTransliterated: 'Abu Barzah al-Aslami',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'نضلة بن عبيد الأسلمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuBarzahAlAslami;

import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. Poet; real
 * name per Muhammad ibn Sallam.
 */
const alNabighahAlJadi = {
  kind: 'PERSON',
  slug: 'al-nabighah-al-jadi',
  name: 'النابغة الجعدي',
  nameTransliterated: 'Al-Nabighah al-Jadi',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'قيس بن عبد الله بن عدس بن ربيعة بن جعدة',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default alNabighahAlJadi;

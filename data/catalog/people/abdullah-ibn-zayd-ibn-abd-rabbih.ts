import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData11.ts entry. The Companion
 * shown the call to prayer (adhan) in a dream. Distinct from
 * abdullah-ibn-zayd-al-najjari (also "Abdullah ibn Zayd", different father
 * and tribe branch) -- disambiguated by nasab in the slug.
 */
const abdullahIbnZaydIbnAbdRabbih = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-zayd-ibn-abd-rabbih',
  name: 'عبد الله بن زيد',
  nameTransliterated: 'Abdullah ibn Zayd ibn Abd Rabbih',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عبد الله بن زيد بن عبد ربه بن ثعلبة الأنصاري الخزرجي المدني البدري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abdullahIbnZaydIbnAbdRabbih;

import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData11.ts entry. Known as Ibn
 * Umm Umarah; distinct from abdullah-ibn-zayd-ibn-abd-rabbih (also
 * "Abdullah ibn Zayd") -- disambiguated by nasab in the slug. One of those
 * credited with killing Musaylimah the false prophet. Paternal uncle of
 * Abbad ibn Tamim, not yet in this pipeline.
 */
const abdullahIbnZaydAlNajjari = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-zayd-al-najjari',
  name: 'عبد الله بن زيد النجاري',
  nameTransliterated: 'Abdullah ibn Zayd al-Najjari',
  hasProfile: true,
  fields: {
    fullName: { value: 'عبد الله بن زيد بن عاصم بن كعب الأنصاري المازني النجاري', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abdullahIbnZaydAlNajjari;

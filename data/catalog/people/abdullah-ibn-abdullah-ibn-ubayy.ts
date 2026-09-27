import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Son of the hypocrite chief Abdullah ibn Ubayy, himself a notable and
 * devout companion per the retired prisma/personSeedData7.ts entry;
 * martyred at Yamamah.
 */
const abdullahIbnAbdullahIbnUbayy = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-abdullah-ibn-ubayy',
  name: 'عبد الله بن عبد الله بن أبي',
  nameTransliterated: 'Abdullah ibn Abdullah ibn Ubayy',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عبد الله بن عبد الله بن أبي بن مالك بن الحارث بن عبيد بن مالك بن سالم بن غنم بن عوف بن الخزرج الأنصاري الخزرجي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abdullah-ibn-ubayy', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAbdullahIbnUbayy;

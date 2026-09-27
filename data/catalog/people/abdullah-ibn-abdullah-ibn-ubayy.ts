import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdullahIbnAbdullahIbnUbayy = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-abdullah-ibn-ubayy',
  name: 'عبد الله بن عبد الله بن أبي',
  nameTransliterated: 'Abdullah ibn Abdullah ibn Ubayy',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abdullah-ibn-ubayy', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAbdullahIbnUbayy;

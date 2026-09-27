import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdullahIbnJaafar = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-jaafar',
  name: 'عبد الله بن جعفر',
  nameTransliterated: 'Abdullah ibn Jafar',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'MOTHER', to: 'asma-bint-umays', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnJaafar;

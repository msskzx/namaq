import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdullahIbnRawahah = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-rawahah',
  name: 'عبد الله بن رواحة',
  nameTransliterated: 'Abdullah ibn Rawahah',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'rawahah-ibn-thalabah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnRawahah;

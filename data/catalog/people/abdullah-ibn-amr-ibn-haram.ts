import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdullahIbnAmrIbnHaram = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-amr-ibn-haram',
  name: 'عبد الله بن عمرو بن حرام',
  nameTransliterated: 'Abdullah ibn Amr ibn Haram',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-haram', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAmrIbnHaram;

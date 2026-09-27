import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const saeedIbnAlHarith = {
  kind: 'PERSON',
  slug: 'saeed-ibn-al-harith',
  name: 'سعيد بن الحارث',
  nameTransliterated: 'Saeed ibn al-Harith',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-abd-al-muttalib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default saeedIbnAlHarith;

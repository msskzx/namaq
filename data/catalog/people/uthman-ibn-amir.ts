import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData2.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so the
 * link to the next ancestor stays on the legacy marker.
 */
const uthmanIbnAmir = {
  kind: 'PERSON',
  slug: 'uthman-ibn-amir',
  name: 'عثمان بن عامر',
  nameTransliterated: 'Uthman ibn Amir',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amir-ibn-amr', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default uthmanIbnAmir;

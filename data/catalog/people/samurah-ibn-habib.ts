import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const samurahIbnHabib = {
  kind: 'PERSON',
  slug: 'samurah-ibn-habib',
  name: 'سمرة بن حبيب',
  nameTransliterated: 'Samurah Ibn Habib',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'habib-ibn-rabiah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default samurahIbnHabib;

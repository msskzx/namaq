import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const hassanIbnThabit = {
  kind: 'PERSON',
  slug: 'hassan-ibn-thabit',
  name: 'حسان بن ثابت',
  nameTransliterated: 'Hassan ibn Thabit',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'thabit-ibn-al-mundhir', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default hassanIbnThabit;

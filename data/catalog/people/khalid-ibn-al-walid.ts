import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const khalidIbnAlWalid = {
  kind: 'PERSON',
  slug: 'khalid-ibn-al-walid',
  name: 'خالد بن الوليد',
  nameTransliterated: 'Khalid ibn al-Walid',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-walid-ibn-al-mughirah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default khalidIbnAlWalid;

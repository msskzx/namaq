import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const asadIbnAbdullahIbnUmar = {
  kind: 'PERSON',
  slug: 'asad-ibn-abdullah-ibn-umar',
  name: 'أسد بن عبد الله',
  nameTransliterated: 'Asad Ibn Abdullah Ibn Umar',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abdullah-ibn-umar-ibn-makhzum', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default asadIbnAbdullahIbnUmar;

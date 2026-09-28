import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const talhahIbnAbdullahIbnAbdAlUzza = {
  kind: 'PERSON',
  slug: 'talhah-ibn-abdullah-ibn-abd-al-uzza',
  name: 'طلحة بن عبد الله',
  nameTransliterated: 'Talhah ibn Abdullah ibn Abd Al Uzza',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abdullah-ibn-abd-al-uzza-abu-talhah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default talhahIbnAbdullahIbnAbdAlUzza;

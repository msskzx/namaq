import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const uthmanAlHijabiIbnAbdullah = {
  kind: 'PERSON',
  slug: 'uthman-al-hijabi-ibn-abdullah',
  name: 'عثمان بن عبد الله',
  nameTransliterated: 'Uthman Al Hijabi ibn Abdullah',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abdullah-ibn-abd-al-uzza-abu-talhah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default uthmanAlHijabiIbnAbdullah;

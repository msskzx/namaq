import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const umayyahIbnKhalaf = {
  kind: 'PERSON',
  slug: 'umayyah-ibn-khalaf',
  name: 'أمية بن خلف',
  nameTransliterated: 'Umayyah ibn Khalaf',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'khalaf-ibn-wahb', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default umayyahIbnKhalaf;

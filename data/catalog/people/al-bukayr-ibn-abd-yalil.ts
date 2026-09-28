import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alBukayrIbnAbdYalil = {
  kind: 'PERSON',
  slug: 'al-bukayr-ibn-abd-yalil',
  name: 'البكير بن عبد ياليل',
  nameTransliterated: 'Al Bukayr ibn Abd Yalil',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-yalil-ibn-nashib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alBukayrIbnAbdYalil;

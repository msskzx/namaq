import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData2.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so the
 * link to the next ancestor stays on the legacy marker.
 */
const nufaylIbnAbdAlUzza = {
  kind: 'PERSON',
  slug: 'nufayl-ibn-abd-al-uzza',
  name: 'نفيل بن عبد العزى',
  nameTransliterated: 'Nufayl ibn Abd al-Uzza',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-uzza-ibn-riyah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default nufaylIbnAbdAlUzza;

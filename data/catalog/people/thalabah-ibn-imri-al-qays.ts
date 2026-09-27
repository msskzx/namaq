import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const thalabahIbnImriAlQays = {
  kind: 'PERSON',
  slug: 'thalabah-ibn-imri-al-qays',
  name: 'ثعلبة بن امرئ القيس',
  nameTransliterated: 'Thalabah Ibn Imri Al Qays',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'imru-al-qays-ibn-thalabah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default thalabahIbnImriAlQays;

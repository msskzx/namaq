import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alNumanIbnImriAlQays = {
  kind: 'PERSON',
  slug: 'al-numan-ibn-imri-al-qays',
  name: 'النعمان بن امرئ القيس',
  nameTransliterated: 'Al Numan ibn Imri Al Qays',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'imru-al-qays-ibn-zayd', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alNumanIbnImriAlQays;

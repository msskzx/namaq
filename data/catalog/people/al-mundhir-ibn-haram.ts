import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alMundhirIbnHaram = {
  kind: 'PERSON',
  slug: 'al-mundhir-ibn-haram',
  name: 'المنذر بن حرام',
  nameTransliterated: 'Al Mundhir Ibn Haram',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'haram-ibn-amr', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alMundhirIbnHaram;

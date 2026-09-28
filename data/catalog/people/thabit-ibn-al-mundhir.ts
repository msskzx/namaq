import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const thabitIbnAlMundhir = {
  kind: 'PERSON',
  slug: 'thabit-ibn-al-mundhir',
  name: 'ثابت بن المنذر',
  nameTransliterated: 'Thabit ibn Al Mundhir',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-mundhir-ibn-haram', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default thabitIbnAlMundhir;

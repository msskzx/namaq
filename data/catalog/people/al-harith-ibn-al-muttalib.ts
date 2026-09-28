import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alHarithIbnAlMuttalib = {
  kind: 'PERSON',
  slug: 'al-harith-ibn-al-muttalib',
  name: 'الحارث بن المطلب',
  nameTransliterated: 'Al Harith ibn Al Muttalib',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-muttalib-ibn-abd-manaf', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHarithIbnAlMuttalib;

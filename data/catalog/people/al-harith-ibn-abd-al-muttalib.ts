import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alHarithIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'al-harith-ibn-abd-al-muttalib',
  name: 'الحارث بن عبد المطلب',
  nameTransliterated: 'Al Harith ibn Abd Al Muttalib',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHarithIbnAbdAlMuttalib;

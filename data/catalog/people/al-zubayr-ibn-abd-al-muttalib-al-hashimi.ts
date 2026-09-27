import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alZubayrIbnAbdAlMuttalibAlHashimi = {
  kind: 'PERSON',
  slug: 'al-zubayr-ibn-abd-al-muttalib-al-hashimi',
  name: 'الزبير بن عبد المطلب',
  nameTransliterated: 'Al Zubayr ibn Abd Al Muttalib Al Hashimi',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alZubayrIbnAbdAlMuttalibAlHashimi;

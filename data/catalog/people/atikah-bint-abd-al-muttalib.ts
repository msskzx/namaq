import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const atikahBintAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'atikah-bint-abd-al-muttalib',
  name: 'عاتكة بنت عبد المطلب',
  nameTransliterated: 'Atikah bint Abd al-Muttalib',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default atikahBintAbdAlMuttalib;

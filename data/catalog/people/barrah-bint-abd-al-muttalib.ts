import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Mother (by her first husband) of the companion Abu Salamah ibn Abd
 * al-Asad, per the retired prisma/personSeedData10.ts entry. Her page
 * explicitly says she did not live to see the Prophet's mission, and is
 * mentioned "in passing" for her sons' sake.
 */
const barrahBintAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'barrah-bint-abd-al-muttalib',
  name: 'برة بنت عبد المطلب',
  nameTransliterated: 'Barrah bint Abd al-Muttalib',
  hasProfile: true,
  fields: {
    fullName: { value: 'برة بنت عبد المطلب بن هاشم القرشية الهاشمية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default barrahBintAbdAlMuttalib;

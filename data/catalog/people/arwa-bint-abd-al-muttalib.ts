import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Her own page in the retired prisma/personSeedData10.ts entry describes
 * her only as "عمة رسول الله" without literally stating "بنت عبد المطلب" --
 * fullName follows the sibling-grouping inference rule (she is listed under
 * the same "paternal aunts" heading as her sisters, all of whom do
 * explicitly confirm that parentage on their own pages).
 */
const arwaBintAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'arwa-bint-abd-al-muttalib',
  name: 'أروى بنت عبد المطلب',
  nameTransliterated: 'Arwa bint Abd al-Muttalib',
  hasProfile: true,
  fields: {
    fullName: { value: 'أروى بنت عبد المطلب بن هاشم القرشية الهاشمية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default arwaBintAbdAlMuttalib;

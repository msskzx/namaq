import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Full sister of Hamzah ibn Abd al-Muttalib via a shared Zuhri mother, per
 * the retired prisma/personSeedData10.ts entry -- mother of az-Zubayr ibn
 * al-Awwam by her husband al-Awwam ibn Khuwaylid. Distinct from
 * safiyyah-bint-huyayy, one of the Prophet's wives.
 */
const safiyyahBintAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'safiyyah-bint-abd-al-muttalib',
  name: 'صفية بنت عبد المطلب',
  nameTransliterated: 'Safiyyah bint Abd al-Muttalib',
  hasProfile: true,
  fields: {
    fullName: { value: 'صفية بنت عبد المطلب بن هاشم القرشية الهاشمية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default safiyyahBintAbdAlMuttalib;

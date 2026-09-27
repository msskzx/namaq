import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Also known by the kunya Umm Hakim per the retired prisma/personSeedData10.ts
 * entry. Via her first husband Kurayz ibn Rabi'ah, mother of Arwa bint
 * Kurayz -- in turn the mother of Uthman ibn Affan. Via her second husband
 * Uqba ibn Abi Mu'ayt, mother of Umm Kulthum bint Uqba.
 */
const alBaydaBintAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'al-bayda-bint-abd-al-muttalib',
  name: 'البيضاء بنت عبد المطلب',
  nameTransliterated: 'Al-Bayda bint Abd al-Muttalib (Umm Hakim)',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'البيضاء أم حكيم بنت عبد المطلب بن هاشم القرشية الهاشمية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'uqba-ibn-abi-muayt', claims: legacyUnreviewed },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'kurayz-ibn-rabiah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alBaydaBintAbdAlMuttalib;

import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Explicit sister of Abu Lahab ibn Abd al-Muttalib per the retired
 * prisma/personSeedData10.ts entry (he was never a Muslim, no profile).
 * Famous for a dream foretelling the Quraysh defeat at Badr, which kept Abu
 * Lahab from attending the battle in person.
 */
const atikahBintAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'atikah-bint-abd-al-muttalib',
  name: 'عاتكة بنت عبد المطلب',
  nameTransliterated: 'Atikah bint Abd al-Muttalib',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'عاتكة بنت عبد المطلب بن هاشم القرشية الهاشمية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default atikahBintAbdAlMuttalib;

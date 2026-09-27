import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * A genuinely disputed identity per the retired prisma/personSeedData10.ts
 * entry: her own page opens by calling her "بنت عبد المطلب" but al-Dhahabi
 * himself then casts doubt on this, citing a report that she is instead
 * Umaymah bint Rabi'ah (a granddaughter of Abd al-Muttalib via his son
 * al-Harith, one generation removed) and concludes the "real" aunt Umaymah
 * likely never migrated or lived into Islam at all. fullName here follows
 * the entry's own opening statement. What is not disputed: she is the
 * mother of Zaynab bint Jahsh by her husband Jahsh ibn Riyab, and received a
 * Khaybar grant.
 */
const umaymahBintAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'umaymah-bint-abd-al-muttalib',
  name: 'أميمة بنت عبد المطلب',
  nameTransliterated: 'Umaymah bint Abd al-Muttalib',
  hasProfile: true,
  fields: {
    fullName: { value: 'أميمة بنت عبد المطلب بن هاشم القرشية الهاشمية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default umaymahBintAbdAlMuttalib;

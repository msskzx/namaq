import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Ally (حليف) of Banu Umayya from Hadramawt, not blood Quraysh, per the
 * retired prisma/personSeedData6.ts entry -- whose own page gave more than
 * one variant report of his father's ancestry; fullName here keeps only the
 * consistently-reported immediate father rather than the disputed deeper
 * chain.
 */
const alAlaIbnAlHadrami = {
  kind: 'PERSON',
  slug: 'al-ala-ibn-al-hadrami',
  name: 'العلاء بن الحضرمي',
  nameTransliterated: 'Al-Ala ibn al-Hadrami',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: { value: 'العلاء بن عبد الله بن عماد الحضرمي حليف بني أمية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abdullah-ibn-imad-al-hadrami', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alAlaIbnAlHadrami;

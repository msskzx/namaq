import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Distinct from abdullah-ibn-al-harith-ibn-nawfal (a grandson of al-Harith
 * ibn Abd al-Muttalib via his son Nawfal, one generation below): the retired
 * prisma/personSeedData6.ts entry's own page calls this one "أخو ربيعة
 * ونوفل" (brother of Rabi'ah and Nawfal), i.e. a direct son of al-Harith ibn
 * Abd al-Muttalib, and notes the Prophet renamed him from "Abd Shams" to
 * "Abdullah".
 */
const abdullahIbnAlHarithIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-al-harith-ibn-abd-al-muttalib',
  name: 'عبد الله بن الحارث',
  nameTransliterated: 'Abdullah ibn al-Harith ibn Abd al-Muttalib',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عبد الله بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-abd-al-muttalib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAlHarithIbnAbdAlMuttalib;

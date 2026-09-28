import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const nawfalIbnAlHarith = {
  kind: 'PERSON',
  slug: 'nawfal-ibn-al-harith',
  name: 'نوفل بن الحارث',
  nameTransliterated: 'Nawfal ibn al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    // Carried from the retired prisma/personSeedData5.ts entry, which took it
    // from the nasab chain on his own page without citing it.
    fullName: { value: 'نوفل بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-abd-al-muttalib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default nawfalIbnAlHarith;

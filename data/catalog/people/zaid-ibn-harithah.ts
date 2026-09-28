import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const zaidIbnHarithah = {
  kind: 'PERSON',
  slug: 'zaid-ibn-harithah',
  name: 'زيد بن حارثة',
  nameTransliterated: 'Zaid ibn Harithah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'زيد بن حارثة بن شراحيل بن كعب بن عبد العزى بن يزيد بن امرئ القيس بن عامر بن النعمان الكلبي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'sharahil-ibn-kaab', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default zaidIbnHarithah;

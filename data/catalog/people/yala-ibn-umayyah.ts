import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData14.ts entry. Also
 * known by his mother's name, "Yala ibn Munyah". Brother Abd al-Rahman
 * and nephew Safwan ibn Abdullah, narrators from him, are not yet in this
 * pipeline.
 */
const yalaIbnUmayyah = {
  kind: 'PERSON',
  slug: 'yala-ibn-umayyah',
  name: 'يعلى بن أمية',
  nameTransliterated: 'Yala ibn Umayyah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'يعلى بن أمية بن أبي عبيدة التميمي المكي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'MOTHER', to: 'munyah-bint-ghazwan', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default yalaIbnUmayyah;

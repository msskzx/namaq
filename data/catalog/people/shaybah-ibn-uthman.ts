import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData14.ts entry. Maternal
 * nephew of the existing companion Musab ibn Umayr, per his own page
 * ("khaluhu", his maternal uncle) -- not yet modelled as a direct edge.
 */
const shaybahIbnUthman = {
  kind: 'PERSON',
  slug: 'shaybah-ibn-uthman',
  name: 'شيبة بن عثمان',
  nameTransliterated: 'Shaybah ibn Uthman',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'شيبة بن عثمان بن عبد الله بن عبد العزى القرشي العبدري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'uthman-al-hijabi-ibn-abdullah', claims: legacyUnreviewed },
    { type: 'PATERNAL_COUSIN', inverse: 'PATERNAL_COUSIN', to: 'uthman-ibn-talhah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default shaybahIbnUthman;

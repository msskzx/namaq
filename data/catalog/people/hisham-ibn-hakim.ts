import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData14.ts entry.
 */
const hishamIbnHakim = {
  kind: 'PERSON',
  slug: 'hisham-ibn-hakim',
  name: 'هشام بن حكيم',
  nameTransliterated: 'Hisham ibn Hakim',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'هشام بن حكيم بن حزام القرشي الأسدي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'hakim-ibn-hizam', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default hishamIbnHakim;

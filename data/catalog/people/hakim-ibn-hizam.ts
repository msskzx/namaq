import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData14.ts entry. Father of
 * Hisham ibn Hakim, whose own module already declares that SON/FATHER edge.
 */
const hakimIbnHizam = {
  kind: 'PERSON',
  slug: 'hakim-ibn-hizam',
  name: 'حكيم بن حزام',
  nameTransliterated: 'Hakim ibn Hizam',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'حكيم بن حزام بن خويلد بن أسد بن عبد العزى بن قصي بن كلاب القرشي الأسدي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'hizam-ibn-khuwaylid', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default hakimIbnHizam;

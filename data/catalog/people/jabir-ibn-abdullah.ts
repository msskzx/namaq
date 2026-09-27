import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData15.ts entry.
 */
const jabirIbnAbdullah = {
  kind: 'PERSON',
  slug: 'jabir-ibn-abdullah',
  name: 'جابر بن عبد الله',
  nameTransliterated: 'Jabir ibn Abdullah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'جابر بن عبد الله بن عمرو بن حرام بن ثعلبة بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abdullah-ibn-amr-ibn-haram', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default jabirIbnAbdullah;

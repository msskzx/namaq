import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData14.ts entry. Son
 * Muhammad, a narrator from him, is not yet in this pipeline.
 */
const abdAlMuttalibIbnRabiah = {
  kind: 'PERSON',
  slug: 'abd-al-muttalib-ibn-rabiah',
  name: 'عبد المطلب بن ربيعة',
  nameTransliterated: 'Abd al-Muttalib ibn Rabiah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عبد المطلب بن ربيعة بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'rabiah-ibn-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdAlMuttalibIbnRabiah;

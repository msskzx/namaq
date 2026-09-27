import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData14.ts entry.
 */
const abdullahIbnAmir = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-amir',
  name: 'عبد الله بن عامر',
  nameTransliterated: 'Abdullah ibn Amir',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عبد الله بن عامر بن كريز بن ربيعة بن حبيب بن عبد شمس بن عبد مناف بن قصي القرشي العبشمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amir-ibn-kurayz', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAmir;

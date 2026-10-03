import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName, virtues and the
 * companion title are carried from the retired prisma/personSeedData.ts
 * entry, uncited.
 */
const abdullahIbnJaafar = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-jaafar',
  name: 'عبد الله بن جعفر',
  nameTransliterated: 'Abdullah ibn Jafar',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: { value: 'عبد الله بن جعفر بن أبي طالب الهاشمي القرشي', claims: legacyUnreviewed },
  },
  virtues: [
    {
      value: 'ابن عم النبي، من أجود الناس وأكرمهم، كان يُلقب بـ "بحر الجود".',
      claims: legacyUnreviewed,
    },
  ],

  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'MOTHER', to: 'asma-bint-umays', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnJaafar;

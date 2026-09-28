import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData13.ts entry, which
 * uses the fuller of two reported chains (see that entry's own comment).
 */
const abdAlRahmanIbnSamurah = {
  kind: 'PERSON',
  slug: 'abd-al-rahman-ibn-samurah',
  name: 'عبد الرحمن بن سمرة',
  nameTransliterated: 'Abd al-Rahman ibn Samurah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عبد الرحمن بن سمرة بن حبيب بن ربيعة بن عبد شمس بن عبد مناف بن قصي بن كلاب القرشي العبشمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'samurah-ibn-habib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdAlRahmanIbnSamurah;

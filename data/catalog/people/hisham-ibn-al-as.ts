import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData14.ts entry. Brother
 * of Amr ibn al-As, whose own module already declares that BROTHER edge.
 */
const hishamIbnAlAs = {
  kind: 'PERSON',
  slug: 'hisham-ibn-al-as',
  name: 'هشام بن العاص',
  nameTransliterated: 'Hisham ibn al-As',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'هشام بن العاص بن وائل القرشي السهمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'MOTHER', to: 'umm-harmalah-al-makhzumiyyah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default hishamIbnAlAs;

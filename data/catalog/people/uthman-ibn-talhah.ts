import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData14.ts entry. Paternal
 * cousin of Shaybah ibn Uthman (their fathers Talhah and the elder Uthman
 * "al-Hijabi" were brothers) -- his own module already declares that edge.
 */
const uthmanIbnTalhah = {
  kind: 'PERSON',
  slug: 'uthman-ibn-talhah',
  name: 'عثمان بن طلحة',
  nameTransliterated: 'Uthman ibn Talhah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عثمان بن طلحة بن عبد الله بن عبد العزى بن عثمان بن عبد الدار بن قصي بن كلاب القرشي العبدري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'talhah-ibn-abdullah-ibn-abd-al-uzza', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default uthmanIbnTalhah;

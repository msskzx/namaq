import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const ikrimahIbnAbiJahl = {
  kind: 'PERSON',
  slug: 'ikrimah-ibn-abi-jahl',
  name: 'عكرمة بن أبي جهل',
  nameTransliterated: 'Ikrimah ibn Abi Jahl',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عكرمة بن أبي جهل عمرو بن هشام بن المغيرة بن عبد الله بن عمر بن مخزوم القرشي المخزومي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abu-jahl-ibn-hisham', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ikrimahIbnAbiJahl;

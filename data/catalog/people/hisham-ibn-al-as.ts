import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const hishamIbnAlAs = {
  kind: 'PERSON',
  slug: 'hisham-ibn-al-as',
  name: 'هشام بن العاص',
  nameTransliterated: 'Hisham ibn al-As',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'MOTHER', to: 'umm-harmalah-al-makhzumiyyah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default hishamIbnAlAs;

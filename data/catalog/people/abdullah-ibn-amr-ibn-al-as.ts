import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdullahIbnAmrIbnAlAs = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-amr-ibn-al-as',
  name: 'عبد الله بن عمرو بن العاص',
  nameTransliterated: 'Abdullah ibn Amr ibn al-As',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-al-as', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'raitah-bint-al-hajjaj', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAmrIbnAlAs;

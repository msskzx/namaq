import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const amrIbnAlAs = {
  kind: 'PERSON',
  slug: 'amr-ibn-al-as',
  name: 'عمرو بن العاص',
  nameTransliterated: 'Amr ibn al-As',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-as-ibn-wail-al-sahmi', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'raitah-bint-al-hajjaj', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'hisham-ibn-al-as', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amrIbnAlAs;

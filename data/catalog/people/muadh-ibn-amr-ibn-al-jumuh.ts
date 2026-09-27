import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const muadhIbnAmrIbnAlJumuh = {
  kind: 'PERSON',
  slug: 'muadh-ibn-amr-ibn-al-jumuh',
  name: 'معاذ بن عمرو بن الجموح',
  nameTransliterated: 'Muadh ibn Amr ibn al-Jumuh',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-al-jumuh', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default muadhIbnAmrIbnAlJumuh;

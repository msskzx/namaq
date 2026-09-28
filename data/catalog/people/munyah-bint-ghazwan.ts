import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const munyahBintGhazwan = {
  kind: 'PERSON',
  slug: 'munyah-bint-ghazwan',
  name: 'منية بنت غزوان',
  nameTransliterated: 'Munyah Bint Ghazwan',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'ghazwan-ibn-jabir', claims: legacyUnreviewed },
    { type: 'SISTER', inverse: 'BROTHER', to: 'utbah-ibn-ghazwan', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default munyahBintGhazwan;

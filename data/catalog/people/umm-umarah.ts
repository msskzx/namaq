import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const ummUmarah = {
  kind: 'PERSON',
  slug: 'umm-umarah',
  name: 'أم عمارة',
  nameTransliterated: 'Umm Umarah (Nusaybah bint Kaab)',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'kaab-ibn-amr-ibn-awf', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummUmarah;

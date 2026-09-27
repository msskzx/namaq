import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const ummAlFadlBintAlHarith = {
  kind: 'PERSON',
  slug: 'umm-al-fadl-bint-al-harith',
  name: 'أم الفضل',
  nameTransliterated: 'Umm al-Fadl bint al-Harith',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'al-harith-ibn-hazn-al-hilali', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummAlFadlBintAlHarith;

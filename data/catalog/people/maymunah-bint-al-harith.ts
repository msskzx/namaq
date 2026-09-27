import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const maymunahBintAlHarith = {
  kind: 'PERSON',
  slug: 'maymunah-bint-al-harith',
  name: 'ميمونة بنت الحارث',
  nameTransliterated: 'Maymunah bint al-Harith',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'al-harith-ibn-hazn-al-hilali', claims: legacyUnreviewed },
    { type: 'SISTER', inverse: 'SISTER', to: 'umm-al-fadl-bint-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default maymunahBintAlHarith;

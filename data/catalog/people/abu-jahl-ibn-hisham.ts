import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abuJahlIbnHisham = {
  kind: 'PERSON',
  slug: 'abu-jahl-ibn-hisham',
  name: 'أبو جهل',
  nameTransliterated: 'Abu Jahl Ibn Hisham',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'hisham-ibn-al-mughirah', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'SISTER', to: 'umm-harmalah-al-makhzumiyyah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuJahlIbnHisham;

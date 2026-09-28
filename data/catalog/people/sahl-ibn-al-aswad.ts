import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const sahlIbnAlAswad = {
  kind: 'PERSON',
  slug: 'sahl-ibn-al-aswad',
  name: 'سهل بن الأسود',
  nameTransliterated: 'Sahl ibn Al Aswad',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-aswad-ibn-haram', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default sahlIbnAlAswad;

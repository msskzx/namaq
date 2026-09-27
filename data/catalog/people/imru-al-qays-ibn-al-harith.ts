import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const imruAlQaysIbnAlHarith = {
  kind: 'PERSON',
  slug: 'imru-al-qays-ibn-al-harith',
  name: 'امرؤ القيس بن الحارث',
  nameTransliterated: 'Imru Al Qays ibn Al Harith',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-zayd', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default imruAlQaysIbnAlHarith;

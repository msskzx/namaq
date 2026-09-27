import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const sahlIbnHunayf = {
  kind: 'PERSON',
  slug: 'sahl-ibn-hunayf',
  name: 'سهل بن حنيف',
  nameTransliterated: 'Sahl ibn Hunayf',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'BROTHER', inverse: 'BROTHER', to: 'uthman-ibn-hunayf', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default sahlIbnHunayf;

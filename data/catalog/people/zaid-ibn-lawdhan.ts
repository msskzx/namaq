import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const zaidIbnLawdhan = {
  kind: 'PERSON',
  slug: 'zaid-ibn-lawdhan',
  name: 'زيد بن لوذان',
  nameTransliterated: 'Zaid Ibn Lawdhan',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'lawdhan-ibn-amr', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default zaidIbnLawdhan;

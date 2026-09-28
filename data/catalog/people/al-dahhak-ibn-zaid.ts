import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alDahhakIbnZaid = {
  kind: 'PERSON',
  slug: 'al-dahhak-ibn-zaid',
  name: 'الضحاك بن زيد',
  nameTransliterated: 'Al Dahhak ibn Zaid',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'zaid-ibn-lawdhan', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alDahhakIbnZaid;

import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alRabiIbnAbdAlUzza = {
  kind: 'PERSON',
  slug: 'al-rabi-ibn-abd-al-uzza',
  name: 'الربيع بن عبد العزى',
  nameTransliterated: 'Al Rabi Ibn Abd Al Uzza',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-uzza-ibn-abd-shams', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alRabiIbnAbdAlUzza;

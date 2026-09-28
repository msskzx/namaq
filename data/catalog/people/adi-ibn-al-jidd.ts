import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const adiIbnAlJidd = {
  kind: 'PERSON',
  slug: 'adi-ibn-al-jidd',
  name: 'عدي بن الجد',
  nameTransliterated: 'Adi ibn Al Jidd',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-jidd-ibn-al-ajlan', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default adiIbnAlJidd;

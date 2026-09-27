import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const kurayzIbnRabiah = {
  kind: 'PERSON',
  slug: 'kurayz-ibn-rabiah',
  name: 'كريز بن ربيعة',
  nameTransliterated: 'Kurayz Ibn Rabiah',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'habib-ibn-abd-shams', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'FATHER', to: 'rabiah-ibn-habib-al-abshami', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default kurayzIbnRabiah;

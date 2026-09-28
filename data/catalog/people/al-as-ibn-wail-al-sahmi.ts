import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alAsIbnWailAlSahmi = {
  kind: 'PERSON',
  slug: 'al-as-ibn-wail-al-sahmi',
  name: 'العاص بن وائل',
  nameTransliterated: 'Al As ibn Wail Al Sahmi',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'wail-ibn-hashim-al-sahmi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alAsIbnWailAlSahmi;

import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alHarithIbnNawfal = {
  kind: 'PERSON',
  slug: 'al-harith-ibn-nawfal',
  name: 'الحارث بن نوفل',
  nameTransliterated: 'Al-Harith ibn Nawfal',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'nawfal-ibn-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHarithIbnNawfal;

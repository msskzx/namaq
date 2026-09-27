import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const usaydIbnAlHudayr = {
  kind: 'PERSON',
  slug: 'usayd-ibn-al-hudayr',
  name: 'أسيد بن الحضير',
  nameTransliterated: 'Usayd ibn al-Hudayr',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-hudayr-ibn-simak', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default usaydIbnAlHudayr;

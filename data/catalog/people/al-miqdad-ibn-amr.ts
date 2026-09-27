import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alMiqdadIbnAmr = {
  kind: 'PERSON',
  slug: 'al-miqdad-ibn-amr',
  name: 'المقداد بن عمرو',
  nameTransliterated: 'Al-Miqdad ibn Amr',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-thalabah', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'dubaah-bint-al-zubayr-ibn-abd-al-muttalib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alMiqdadIbnAmr;

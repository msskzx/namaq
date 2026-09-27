import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alHakamIbnAbiAlAs = {
  kind: 'PERSON',
  slug: 'al-hakam-ibn-abi-al-as',
  name: 'الحكم بن أبي العاص',
  nameTransliterated: 'Al-Hakam ibn Abi al-As',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abi-al-as-ibn-umayya', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHakamIbnAbiAlAs;

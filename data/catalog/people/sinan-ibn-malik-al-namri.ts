import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const sinanIbnMalikAlNamri = {
  kind: 'PERSON',
  slug: 'sinan-ibn-malik-al-namri',
  name: 'سنان بن مالك',
  nameTransliterated: 'Sinan ibn Malik Al Namri',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'malik-ibn-abd-amr-al-namri', claims: legacyUnreviewed },
    // Stated from the other side by his son's Siyar entry
    // (suhaib-ibn-sinan-siyar4/father); restated here so the node carries
    // the tie, with its evidence owed like the rest.
    { type: 'FATHER', inverse: 'SON', to: 'suhaib-ibn-sinan', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default sinanIbnMalikAlNamri;

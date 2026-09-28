import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const malikIbnAbdAmrAlNamri = {
  kind: 'PERSON',
  slug: 'malik-ibn-abd-amr-al-namri',
  name: 'مالك بن عبد عمرو',
  nameTransliterated: 'Malik ibn Abd Amr Al Namri',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-amr-ibn-uqail-al-namri', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default malikIbnAbdAmrAlNamri;

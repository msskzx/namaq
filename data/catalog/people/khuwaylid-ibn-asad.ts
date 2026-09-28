import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const khuwaylidIbnAsad = {
  kind: 'PERSON',
  slug: 'khuwaylid-ibn-asad',
  name: 'خويلد بن أسد',
  nameTransliterated: 'Khuwaylid ibn Asad',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'asad-ibn-abd-al-uzza', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default khuwaylidIbnAsad;

import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const hizamIbnKhuwaylid = {
  kind: 'PERSON',
  slug: 'hizam-ibn-khuwaylid',
  name: 'حزام بن خويلد',
  nameTransliterated: 'Hizam ibn Khuwaylid',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'khuwaylid-ibn-asad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default hizamIbnKhuwaylid;

import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const zaydManahIbnAdi = {
  kind: 'PERSON',
  slug: 'zayd-manah-ibn-adi',
  name: 'زيد مناة بن عدي',
  nameTransliterated: 'Zayd Manah ibn Adi',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'adi-ibn-amr', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default zaydManahIbnAdi;

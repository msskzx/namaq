import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const umaysIbnMabadAlKhathami = {
  kind: 'PERSON',
  slug: 'umays-ibn-mabad-al-khathami',
  name: 'عميس بن معبد',
  nameTransliterated: 'Umays ibn Mabad Al Khathami',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'mabad-ibn-al-harith-al-khathami', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default umaysIbnMabadAlKhathami;

import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const umayrIbnHashim = {
  kind: 'PERSON',
  slug: 'umayr-ibn-hashim',
  name: 'عمير بن هاشم',
  nameTransliterated: 'Umayr ibn Hashim',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'hashim-ibn-abd-manaf-al-abdari', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default umayrIbnHashim;

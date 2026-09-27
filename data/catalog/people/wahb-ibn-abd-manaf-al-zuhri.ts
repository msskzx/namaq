import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const wahbIbnAbdManafAlZuhri = {
  kind: 'PERSON',
  slug: 'wahb-ibn-abd-manaf-al-zuhri',
  name: 'وهب بن عبد مناف',
  nameTransliterated: 'Wahb ibn Abd Manaf Al Zuhri',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-manaf-ibn-zuhrah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default wahbIbnAbdManafAlZuhri;

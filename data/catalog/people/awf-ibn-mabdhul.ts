import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const awfIbnMabdhul = {
  kind: 'PERSON',
  slug: 'awf-ibn-mabdhul',
  name: 'عوف بن مبذول',
  nameTransliterated: 'Awf ibn Mabdhul',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'amr-ibn-awf-ibn-mabdhul', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default awfIbnMabdhul;

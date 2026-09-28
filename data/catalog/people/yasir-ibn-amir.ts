import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const yasirIbnAmir = {
  kind: 'PERSON',
  slug: 'yasir-ibn-amir',
  name: 'ياسر بن عامر',
  nameTransliterated: 'Yasir ibn Amir',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'ammar-ibn-yasir', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default yasirIbnAmir;

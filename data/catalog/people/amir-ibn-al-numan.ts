import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const amirIbnAlNuman = {
  kind: 'PERSON',
  slug: 'amir-ibn-al-numan',
  name: 'عامر بن النعمان',
  nameTransliterated: 'Amir ibn Al Numan',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'imru-al-qays-ibn-amir', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amirIbnAlNuman;

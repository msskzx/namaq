import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const malikIbnRabiah = {
  kind: 'PERSON',
  slug: 'malik-ibn-rabiah',
  name: 'مالك بن ربيعة',
  nameTransliterated: 'Malik Ibn Rabiah',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'thalabah-ibn-malik', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default malikIbnRabiah;

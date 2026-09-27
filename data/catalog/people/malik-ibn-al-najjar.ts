import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const malikIbnAlNajjar = {
  kind: 'PERSON',
  slug: 'malik-ibn-al-najjar',
  name: 'مالك بن النجار',
  nameTransliterated: 'Malik ibn Al Najjar',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'amr-ibn-malik', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'SON', to: 'ghanm-ibn-malik', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default malikIbnAlNajjar;

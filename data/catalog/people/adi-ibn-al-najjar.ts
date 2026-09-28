import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const adiIbnAlNajjar = {
  kind: 'PERSON',
  slug: 'adi-ibn-al-najjar',
  name: 'عدي بن النجار',
  nameTransliterated: 'Adi ibn Al Najjar',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'ghanm-ibn-adi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default adiIbnAlNajjar;

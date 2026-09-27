import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const mabadIbnAlHarithAlKhathami = {
  kind: 'PERSON',
  slug: 'mabad-ibn-al-harith-al-khathami',
  name: 'معبد بن الحارث',
  nameTransliterated: 'Mabad Ibn Al Harith Al Khathami',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'umays-ibn-mabad-al-khathami', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default mabadIbnAlHarithAlKhathami;

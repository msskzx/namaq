import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const alNumanIbnAbiAlJawnAlKindi = {
  kind: 'PERSON',
  slug: 'al-numan-ibn-abi-al-jawn-al-kindi',
  name: 'النعمان بن أبي الجون',
  nameTransliterated: 'Al Numan ibn Abi Al Jawn Al Kindi',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'asma-bint-al-numan-al-kindiyyah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alNumanIbnAbiAlJawnAlKindi;

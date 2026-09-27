import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const thalabahIbnKaab = {
  kind: 'PERSON',
  slug: 'thalabah-ibn-kaab',
  name: 'ثعلبة بن كعب',
  nameTransliterated: 'Thalabah Ibn Kaab',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'malik-ibn-thalabah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default thalabahIbnKaab;

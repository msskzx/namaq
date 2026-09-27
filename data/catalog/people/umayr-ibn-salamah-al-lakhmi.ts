import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const umayrIbnSalamahAlLakhmi = {
  kind: 'PERSON',
  slug: 'umayr-ibn-salamah-al-lakhmi',
  name: 'عمير بن سلمة',
  nameTransliterated: 'Umayr Ibn Salamah Al Lakhmi',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'amr-ibn-umayr-al-lakhmi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default umayrIbnSalamahAlLakhmi;

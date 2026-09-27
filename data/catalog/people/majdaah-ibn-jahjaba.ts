import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const majdaahIbnJahjaba = {
  kind: 'PERSON',
  slug: 'majdaah-ibn-jahjaba',
  name: 'مجدعة بن جحجبى',
  nameTransliterated: 'Majdaah Ibn Jahjaba',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'amir-ibn-majdaah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default majdaahIbnJahjaba;

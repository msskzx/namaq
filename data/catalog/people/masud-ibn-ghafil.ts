import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const masudIbnGhafil = {
  kind: 'PERSON',
  slug: 'masud-ibn-ghafil',
  name: 'مسعود بن غافل',
  nameTransliterated: 'Masud ibn Ghafil',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'abdullah-ibn-masud', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'SON', to: 'utbah-ibn-masud-al-hudhali', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default masudIbnGhafil;

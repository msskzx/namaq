import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const anasIbnMalik = {
  kind: 'PERSON',
  slug: 'anas-ibn-malik',
  name: 'أنس بن مالك',
  nameTransliterated: 'Anas ibn Malik',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'HALF_BROTHER', inverse: 'HALF_BROTHER', to: 'al-baraa-ibn-malik', claims: ['al-baraa-ibn-malik-siyar26/half-brother'] },
  ],
} satisfies CatalogPerson;

export default anasIbnMalik;

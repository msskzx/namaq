import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const zauraIbnAbdAlAshhal = {
  kind: 'PERSON',
  slug: 'zaura-ibn-abd-al-ashhal',
  name: 'زعوراء بن عبد الأشهل',
  nameTransliterated: 'Zaura ibn Abd Al Ashhal',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'zughbah-ibn-zaura', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default zauraIbnAbdAlAshhal;

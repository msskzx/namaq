import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const alSamitIbnQaisAlKhazraji = {
  kind: 'PERSON',
  slug: 'al-samit-ibn-qais-al-khazraji',
  name: 'الصامت بن قيس',
  nameTransliterated: 'Al Samit Ibn Qais Al Khazraji',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'ubadah-ibn-al-samit', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alSamitIbnQaisAlKhazraji;

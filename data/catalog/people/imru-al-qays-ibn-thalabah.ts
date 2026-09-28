import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const imruAlQaysIbnThalabah = {
  kind: 'PERSON',
  slug: 'imru-al-qays-ibn-thalabah',
  name: 'امرؤ القيس بن ثعلبة',
  nameTransliterated: 'Imru Al Qays ibn Thalabah',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'thalabah-ibn-imri-al-qays', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default imruAlQaysIbnThalabah;

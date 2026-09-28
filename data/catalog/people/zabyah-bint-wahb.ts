import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const zabyahBintWahb = {
  kind: 'PERSON',
  slug: 'zabyah-bint-wahb',
  name: 'ظبية بنت وهب',
  nameTransliterated: 'Zabyah Bint Wahb',
  hasProfile: false,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'MOTHER', inverse: 'SON', to: 'abu-musa-al-ashari', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default zabyahBintWahb;

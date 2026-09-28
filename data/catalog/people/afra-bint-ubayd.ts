import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const afraBintUbayd = {
  kind: 'PERSON',
  slug: 'afra-bint-ubayd',
  name: 'عفراء بنت عبيد',
  nameTransliterated: 'Afra Bint Ubayd',
  hasProfile: false,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'MOTHER', inverse: 'SON', to: 'awf-ibn-al-harith', claims: legacyUnreviewed },
    { type: 'MOTHER', inverse: 'SON', to: 'muadh-ibn-al-harith', claims: legacyUnreviewed },
    { type: 'MOTHER', inverse: 'SON', to: 'muawwidh-ibn-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default afraBintUbayd;

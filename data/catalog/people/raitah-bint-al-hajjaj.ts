import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const raitahBintAlHajjaj = {
  kind: 'PERSON',
  slug: 'raitah-bint-al-hajjaj',
  name: 'رائطة بنت الحجاج',
  nameTransliterated: 'Raitah Bint Al Hajjaj',
  hasProfile: false,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'MOTHER', inverse: 'SON', to: 'abdullah-ibn-amr-ibn-al-as', claims: legacyUnreviewed },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'amr-ibn-al-as', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default raitahBintAlHajjaj;

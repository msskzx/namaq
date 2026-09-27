import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const saadIbnShahidAlAwsi = {
  kind: 'PERSON',
  slug: 'saad-ibn-shahid-al-awsi',
  name: 'سعد بن شهيد',
  nameTransliterated: 'Saad Ibn Shahid Al Awsi',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'umayr-ibn-saad-al-ansari', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default saadIbnShahidAlAwsi;

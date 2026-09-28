import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const alHarithIbnRifaahAlNajjari = {
  kind: 'PERSON',
  slug: 'al-harith-ibn-rifaah-al-najjari',
  name: 'الحارث بن رفاعة',
  nameTransliterated: 'Al Harith ibn Rifaah Al Najjari',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'awf-ibn-al-harith', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'SON', to: 'muadh-ibn-al-harith', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'SON', to: 'muawwidh-ibn-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHarithIbnRifaahAlNajjari;

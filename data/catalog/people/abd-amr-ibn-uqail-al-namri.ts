import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const abdAmrIbnUqailAlNamri = {
  kind: 'PERSON',
  slug: 'abd-amr-ibn-uqail-al-namri',
  name: 'عبد عمرو بن عقيل',
  nameTransliterated: 'Abd Amr ibn Uqail Al Namri',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'malik-ibn-abd-amr-al-namri', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdAmrIbnUqailAlNamri;

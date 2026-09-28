import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const niyarIbnAmrAlBalawi = {
  kind: 'PERSON',
  slug: 'niyar-ibn-amr-al-balawi',
  name: 'نيار بن عمرو',
  nameTransliterated: 'Niyar ibn Amr Al Balawi',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'abu-bardah-ibn-niyar', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default niyarIbnAmrAlBalawi;

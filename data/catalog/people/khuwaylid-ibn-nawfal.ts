import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const khuwaylidIbnNawfal = {
  kind: 'PERSON',
  slug: 'khuwaylid-ibn-nawfal',
  name: 'خويلد بن نوفل',
  nameTransliterated: 'Khuwaylid Ibn Nawfal',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'tulayhah-ibn-khuwaylid', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default khuwaylidIbnNawfal;

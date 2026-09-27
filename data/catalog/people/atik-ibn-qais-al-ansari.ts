import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const atikIbnQaisAlAnsari = {
  kind: 'PERSON',
  slug: 'atik-ibn-qais-al-ansari',
  name: 'عتيك بن قيس',
  nameTransliterated: 'Atik Ibn Qais Al Ansari',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'jabr-ibn-atik', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default atikIbnQaisAlAnsari;

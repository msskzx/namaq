import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const amrIbnTarif = {
  kind: 'PERSON',
  slug: 'amr-ibn-tarif',
  name: 'عمرو بن طريف',
  nameTransliterated: 'Amr Ibn Tarif',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'at-tufayl-ibn-amr-ad-dawsi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amrIbnTarif;

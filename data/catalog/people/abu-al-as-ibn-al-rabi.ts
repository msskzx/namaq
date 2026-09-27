import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abuAlAsIbnAlRabi = {
  kind: 'PERSON',
  slug: 'abu-al-as-ibn-al-rabi',
  name: 'أبو العاص بن الربيع',
  nameTransliterated: 'Abu al-As ibn al-Rabi',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-rabi-ibn-abd-al-uzza', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'zaynab-bint-muhammad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuAlAsIbnAlRabi;

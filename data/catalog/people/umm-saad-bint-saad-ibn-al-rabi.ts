import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const ummSaadBintSaadIbnAlRabi = {
  kind: 'PERSON',
  slug: 'umm-saad-bint-saad-ibn-al-rabi',
  name: 'أم سعد بنت سعد بن الربيع',
  nameTransliterated: 'Umm Saad Bint Saad Ibn Al Rabi',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'saad-ibn-al-rabi', claims: legacyUnreviewed },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'zaid-ibn-thabit', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummSaadBintSaadIbnAlRabi;

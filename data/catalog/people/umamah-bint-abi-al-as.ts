import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const umamahBintAbiAlAs = {
  kind: 'PERSON',
  slug: 'umamah-bint-abi-al-as',
  name: 'أمامة بنت أبي العاص',
  nameTransliterated: 'Umamah bint Abi al-As',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abu-al-as-ibn-al-rabi', claims: legacyUnreviewed },
    { type: 'DAUGHTER', inverse: 'MOTHER', to: 'zaynab-bint-muhammad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default umamahBintAbiAlAs;

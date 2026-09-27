import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const fatimahBintAsad = {
  kind: 'PERSON',
  slug: 'fatimah-bint-asad',
  name: 'فاطمة بنت أسد',
  nameTransliterated: 'Fatimah bint Asad',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'فاطمة بنت أسد بن هاشم بن عبد مناف بن قصي القرشية الهاشمية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'asad-ibn-hashim', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default fatimahBintAsad;

import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const maadIbnAdnan = {
  kind: 'PERSON',
  slug: 'maad-ibn-adnan',
  name: 'معد بن عدنان',
  nameTransliterated: 'Maad ibn Adnan',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'adnan', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default maadIbnAdnan;

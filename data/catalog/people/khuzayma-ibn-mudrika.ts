import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const khuzaymaIbnMudrika = {
  kind: 'PERSON',
  slug: 'khuzayma-ibn-mudrika',
  name: 'خزيمة بن مدركة',
  nameTransliterated: 'Khuzayma ibn Mudrika',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'mudrika-ibn-ilias', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default khuzaymaIbnMudrika;

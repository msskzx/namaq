import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const kinanahIbnKhuzayma = {
  kind: 'PERSON',
  slug: 'kinanah-ibn-khuzayma',
  name: 'كنانة بن خزيمة',
  nameTransliterated: 'Kinanah ibn Khuzayma',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'khuzayma-ibn-mudrika', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default kinanahIbnKhuzayma;

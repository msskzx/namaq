import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const kilabIbnMurrah = {
  kind: 'PERSON',
  slug: 'kilab-ibn-murrah',
  name: 'كلاب بن مرة',
  nameTransliterated: 'Kilab ibn Murrah',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'murrah-ibn-kaab', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default kilabIbnMurrah;

import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const murrahIbnKaab = {
  kind: 'PERSON',
  slug: 'murrah-ibn-kaab',
  name: 'مرة بن كعب',
  nameTransliterated: 'Murrah ibn Kaab',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'kaab-ibn-luay', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default murrahIbnKaab;

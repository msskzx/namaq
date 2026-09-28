import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const faharIbnMalik = {
  kind: 'PERSON',
  slug: 'fahar-ibn-malik',
  name: 'فهر بن مالك',
  nameTransliterated: 'Fahar ibn Malik',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'malik-ibn-an-nadr', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default faharIbnMalik;

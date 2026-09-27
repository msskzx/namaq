import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const kaabIbnLuay = {
  kind: 'PERSON',
  slug: 'kaab-ibn-luay',
  name: 'كعب بن لؤي',
  nameTransliterated: 'Kaab ibn Luay',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'luay-ibn-ghalib', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default kaabIbnLuay;

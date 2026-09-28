import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const abdManafIbnQusay = {
  kind: 'PERSON',
  slug: 'abd-manaf-ibn-qusay',
  name: 'عبد مناف بن قصي',
  nameTransliterated: 'Abd Manaf ibn Qusay',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'qusay-ibn-kilab', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default abdManafIbnQusay;

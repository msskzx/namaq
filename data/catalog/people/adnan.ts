import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * The terminus of the nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's sentence runs the chain to him and stops,
 * "ونسبه متصل إلى عدنان بإجماع الناس." He has no father to declare a SON
 * relation to, so the same citation backs his side of the edge to his son
 * instead.
 */
const adnan = {
  kind: 'PERSON',
  slug: 'adnan',
  name: 'عدنان',
  nameTransliterated: 'Adnan',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'maad-ibn-adnan', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default adnan;

import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const hashimIbnAbdManaf = {
  kind: 'PERSON',
  slug: 'hashim-ibn-abd-manaf',
  name: 'هاشم بن عبد مناف',
  nameTransliterated: 'Hashim ibn Abd Manaf',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-manaf-ibn-qusay', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default hashimIbnAbdManaf;

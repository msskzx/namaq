import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named in prophet-muhammad.ts's own nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage), which also cites this link to the next ancestor.
 */
const abdAlMuttalibIbnHashim = {
  kind: 'PERSON',
  slug: 'abd-al-muttalib-ibn-hashim',
  name: 'عبد المطلب بن هاشم',
  nameTransliterated: 'Abd al-Muttalib ibn Hashim',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'hashim-ibn-abd-manaf', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default abdAlMuttalibIbnHashim;

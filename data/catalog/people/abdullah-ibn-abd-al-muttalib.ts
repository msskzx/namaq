import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named in prophet-muhammad.ts's own nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage), which also cites this link to the next ancestor.
 */
const abdullahIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-abd-al-muttalib',
  name: 'عبد الله بن عبد المطلب',
  nameTransliterated: 'Abdullah ibn Abd al-Muttalib',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAbdAlMuttalib;

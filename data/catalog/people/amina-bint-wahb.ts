import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * The Prophet's mother, named on the sira's page السيرة ١/٣٢ right after his
 * lineage (data/history/batches/prophet-muhammad-sira, claim prophet/mother).
 * A graph-only person. prophet-muhammad.ts declares the edge to her son; this
 * module carries her father, named in the same line (claim aminah/father).
 */
const aminaBintWahb = {
  kind: 'PERSON',
  slug: 'amina-bint-wahb',
  name: 'آمنة بنت وهب',
  nameTransliterated: 'Aminah bint Wahb',
  hasProfile: false,
  fields: {
    sex: { value: 'FEMALE', claims: ['prophet/mother'] },
  },
  titles: [],
  relations: [
    // The same line names her father: آمنة بنت وهب بن عبد مناف بن زهرة.
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'wahb-ibn-abd-manaf-al-zuhri', claims: ['aminah/father'] },
  ],
} satisfies CatalogPerson;

export default aminaBintWahb;

import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * The Prophet's mother, named on the sira's page السيرة ١/٣٢ right after his
 * lineage (data/history/batches/prophet-muhammad-sira, claim prophet/mother).
 * A graph-only person: this module carries her son and her father, both
 * named in that one line.
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
    { type: 'MOTHER', inverse: 'SON', to: 'prophet-muhammad', claims: ['prophet/mother'] },
    // The same line names her father: آمنة بنت وهب بن عبد مناف بن زهرة.
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'wahb-ibn-abd-manaf-al-zuhri', claims: ['prophet/mother'] },
  ],
} satisfies CatalogPerson;

export default aminaBintWahb;

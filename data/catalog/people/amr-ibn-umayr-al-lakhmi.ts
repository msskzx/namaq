import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// data/history/batches/hatib-ibn-abi-baltaah, entry 9.
const amrIbnUmayrAlLakhmi = {
  kind: 'PERSON',
  slug: 'amr-ibn-umayr-al-lakhmi',
  name: 'عمرو بن عمير',
  nameTransliterated: 'Amr ibn Umayr Al Lakhmi',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'umayr-ibn-salamah-al-lakhmi',
      claims: ['hatib-ibn-abi-baltaah-siyar9/father-of-amr'],
    },
  ],
} satisfies CatalogPerson;

export default amrIbnUmayrAlLakhmi;
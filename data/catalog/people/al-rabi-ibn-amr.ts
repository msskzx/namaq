import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Seen in data/history/batches/saad-ibn-al-rabi, entry 63, as the father in
 * سعد بن الربيع بن عمرو بن أبي زهير. Nothing else about him is on record, so
 * the module stays a bare nasab link with its evidence owed nowhere else.
 */
const alRabiIbnAmr = {
  kind: 'PERSON',
  slug: 'al-rabi-ibn-amr',
  name: 'الربيع بن عمرو',
  nameTransliterated: 'Al Rabi ibn Amr',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: ['saad-ibn-al-rabi-siyar63/rabi-sex'] },
  },
  titles: [],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'amr-ibn-abi-zuhayr',
      claims: ['saad-ibn-al-rabi-siyar63/rabi-father'],
    },
  ],
} satisfies CatalogPerson;

export default alRabiIbnAmr;

import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const kinanahIbnAbiAlHuqayq = {
  kind: 'PERSON',
  slug: 'kinanah-ibn-abi-al-huqayq',
  name: 'كنانة بن أبي الحقيق',
  nameTransliterated: 'Kinanah ibn Abi al-Huqayq',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'كنانة بن أبي الحقيق',
      claims: ['safiyyah-bint-huyayy-siyar/husband-kinanah'],
    },
  },
  titles: [],
  relations: [
    {
      type: 'HUSBAND',
      inverse: 'WIFE',
      to: 'safiyyah-bint-huyayy',
      claims: ['safiyyah-bint-huyayy-siyar/husband-kinanah'],
    },
  ],
} satisfies CatalogPerson;

export default kinanahIbnAbiAlHuqayq;

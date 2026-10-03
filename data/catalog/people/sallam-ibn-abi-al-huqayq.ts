import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const sallamIbnAbiAlHuqayq = {
  kind: 'PERSON',
  slug: 'sallam-ibn-abi-al-huqayq',
  name: 'سَلاَمُ بنُ أَبِي الحُقَيْقِ',
  nameTransliterated: 'Sallam ibn Abi al-Huqayq',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'سَلاَمُ بنُ أَبِي الحُقَيْقِ',
      claims: ['safiyyah-bint-huyayy-siyar/husband-sallam'],
    },
  },
  titles: [],
  relations: [
    {
      type: 'HUSBAND',
      inverse: 'WIFE',
      to: 'safiyyah-bint-huyayy',
      claims: ['safiyyah-bint-huyayy-siyar/husband-sallam'],
    },
  ],
} satisfies CatalogPerson;

export default sallamIbnAbiAlHuqayq;

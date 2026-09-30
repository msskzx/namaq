import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const huyayyIbnAkhtab = {
  kind: 'PERSON',
  slug: 'huyayy-ibn-akhtab',
  name: 'حيي بن أخطب',
  nameTransliterated: 'Huyayy ibn Akhtab',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'حيي بن أخطب بن سعية',
      claims: ['safiyyah-bint-huyayy-siyar/father'],
    },
  },
  titles: [],
  relations: [
    {
      type: 'FATHER',
      inverse: 'DAUGHTER',
      to: 'safiyyah-bint-huyayy',
      claims: ['safiyyah-bint-huyayy-siyar/father'],
    },
  ],
} satisfies CatalogPerson;

export default huyayyIbnAkhtab;

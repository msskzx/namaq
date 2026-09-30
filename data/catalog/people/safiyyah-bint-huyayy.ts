import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const safiyyahBintHuyayy = {
  kind: 'PERSON',
  slug: 'safiyyah-bint-huyayy',
  name: 'صفية بنت حيي',
  nameTransliterated: 'Safiyyah bint Huyayy',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value:
        'صفية بنت حيي بن أخطب بن سعية، من سبط اللاوي بن نبي الله إسرائيل بن إسحاق بن إبراهيم، ومن ذرية هارون عليه السلام',
      claims: ['safiyyah-bint-huyayy-siyar/full-name'],
    },
    appearance: { value: 'كانت ذات جمال.', claims: ['safiyyah-bint-huyayy-siyar/appearance'] },
    virtues: {
      value: 'أم المؤمنين، وكانت شريفة عاقلة ذات حسب ودين، وذات حلم ووقار.',
      claims: ['safiyyah-bint-huyayy-siyar/virtues'],
    },
    deathYearHijri: { value: '50', claims: ['safiyyah-bint-huyayy-siyar/death-year-fifty'] },
  },
  titles: [
    {
      title: 'mother-of-believers',
      name: 'أم المؤمنين',
      nameTransliterated: 'Mother of the Believers',
      claims: ['safiyyah-bint-huyayy-siyar/virtues'],
    },
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['safiyyah-bint-huyayy-siyar/virtues'],
    },
  ],
  relations: [
    {
      type: 'DAUGHTER',
      inverse: 'FATHER',
      to: 'huyayy-ibn-akhtab',
      claims: ['safiyyah-bint-huyayy-siyar/father'],
    },
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'sallam-ibn-abi-al-huqayq',
      claims: ['safiyyah-bint-huyayy-siyar/husband-sallam'],
    },
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'kinanah-ibn-abi-al-huqayq',
      claims: ['safiyyah-bint-huyayy-siyar/husband-kinanah'],
    },
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'prophet-muhammad',
      claims: ['safiyyah/freedom-as-dower', 'safiyyah-bint-huyayy-siyar/marriage-prophet'],
    },
  ],
} satisfies CatalogPerson;

export default safiyyahBintHuyayy;

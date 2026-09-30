import type { CatalogPerson } from '@/lib/catalog/types';
const fatimahBintAsad = {
  kind: 'PERSON',
  slug: 'fatimah-bint-asad',
  name: 'فاطمة بنت أسد',
  nameTransliterated: 'Fatimah bint Asad',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: ['fatimah-bint-asad-siyar17/sex'] },
    fullName: {
      value: 'فاطمة بنت أسد بن هاشم بن عبد مناف بن قصي الهاشمية',
      claims: ['fatimah-bint-asad-siyar17/fullName'],
    },
    virtues: {
      value:
        'من المهاجرات الأول، وأول هاشمية ولدت هاشميا. قال النبي صلى الله عليه وسلم إنه لم يكن أحد بعد أبي طالب أبر به منها',
      claims: ['fatimah-bint-asad-siyar17/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['fatimah-bint-asad-siyar17/titles'],
    },
  ],
  relations: [
    {
      type: 'DAUGHTER',
      inverse: 'FATHER',
      to: 'asad-ibn-hashim',
      claims: ['fatimah-bint-asad-siyar17/father'],
    },
    {
      type: 'MOTHER',
      inverse: 'SON',
      to: 'ali-ibn-abi-talib',
      claims: ['fatimah-bint-asad-siyar17/mother-ali'],
    },
  ],
} satisfies CatalogPerson;

export default fatimahBintAsad;

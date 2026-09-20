import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. Chapter two gives one act: the night of the
// hijra, on the Prophet's bed while Quraysh watched the door.
const aliIbnAbiTalib = {
  kind: 'PERSON',
  slug: 'ali-ibn-abi-talib',
  name: 'علي بن أبي طالب',
  nameTransliterated: 'Ali ibn Abi Talib',
  hasProfile: true,
  fields: {
    virtues: {
      value: 'عمد علي فرقد على فراش رسول الله صلى الله عليه وسلم ليلة خروجه مهاجرا، يواري عنه العيون.',
      claims: ['ali/hijra-bed'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default aliIbnAbiTalib;

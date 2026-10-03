import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const aqilIbnAbiTalib = {
  kind: 'PERSON',
  slug: 'aqil-ibn-abi-talib',
  name: 'عقيل بن أبي طالب',
  nameTransliterated: 'Aqil ibn Abi Talib',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عقيل بن أبي طالب عبد مناف بن عبد المطلب بن هاشم بن عبد مناف بن قصي القرشي الهاشمي',
      claims: legacyUnreviewed,
    },
    kunya: { value: 'أَبَا يَزِيْدَ', claims: ['aqil-ibn-abi-talib-siyar35/kunya'] },
  },
  virtues: [
    {
      value:
        'أَنَّ رَسُوْلَ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- قَالَ لِعَقِيْلٍ: (يَا أَبَا يَزِيْدَ! إِنِّي أُحِبُّكَ حُبَّيْنِ: لِقَرَابَتِكَ، وَلِحُبِّ عَمِّي لَكَ',
      claims: ['aqil-ibn-abi-talib-siyar35/virtues'],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['aqil-ibn-abi-talib-siyar35/companion-of-prophet'],
    },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abu-talib', claims: ['aqil-ibn-abi-talib-siyar35/father'] },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'jaafar-ibn-abi-talib', claims: legacyUnreviewed },
    { type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['aqil-ibn-abi-talib-siyar35/companion-of-prophet'] },
  ],
} satisfies CatalogPerson;

export default aqilIbnAbiTalib;

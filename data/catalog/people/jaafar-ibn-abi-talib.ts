import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const jaafarIbnAbiTalib = {
  kind: 'PERSON',
  slug: 'jaafar-ibn-abi-talib',
  name: 'جعفر بن أبي طالب',
  nameTransliterated: 'Jaafar ibn Abi Talib',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value:
        'جعفر بن أبي طالب عبد مناف الهاشمي، ابن عم رسول الله صلى الله عليه وسلم: عبد مناف بن عبد المطلب بن هاشم بن عبد مناف بن قصي الهاشمي',
      claims: ['jaafar-ibn-abi-talib-siyar34/full-name'],
    },
    kunya: { value: 'أبو عبد الله', claims: ['jaafar-ibn-abi-talib-siyar34/kunya'] },
    virtues: {
      value:
        'قال له النبي صلى الله عليه وسلم: أشبه خلقك خلقي وخلقك خلقي فأنت مني ومن شجرتي، ورآه ملكا في الجنة يطير، وقال لما قدم: لأنا بقدوم جعفر أسر مني بفتح خيبر. وما احتذى النعال ولا ركب المطايا بعده أفضل من جعفر في الجود والكرم، وكانوا يسمونه أبا المساكين.',
      claims: [
        'jaafar-ibn-abi-talib-siyar34/virtues-prophet-praise',
        'jaafar-ibn-abi-talib-siyar34/virtues-generosity',
      ],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abu-talib',
      claims: ['jaafar-ibn-abi-talib-siyar34/father'],
    },
    {
      type: 'BROTHER',
      inverse: 'BROTHER',
      to: 'ali-ibn-abi-talib',
      claims: ['jaafar-ibn-abi-talib-siyar34/brother-ali'],
    },
    {
      type: 'BROTHER',
      inverse: 'BROTHER',
      to: 'aqil-ibn-abi-talib',
      claims: ['jaafar-ibn-abi-talib-siyar34/brother-aqil'],
    },
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'asma-bint-umays',
      claims: ['jaafar-ibn-abi-talib-siyar34/wife-asma'],
    },
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'abdullah-ibn-jaafar',
      claims: ['jaafar-ibn-abi-talib-siyar34/son-abdullah'],
    },
    {
      type: 'PACT_BROTHER',
      inverse: 'PACT_BROTHER',
      to: 'muadh-ibn-jabal',
      claims: ['jaafar-ibn-abi-talib-siyar34/pact-brother-muadh'],
    },
  ],
} satisfies CatalogPerson;

export default jaafarIbnAbiTalib;

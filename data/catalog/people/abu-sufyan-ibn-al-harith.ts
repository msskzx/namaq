import type { CatalogPerson } from '@/lib/catalog/types';

const abuSufyanIbnAlHarith = {
  kind: 'PERSON',
  slug: 'abu-sufyan-ibn-al-harith',
  name: 'أبو سفيان بن الحارث',
  nameTransliterated: 'Abu Sufyan ibn al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['abu-sufyan-ibn-al-harith-siyar32/sex'] },
    fullName: {
      value: 'المغيرة بن الحارث بن عبد المطلب بن هاشم الهاشمي',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/full-name'],
    },
    kunya: { value: 'أبو سفيان', claims: ['abu-sufyan-ibn-al-harith-siyar32/kunya'] },
    virtues: {
      value:
        'أحبه النبي صلى الله عليه وسلم وشهد له بالجنة وقال: أرجو أن يكون خلفا من حمزة. وكان ممن يشبه بالنبي صلى الله عليه وسلم. وقال رسول الله صلى الله عليه وسلم: أبو سفيان بن الحارث سيد فتيان أهل الجنة.',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/virtues'],
    },
    deathYearHijri: { value: '20', claims: ['abu-sufyan-ibn-al-harith-siyar32/death-year'] },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['abu-sufyan-ibn-al-harith-siyar32/companion'] },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-abd-al-muttalib', claims: ['abu-sufyan-ibn-al-harith-siyar32/father'] },
    {
      type: 'PATERNAL_COUSIN',
      inverse: 'PATERNAL_COUSIN',
      to: 'prophet-muhammad',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/cousin-of-prophet'],
    },
    {
      type: 'MILK_BROTHER',
      inverse: 'MILK_BROTHER',
      to: 'prophet-muhammad',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/milk-brother'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'nawfal-ibn-al-harith',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/half-brother-nawfal'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'rabiah-ibn-al-harith',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/half-brother-rabiah'],
    },
  ],
} satisfies CatalogPerson;

export default abuSufyanIbnAlHarith;

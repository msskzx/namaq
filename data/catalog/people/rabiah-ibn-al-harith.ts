import type { CatalogPerson } from '@/lib/catalog/types';

const rabiahIbnAlHarith = {
  kind: 'PERSON',
  slug: 'rabiah-ibn-al-harith',
  name: 'ربيعة بن الحارث',
  nameTransliterated: 'Rabiah ibn al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['rabiah-ibn-al-harith-siyar46/sex'] },
    fullName: { value: 'ربيعة بن الحارث بن عبد المطلب بن هاشم الهاشمي', claims: ['rabiah-ibn-al-harith-siyar46/full-name'] },
    kunya: { value: 'أبو أروى', claims: ['rabiah-ibn-al-harith-siyar46/kunya'] },
    virtues: {
      value:
        'قال فيه النبي صلى الله عليه وسلم: نعم العبد ربيعة بن الحارث، لو قصر من شعره، وشمر من ثوبه. وأطعمه رسول الله صلى الله عليه وسلم بخيبر مائة وسق كل سنة، وشهد معه الفتح، وحنيناً، وكان شريكا لعثمان في التجارة.',
      claims: ['rabiah-ibn-al-harith-siyar46/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['rabiah-ibn-al-harith-siyar46/companion'] },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-abd-al-muttalib', claims: ['rabiah-ibn-al-harith-siyar46/father'] },
  ],
} satisfies CatalogPerson;

export default rabiahIbnAlHarith;

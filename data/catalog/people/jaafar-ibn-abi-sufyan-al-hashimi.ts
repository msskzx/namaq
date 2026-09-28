import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const jaafarIbnAbiSufyanAlHashimi = {
  kind: 'PERSON',
  slug: 'jaafar-ibn-abi-sufyan-al-hashimi',
  name: 'جعفر بن أبي سفيان',
  nameTransliterated: 'Jaafar ibn Abi Sufyan al-Hashimi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'جعفر بن أبي سفيان المغيرة بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abu-sufyan-ibn-al-harith',
      claims: ['jaafar-ibn-abi-sufyan-al-hashimi-siyar33/father'],
    },
  ],
} satisfies CatalogPerson;

export default jaafarIbnAbiSufyanAlHashimi;

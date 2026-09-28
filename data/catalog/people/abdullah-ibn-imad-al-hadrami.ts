import type { CatalogPerson } from '@/lib/catalog/types';

const abdullahIbnImadAlHadrami = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-imad-al-hadrami',
  name: 'عبد الله بن عماد',
  nameTransliterated: 'Abdullah ibn Imad Al Hadrami',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: ['abdullah-ibn-imad-al-hadrami-siyar51/sex'] },
  },
  titles: [],
  relations: [
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'al-ala-ibn-al-hadrami',
      claims: ['al-ala-ibn-al-hadrami-siyar51/father'],
    },
  ],
} satisfies CatalogPerson;

export default abdullahIbnImadAlHadrami;

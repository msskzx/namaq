import type { CatalogPerson } from '@/lib/catalog/types';

const muawwidhIbnAmrIbnAlJumuh = {
  kind: 'PERSON',
  slug: 'muawwidh-ibn-amr-ibn-al-jumuh',
  name: 'معوذ بن عمرو',
  nameTransliterated: 'Muawwidh ibn Amr ibn al-Jumuh',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['muawwidh-ibn-amr-ibn-al-jumuh-siyar42/sex'] },
    fullName: {
      value: 'معوذ بن عمرو بن الجموح الأنصاري السلمي',
      claims: ['muawwidh-ibn-amr-ibn-al-jumuh-siyar42/full-name'],
    },
    virtues: {
      value: 'شهد بدراً مع أخويه معاذ وخلاد',
      claims: ['muawwidh-ibn-amr-ibn-al-jumuh-siyar42/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['muawwidh-ibn-amr-ibn-al-jumuh-siyar42/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'amr-ibn-al-jumuh',
      claims: ['muawwidh-ibn-amr-ibn-al-jumuh-siyar42/father'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'muadh-ibn-amr-ibn-al-jumuh',
      claims: ['muawwidh-ibn-amr-ibn-al-jumuh-siyar42/brother-muadh'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'khallad-ibn-amr-ibn-al-jumuh',
      claims: ['muawwidh-ibn-amr-ibn-al-jumuh-siyar42/brother-khallad'],
    },
  ],
} satisfies CatalogPerson;

export default muawwidhIbnAmrIbnAlJumuh;

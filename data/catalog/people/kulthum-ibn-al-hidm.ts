import type { CatalogPerson } from '@/lib/catalog/types';

const kulthumIbnAlHidm = {
  kind: 'PERSON',
  slug: 'kulthum-ibn-al-hidm',
  name: 'كلثوم بن الهدم',
  nameTransliterated: 'Kulthum ibn al-Hidm',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['kulthum-ibn-al-hidm-siyar38/sex'] },
    fullName: {
      value:
        'كلثوم بن الهدم بن امرئ القيس بن الحارث بن زيد بن عبيد بن زيد بن مالك بن عوف بن عمرو بن عوف بن مالك بن الأوس الأنصاري العوفي',
      claims: ['kulthum-ibn-al-hidm-siyar38/full-name'],
    },
    virtues: {
      value:
        'شيخ الأنصار، رجل شريف مسن أسلم قبل مقدم النبي صلى الله عليه وسلم المدينة، نزل عليه النبي أول ما قدم بقباء، وكان رجلا صالحا توفي قبل بدر',
      claims: ['kulthum-ibn-al-hidm-siyar38/virtues', 'kulthum-ibn-al-hidm-siyar38/prophet-lodging'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['kulthum-ibn-al-hidm-siyar38/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'al-hidm-ibn-imri-al-qays',
      claims: ['kulthum-ibn-al-hidm-siyar38/father'],
    },
  ],
} satisfies CatalogPerson;

export default kulthumIbnAlHidm;

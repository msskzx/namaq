import { type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/zaid-ibn-al-khattab, entry 57.
// Sibling typing follows docs/extraction-checklist.md.
const zaidIbnAlKhattab = {
  kind: 'PERSON',
  slug: 'zaid-ibn-al-khattab',
  name: 'زيد بن الخطاب',
  nameTransliterated: 'Zaid ibn al-Khattab',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['zaid-ibn-al-khattab-siyar57/sex'] },
    fullName: {
      value: 'زيد بن الخطاب بن نفيل بن عبد العزى بن رياح العدوي',
      claims: ['zaid-ibn-al-khattab-siyar57/full-name'],
    },
    kunya: { value: 'أبو عبد الرحمن', claims: ['zaid-ibn-al-khattab-siyar57/kunya'] },
    appearance: {
      value: 'كان أسمر، طويلاً جداً.',
      claims: ['zaid-ibn-al-khattab-siyar57/appearance'],
    },
    virtues: {
      value:
        'كان أسن من عمر، وأسلم قبله. وقال له عمر يوم بدر: البس درعي، فقال: إني أريد من الشهادة ما تريد، فتركاها جميعاً. وكانت راية المسلمين معه يوم اليمامة، فلم يزل يقدم بها في نحر العدو ثم قاتل حتى قتل، فأخذها سالم مولى أبي حذيفة. وحزن عليه عمر وكان يقول: أسلم قبلي، واستشهد قبلي، وما هبت الصبا إلا وأنا أجد ريح زيد.',
      claims: [
        'zaid-ibn-al-khattab-siyar57/virtues-seniority',
        'zaid-ibn-al-khattab-siyar57/virtues-badr-armor',
        'zaid-ibn-al-khattab-siyar57/virtues-yamama-banner',
        'zaid-ibn-al-khattab-siyar57/virtues-umar-grief',
      ],
    },
    deathYearHijri: { value: '12', claims: ['zaid-ibn-al-khattab-siyar57/death-year'] },
    placeOfDeathArabic: { value: 'اليمامة', claims: ['zaid-ibn-al-khattab-siyar57/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['zaid-ibn-al-khattab-siyar57/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'al-khattab-ibn-nufayl',
      claims: ['zaid-ibn-al-khattab-siyar57/father'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'umar-ibn-al-khattab',
      claims: ['zaid-ibn-al-khattab-siyar57/half-brother-umar'],
    },
    {
      type: 'PACT_BROTHER',
      inverse: 'PACT_BROTHER',
      to: 'maan-ibn-adi',
      claims: ['zaid-ibn-al-khattab-siyar57/pact-brother-maan'],
    },
  ],
} satisfies CatalogPerson;

export default zaidIbnAlKhattab;

import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const zaidIbnHarithah = {
  kind: 'PERSON',
  slug: 'zaid-ibn-harithah',
  name: 'زيد بن حارثة',
  nameTransliterated: 'Zaid ibn Harithah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value:
        'زيد بن حارثة بن شراحيل بن كعب بن عبد العزى بن يزيد بن امرئ القيس بن عامر بن النعمان الكلبي',
      claims: ['zaid-ibn-harithah-siyar36/full-name'],
    },
    kunya: { value: 'أبو أسامة', claims: ['zaid-ibn-harithah-siyar36/kunya'] },
    appearance: {
      value: 'كان قصيراً، شديد الأدمة، أفطس.',
      claims: ['zaid-ibn-harithah-siyar36/appearance'],
    },
    virtues: {
      value:
        'سيد الموالي وأسبقهم إلى الإسلام، حب رسول الله صلى الله عليه وسلم، المسمى في سورة الأحزاب؛ أول من أسلم؛ خرج أمير سبع سرايا؛ ما بعثه رسول الله في جيش قط إلا أمره عليهم، ولو بقي بعده لاستخلفه؛ وقال له: أنت مولاي ومني وإلي وأحب القوم إلي؛ واستغفر له بعد مؤتة وأخبر أنه دخل الجنة وهو يسعى، ورأى له جارية شابة في الجنة.',
      claims: ['zaid-ibn-harithah-siyar36/virtues'],
    },
    deathYearHijri: { value: '8', claims: ['zaid-ibn-harithah-siyar36/death-year'] },
    placeOfDeathArabic: { value: 'مؤتة', claims: ['zaid-ibn-harithah-siyar36/death-place'] },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'usamah-ibn-zaid',
      claims: ['zaid-ibn-harithah-siyar36/usamah-son'],
    },
  ],
} satisfies CatalogPerson;

export default zaidIbnHarithah;

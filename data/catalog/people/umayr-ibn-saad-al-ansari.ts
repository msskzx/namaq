import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// data/history/batches/umayr-ibn-saad-al-ansari, entry 12.
const umayrIbnSaadAlAnsari = {
  kind: 'PERSON',
  slug: 'umayr-ibn-saad-al-ansari',
  name: 'عمير بن سعد الأنصاري',
  nameTransliterated: 'Umayr ibn Saad al-Ansari',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عمير بن سعد بن شهيد الأنصاري الأوسي',
      claims: ['umayr-ibn-saad-al-ansari-siyar/full-name'],
    },
    virtues: {
      value:
        'الزاهد نسيج وحده، له حديث واحد؛ شهد فتح الشام وولي دمشق وحمص لعمر؛ صحب النبي صلى الله عليه وسلم ورفع إليه كلام الجلاس بن سويد وكان يتيما في حجره؛ ولي حمص بعد ابن حذيم فشارك معاوية الشام حتى قتل عمر فنزعه عثمان؛ سماه عمر نسيج وحده وبعثه على جيش؛ قال ابن عمر لابنه: ما كان رجل من الصحابة أفضل من أبيك؛ عده المفضل الغلابي في زهاد الأنصار الثلاثة.',
      claims: ['umayr-ibn-saad-al-ansari-siyar/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['umayr-ibn-saad-al-ansari-siyar/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'saad-ibn-shahid-al-awsi',
      claims: ['umayr-ibn-saad-al-ansari-siyar/father'],
    },
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'abd-al-rahman-ibn-umayr-ibn-saad',
      claims: ['umayr-ibn-saad-al-ansari-siyar/son-abd-al-rahman'],
    },
  ],
} satisfies CatalogPerson;

export default umayrIbnSaadAlAnsari;

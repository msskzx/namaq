import type { CatalogUtterance } from '@/lib/catalog/types';

/**
 * From the Satih story, which al-Dhahabi closes with هذا حديث منكر غريب. The
 * verse is recorded and so is his verdict on the report it sits in: the grading
 * is what keeps a rejected report from reading as an accepted one, which is
 * why a rejected report can be recorded at all.
 */
const abdAlMasihAsammAmYasma = {
  kind: 'UTTERANCE',
  slug: 'abd-al-masih-asamm-am-yasma',
  utteranceKind: 'POETRY',
  textArabic: {
    value: [
      'أصم أم يسمع غطريف اليمن ... أم فاد فازلم به شأو العنن',
      'يا فاصل الخطة أعيت من ومن ... أتاك شيخ الحي من آل سنن',
      'وأمه من آل ذئب بن حجن ... أزرق بهم الناب صرار الأذن',
      'أبيض فضفاض الرداء والبدن ... رسول قيل العجم يسرى للوسن',
      'يجوب في الأرض علنداة شجن ... ترفعني وجن وتهوي بي وجن',
      'لا يرهب الرعد ولا ريب الزمن ... كأنما حثحث من حضنى ثكن',
      'حتى أتى عاري الحآجي والقطن ... تلفه في الريح بوغاء الدمن'
    ].join('\n'),
    claims: ['sira/verses-abd-al-masih-asamm'],
  },
  fields: {
    speakerName: { value: 'عبد المسيح بن بقيلة الغساني', claims: ['sira/verses-abd-al-masih-asamm'] },
    grading: { value: 'هذا حديث منكر غريب', claims: ['sira/verses-abd-al-masih-asamm'] },
    occasion: {
      value: 'أنشأها لسطيح وقد أشفى على الموت، بعثه كسرى يسأله عن ارتجاس الإيوان ليلة المولد.',
      claims: ['sira/verses-abd-al-masih-asamm'],
    },
  },
} satisfies CatalogUtterance;

export default abdAlMasihAsammAmYasma;

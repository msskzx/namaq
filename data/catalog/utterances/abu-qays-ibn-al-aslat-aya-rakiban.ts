import type { CatalogUtterance } from '@/lib/catalog/types';

// An Awsi poet with Meccan in-laws, calling Quraysh to the hanifi religion and
// reminding them of the Elephant. The chapter gives it where it turns to how
// much the Aws and the Khazraj already knew.
const abuQaysIbnAlAslatAyaRakiban = {
  kind: 'UTTERANCE',
  slug: 'abu-qays-ibn-al-aslat-aya-rakiban',
  utteranceKind: 'POETRY',
  textArabic: {
    value: [
      'أيا راكبا إما عرضت فبلغن ... مغلغلة عني لؤي بن غالب',
      'رسول امرئ قد راعه ذات بينكم ... على النأي محزون بذلك ناصب',
      'أعيذكم بالله من شر صنعكم ... وشر تباغيكم ودس العقارب',
      'متى تبعثوها تبعثوها ذميمة ... هي الغول للأقصين أو للأقارب',
      'أقيموا لنا دينا حنيفا فأنتم ... لنا غاية قد نهتدي بالذوائب',
      'فقوموا فصلوا ربكم وتمسحوا ... بأركان هذا البيت بين الأخاشب',
      'فعندكم منه بلاء مصدق ... غداة أبي يكسوم هادي الكتائب',
      'فلما أتاكم نصر ذي العرش ردهم ... جنود المليك بين ساف وحاصب',
      'فولوا سراعا هاربين ولم يؤب ... إلى أهله ملجيش غير عصائب'
    ].join('\n'),
    claims: ['sira/verses-abu-qays'],
  },
  fields: {
    speakerName: { value: 'أبو قيس بن الأسلت', claims: ['sira/verses-abu-qays'] },
    occasion: { value: 'كان يحب قريشا وكان لهم صهرا يقيم بمكة السنين، فقالها.', claims: ['sira/verses-abu-qays'] },
  },
} satisfies CatalogUtterance;

export default abuQaysIbnAlAslatAyaRakiban;

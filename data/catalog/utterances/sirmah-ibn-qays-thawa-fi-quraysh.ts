import type { CatalogUtterance } from '@/lib/catalog/types';

// Ibn Abbas used to go to him for these lines, which is the whole reason the
// chapter has them: an Ansari's account of the thirteen years in Mecca and
// what Medina did about them.
const sirmahIbnQaysThawaFiQuraysh = {
  kind: 'UTTERANCE',
  slug: 'sirmah-ibn-qays-thawa-fi-quraysh',
  utteranceKind: 'POETRY',
  subject: 'prophet-muhammad',
  textArabic: {
    value: [
      'ثوى في قريش بضع عشرة حجة ... يذكر لو ألفى صديقا مواتبا',
      'ويعرض في أهل المواسم نفسه ... فلم ير من يؤوي ولم ير داعيا',
      'فلما أتانا واطمأنت به النوى ... وأصبح مسرورا بطيبة راضيا',
      'وأصبح ما يخشى ظلامه ظالم ... بعيد ولا يخشى من الناس راعيا',
      'بذلنا له الأموال من جل مالنا ... وأنفسنا عند الوغي والتآسيا',
      'نعادي الذي عادى من الناس كلهم ... جميعا وإن كان الحبيب المواسيا',
      'ونعلم أن الله لا شيء غيره ... وأن كتاب الله أصبح هاديا',
    ].join('\n'),
    claims: ['sira/verses-sirmah-ibn-qays'],
  },
  fields: {
    speakerName: { value: 'صرمة بن قيس الأنصاري', claims: ['sira/verses-sirmah-ibn-qays'] },
    occasion: { value: 'كان ابن عباس يختلف إليه ليرويها عنه.', claims: ['sira/verses-sirmah-ibn-qays'] },
  },
} satisfies CatalogUtterance;

export default sirmahIbnQaysThawaFiQuraysh;

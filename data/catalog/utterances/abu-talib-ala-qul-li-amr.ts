import type { CatalogUtterance } from '@/lib/catalog/types';

// After Quraysh offered him Umarah ibn al-Walid in exchange for his nephew and
// al-Mut'im sided with them. The poem names the men who turned away.
const abuTalibAlaQulLiAmr = {
  kind: 'UTTERANCE',
  slug: 'abu-talib-ala-qul-li-amr',
  utteranceKind: 'POETRY',
  speaker: 'abu-talib',
  textArabic: {
    value: [
      'ألا قل لعمرو والوليد ومطعم ... ألا ليت حظي من حياطتكم بكر',
      'من الخور حبحاب كثير رغاؤه ... يرش على الساقين من بوله قطر',
      'أرى أخوينا من أبينا وأمنا ... إذا سئلا قالا إلى غيرنا الأمر',
      'أخص خصوصا عبد شمس ونوفلا ... هما نبذانا مثلما ينبذ الجمر'
    ].join('\n'),
    claims: ['abu-talib/verses-ala-qul'],
  },
  fields: {
    occasion: {
      value: 'قالها حين سامته قريش أن يسلم ابن أخيه ويأخذ عمارة بن الوليد، وشهد عليه المطعم بن عدي.',
      claims: ['abu-talib/verses-ala-qul'],
    },
  },
} satisfies CatalogUtterance;

export default abuTalibAlaQulLiAmr;

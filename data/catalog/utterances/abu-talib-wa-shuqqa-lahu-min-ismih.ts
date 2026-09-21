import type { CatalogUtterance } from '@/lib/catalog/types';

// One line, and the chapter quotes it for what the Arabs said about it rather
// than for what it says: تذاكروا أحسن بيت قالته العرب.
const abuTalibWaShuqqaLahuMinIsmih = {
  kind: 'UTTERANCE',
  slug: 'abu-talib-wa-shuqqa-lahu-min-ismih',
  utteranceKind: 'POETRY',
  speaker: 'abu-talib',
  subject: 'prophet-muhammad',
  textArabic: {
    value: 'وشق له من اسمه ليجله ... فذو العرش محمود وهذا محمد',
    claims: ['abu-talib/verses-wa-shuqqa'],
  },
  fields: {
    occasion: { value: 'ذكروه حين تذاكروا أحسن بيت قالته العرب.', claims: ['abu-talib/verses-wa-shuqqa'] },
  },
} satisfies CatalogUtterance;

export default abuTalibWaShuqqaLahuMinIsmih;

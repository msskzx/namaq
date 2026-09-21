import type { CatalogUtterance } from '@/lib/catalog/types';

// His own answer to the three nights, recited to the Prophet. The chapter
// tells it as Umar drawing the story out of him years later in the Hijaz.
const sawadIbnQaribAtaniRiyyi = {
  kind: 'UTTERANCE',
  slug: 'sawad-ibn-qarib-atani-riyyi',
  utteranceKind: 'POETRY',
  subject: 'prophet-muhammad',
  textArabic: {
    value: [
      'أتاني رئي بعد ليل وهجعة ... ولم يك فيما قد بلوت بكاذب',
      'ثلاث ليال قوله كل ليلة ... أتاك نبي من لؤي بن غالب',
      'فشمرت عن ساقي الإزار ووسطت ... بي الذغلب الوجناء عند السباسب',
      'فأشهد أن الله لا شيء غيره ... وأنك مأمون على كل غائب',
      'وأنك أدنى المرسلين شفاعة ... إلى الله يابن الأكرمين الأطايب',
      'فمرنا بما يأتيك يا خير من مشى ... وإن كان فيما جاء شيب الذوائب',
      'فكن لي شفيعا يوم لا ذو شفاعة ... سواك بمغن عن سواد بن قارب',
    ].join('\n'),
    claims: ['sira/verses-sawad-ibn-qarib'],
  },
  fields: {
    speakerName: { value: 'سواد بن قارب', claims: ['sira/verses-sawad-ibn-qarib'] },
    occasion: { value: 'أنشدها النبي صلى الله عليه وسلم بعد أن أتاه رئيه ثلاث ليال.', claims: ['sira/verses-sawad-ibn-qarib'] },
  },
} satisfies CatalogUtterance;

export default sawadIbnQaribAtaniRiyyi;

import type { CatalogUtterance } from '@/lib/catalog/types';

// Night 3 of three. The chapter prints the three as three poems with the
// same opening and a different rhyme each time, so they are three records and
// not one: joining them would invent a poem it did not print.
const raiSawadIbnQaribThalithah = {
  kind: 'UTTERANCE',
  slug: 'rai-sawad-ibn-qarib-thalithah',
  utteranceKind: 'POETRY',
  textArabic: {
    value: [
      'عجبت للجن وتخبارها ... وشدها العيس بأكوارها',
      'تهوي إلى مكة تبغي الهدى ... ليس ذوو الشر كأخيارها',
      'فانهض إلى الصفوة من هاشم ... ما مؤمنو الجن ككفارها',
    ].join('\n'),
    claims: ['sira/verses-rai-sawad-thalithah'],
  },
  fields: {
    speakerName: { value: 'رئي سواد بن قارب من الجن', claims: ['sira/verses-rai-sawad-thalithah'] },
    occasion: { value: 'أتاه فأنبهه في الليلة الثالثة.', claims: ['sira/verses-rai-sawad-thalithah'] },
  },
} satisfies CatalogUtterance;

export default raiSawadIbnQaribThalithah;

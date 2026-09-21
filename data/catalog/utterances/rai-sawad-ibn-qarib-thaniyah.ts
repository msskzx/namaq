import type { CatalogUtterance } from '@/lib/catalog/types';

// Night 2 of three. The chapter prints the three as three poems with the
// same opening and a different rhyme each time, so they are three records and
// not one: joining them would invent a poem it did not print.
const raiSawadIbnQaribThaniyah = {
  kind: 'UTTERANCE',
  slug: 'rai-sawad-ibn-qarib-thaniyah',
  utteranceKind: 'POETRY',
  textArabic: {
    value: [
      'عجبت للجن وتطلابها ... وشدها العيس بأقتابها',
      'تهوي إلى مكة تبغي الهدى ... ليس قداماها كأذنابها',
      'فانهض إلى الصفوة من هاشم ... واسم بعينيك إلى نابها',
    ].join('\n'),
    claims: ['sira/verses-rai-sawad-thaniyah'],
  },
  fields: {
    speakerName: { value: 'رئي سواد بن قارب من الجن', claims: ['sira/verses-rai-sawad-thaniyah'] },
    occasion: { value: 'أتاه فأنبهه في الليلة الثانية.', claims: ['sira/verses-rai-sawad-thaniyah'] },
  },
} satisfies CatalogUtterance;

export default raiSawadIbnQaribThaniyah;

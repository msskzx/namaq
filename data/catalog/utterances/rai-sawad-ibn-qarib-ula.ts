import type { CatalogUtterance } from '@/lib/catalog/types';

// Night 1 of three. The chapter prints the three as three poems with the
// same opening and a different rhyme each time, so they are three records and
// not one: joining them would invent a poem it did not print.
const raiSawadIbnQaribUla = {
  kind: 'UTTERANCE',
  slug: 'rai-sawad-ibn-qarib-ula',
  utteranceKind: 'POETRY',
  textArabic: {
    value: [
      'عجبت للجن وأنجاسها ... وشدها العيس بأحلاسا',
      'تهوي إلى مكة تبغي الهدى ... ما مؤمنوها مثل أرجاسها',
      'فانهض إلى الصفوة من هاشم ... وآسم بعينيك إلى راسها',
    ].join('\n'),
    claims: ['sira/verses-rai-sawad-ula'],
  },
  fields: {
    speakerName: { value: 'رئي سواد بن قارب من الجن', claims: ['sira/verses-rai-sawad-ula'] },
    occasion: { value: 'أتاه في منامه فقال: قم فافهم واعقل، قد بعث رسول من لؤي بن غالب.', claims: ['sira/verses-rai-sawad-ula'] },
  },
} satisfies CatalogUtterance;

export default raiSawadIbnQaribUla;

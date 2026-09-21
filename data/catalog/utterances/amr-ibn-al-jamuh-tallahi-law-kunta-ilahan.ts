import type { CatalogUtterance } from '@/lib/catalog/types';

// Said to his own idol. The young men of Banu Salamah had been throwing it
// into a pit night after night; the last time they tied a dead dog to it, and
// he gave up on it in verse.
const amrIbnAlJamuhTallahiLawKuntaIlahan = {
  kind: 'UTTERANCE',
  slug: 'amr-ibn-al-jamuh-tallahi-law-kunta-ilahan',
  utteranceKind: 'POETRY',
  textArabic: {
    value: [
      'تالله لو كنت إلها لم تكن ... أنت وكلب وسط بئر في قرن',
      'أف لمصرعك إلا مستدن ... الآن فتشناك عن سوء الغبن',
      'الحمد لله العلي ذي المنن ... الواهب الرزق وديان الدين',
      'هو الذي أنقذني من قبل أن ... أكون في ظلمة قبر مرتهن',
    ].join('\n'),
    claims: ['sira/verses-amr-ibn-al-jamuh'],
  },
  fields: {
    speakerName: { value: 'عمرو بن الجموح', claims: ['sira/verses-amr-ibn-al-jamuh'] },
    occasion: { value: 'قالها لصنمه مناف بعد أن وجده في البئر مقرونا بكلب ميت.', claims: ['sira/verses-amr-ibn-al-jamuh'] },
  },
} satisfies CatalogUtterance;

export default amrIbnAlJamuhTallahiLawKuntaIlahan;

import type { CatalogUtterance } from '@/lib/catalog/types';

// A prisoner of Badr let go on a promise not to fight again, calling Kinanah
// out for Uhud in the same breath. The chapter gives the poem where it
// narrates him breaking his word.
const abuAzzahAyhanBaniAbdManat = {
  kind: 'UTTERANCE',
  slug: 'abu-azzah-ayhan-bani-abd-manat',
  utteranceKind: 'POETRY',
  battle: 'uhud',
  textArabic: {
    value: [
      'إيهًا بني عبد مناة الرزام ... أنتم حماة وأبوكم حام',
      'لا تعدوني نصركم بعد العام ... لا تسلموني لا يحل إسلام',
    ].join('\n'),
    claims: ['sira/verses-abu-azzah'],
  },
  fields: {
    speakerName: { value: 'أبو عزة الجمحي', claims: ['sira/verses-abu-azzah'] },
    occasion: { value: 'خرج يسير في تهامة يدعو بني كنانة إلى قتال النبي صلى الله عليه وسلم.', claims: ['sira/verses-abu-azzah'] },
  },
} satisfies CatalogUtterance;

export default abuAzzahAyhanBaniAbdManat;

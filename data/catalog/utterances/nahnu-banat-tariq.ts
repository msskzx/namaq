import type { CatalogUtterance } from '@/lib/catalog/types';

// Sung by the women behind the Meccan line at Uhud. The chapter says فيهن
// امرأة وهي تقول and never names her, so the speaker is what it calls her.
const nahnuBanatTariq = {
  kind: 'UTTERANCE',
  slug: 'nahnu-banat-tariq',
  utteranceKind: 'POETRY',
  battle: 'uhud',
  textArabic: {
    value: ['نحن بنات طارق ... نمشي على النمارق', 'إن تقبلوا نعانق ... أو تدبروا نفارق', 'فراق غير وامق'].join('\n'),
    claims: ['sira/verses-banat-tariq'],
  },
  fields: {
    speakerName: { value: 'امرأة من نسوة قريش يوم أحد', claims: ['sira/verses-banat-tariq'] },
    occasion: { value: 'قالتها في نسوة معهن دفوف في سفح الجبل يوم أحد.', claims: ['sira/verses-banat-tariq'] },
  },
} satisfies CatalogUtterance;

export default nahnuBanatTariq;

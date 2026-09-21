import type { CatalogUtterance } from '@/lib/catalog/types';

// Hind bint Utbah from the rock after the mutilation of the dead. She has no
// subject in the app, so the name stays text, the way Ma'bad's does.
const hindNahnuJazaynakum = {
  kind: 'UTTERANCE',
  slug: 'hind-nahnu-jazaynakum',
  utteranceKind: 'POETRY',
  battle: 'uhud',
  textArabic: {
    value: [
      'نحن جزيناكم بيوم بدر ... والحرب بعد الحرب ذات سعر',
      'ما كان عن عتبة لي من صبر ... ولا أخي وعمه وبكري',
    ].join('\n'),
    claims: ['sira/verses-jazaynakum'],
  },
  fields: {
    speakerName: { value: 'هند بنت عتبة', claims: ['sira/verses-jazaynakum'] },
    occasion: { value: 'صرخت بها بأعلى صوتها على صخرة مشرفة يوم أحد.', claims: ['sira/verses-jazaynakum'] },
  },
} satisfies CatalogUtterance;

export default hindNahnuJazaynakum;

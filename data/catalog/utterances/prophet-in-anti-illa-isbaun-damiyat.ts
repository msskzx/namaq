import type { CatalogUtterance } from '@/lib/catalog/types';

// Rajaz, in the cave, to Abu Bakr, whose hand a stone had cut. Two lines, and
// the chapter gives them without any framing at all.
const prophetInAntiIllaIsbaunDamiyat = {
  kind: 'UTTERANCE',
  slug: 'prophet-in-anti-illa-isbaun-damiyat',
  utteranceKind: 'POETRY',
  speaker: 'prophet-muhammad',
  event: 'hijra-to-medina',
  textArabic: { value: 'إن أنت إلا إصبع دميت ... وفي سبيل الله ما لقيت', claims: ['prophet/verses-isba-damiyat'] },
  fields: {
    occasion: { value: 'قاله لأبي بكر في الغار وقد أصاب يده حجر.', claims: ['prophet/verses-isba-damiyat'] },
  },
} satisfies CatalogUtterance;

export default prophetInAntiIllaIsbaunDamiyat;

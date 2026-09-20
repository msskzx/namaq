import type { CatalogEvent } from '@/lib/catalog/types';

// After Abu Talib died and Quraysh closed in. Undated in the chapter.
const journeyToTaif = {
  kind: 'EVENT',
  slug: 'journey-to-taif',
  name: 'خروجه إلى الطائف',
  nameTransliterated: 'The Journey to Ta’if',
  type: 'TRAVEL',
  fields: {
    location: { value: 'الطائف', claims: ['sira/taif'] },
    description: {
      value:
        'عمد إلى ثقيف بالطائف يرجو أن يؤووه، فرده سادتهم وتهزؤوا به وأقعدوا له صفين يرضخون رجليه بالحجارة، فعرض عليه ملك الجبال أن يطبق عليهم الأخشبين، فقال: بل أرجو أن يخرج الله من أصلابهم من يعبد الله لا يشرك به شيئا.',
      claims: ['sira/taif'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/taif'] }],
} satisfies CatalogEvent;

export default journeyToTaif;

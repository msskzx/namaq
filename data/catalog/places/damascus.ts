import type { CatalogPlace } from '@/lib/catalog/types';

const damascus = {
  kind: 'PLACE',
  slug: 'damascus',
  name: 'دمشق',
  at: [36.29128, 33.5102],
  books: [
    { source: 'yaqut-buldan', volume: 2, page: 463, shamela: 993, text: 'البلدة المشهورة قصبة الشام' },
  ],
  geonames: [170654],
} satisfies CatalogPlace;

export default damascus;

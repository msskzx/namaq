import type { CatalogPlace } from '@/lib/catalog/types';

const yarmuk = {
  kind: 'PLACE',
  slug: 'yarmuk',
  name: 'اليرموك',
  at: [36.00969, 32.7449],
  books: [
    { source: 'yaqut-buldan', volume: 5, page: 434, shamela: 2467, text: 'يرموك: واد بناحية الشام في طرف الغور يصب في نهر الأردن' },
  ],
  geonames: [12210767],
} satisfies CatalogPlace;

export default yarmuk;

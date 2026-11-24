import type { CatalogPlace } from '@/lib/catalog/types';

const ctesiphon = {
  kind: 'PLACE',
  slug: 'ctesiphon',
  name: 'المدائن',
  at: [44.58333, 33.08333],
  books: [
    { source: 'yaqut-buldan', volume: 5, page: 75, shamela: 2108, text: 'قال حمزة: اسم المدائن بالفارسية توسفون وعربوه على الطيسفون' },
  ],
  geonames: [90287],
} satisfies CatalogPlace;

export default ctesiphon;

import type { CatalogPlace } from '@/lib/catalog/types';

const oldBasra = {
  kind: 'PLACE',
  slug: 'old-basra',
  name: 'البصرة القديمة',
  at: [47.70175, 30.39213],
  books: [
    { source: 'yaqut-buldan', volume: 2, page: 363, shamela: 893, text: 'وعندها كانت وقعة الجمل' },
    { source: 'lughat-al-arab', volume: 6, page: 199, shamela: 3073, text: 'فهذه في البصرة القديمة ومكانها اليوم بلدة الزبير.' },
  ],
  geonames: [98245],
} satisfies CatalogPlace;

export default oldBasra;

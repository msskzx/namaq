import type { CatalogPlace } from '@/lib/catalog/types';

const fihl = {
  kind: 'PLACE',
  slug: 'fihl',
  name: 'فحل',
  at: [35.60898, 32.45103],
  books: [
    { source: 'yaqut-buldan', volume: 4, page: 237, shamela: 1774, text: 'اسم موضع بالشام كانت فيه وقعة للمسلمين مع الروم' },
    { source: 'yaqut-buldan', volume: 4, page: 237, shamela: 1774, text: 'وكان يوم فحل يسمى يوم الردغة أيضا ويوم بيسان' },
  ],
  geonames: [246636],
} satisfies CatalogPlace;

export default fihl;

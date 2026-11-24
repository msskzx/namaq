import type { CatalogPlace } from '@/lib/catalog/types';

const cyprus = {
  kind: 'PLACE',
  slug: 'cyprus',
  name: 'قبرص',
  at: [33, 35],
  books: [
    { source: 'yaqut-buldan', volume: 4, page: 305, shamela: 1842, text: 'وهي جزيرة في بحر الروم' },
  ],
  geonames: [146669],
} satisfies CatalogPlace;

export default cyprus;

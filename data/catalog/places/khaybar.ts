import type { CatalogPlace } from '@/lib/catalog/types';

const khaybar = {
  kind: 'PLACE',
  slug: 'khaybar',
  name: 'خيبر',
  at: [39.28031, 25.71344],
  books: [
    { source: 'biladi-maalim', page: 118, shamela: 99, text: 'ويبعد عن المدينة (١٦٥) كيلا شمالا على طريق الشام' },
  ],
  geonames: [104979],
} satisfies CatalogPlace;

export default khaybar;

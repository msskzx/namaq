import type { CatalogPlace } from '@/lib/catalog/types';

const badr = {
  kind: 'PLACE',
  slug: 'badr',
  name: 'بدر',
  at: [38.79047, 23.78292],
  books: [
    { source: 'biladi-maalim', page: 41, shamela: 36, text: 'وهي اليوم بلدة بأسفل وادي الصفراء، تبعد عن المدينة (١٥٥) كيلا' },
  ],
  geonames: [107744],
} satisfies CatalogPlace;

export default badr;

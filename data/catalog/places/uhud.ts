import type { CatalogPlace } from '@/lib/catalog/types';

const uhud = {
  kind: 'PLACE',
  slug: 'uhud',
  name: 'أحد',
  at: [39.62685, 24.52097],
  books: [
    { source: 'biladi-maalim', page: 19, shamela: 17, text: 'وهو من أشهر جبال العرب، يشرف على المدينة من الشمال' },
  ],
  geonames: [101215],
} satisfies CatalogPlace;

export default uhud;

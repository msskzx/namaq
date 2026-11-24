import type { CatalogPlace } from '@/lib/catalog/types';

const madinah = {
  kind: 'PLACE',
  slug: 'madinah',
  name: 'المدينة',
  at: [39.61417, 24.46861],
  books: [
    { source: 'biladi-maalim', page: 190, shamela: 148, text: 'طيبة، هي مدينة رسول الله ﷺ' },
  ],
  geonames: [109223],
} satisfies CatalogPlace;

export default madinah;

import type { CatalogPlace } from '@/lib/catalog/types';

const makkah = {
  kind: 'PLACE',
  slug: 'makkah',
  name: 'مكة',
  at: [39.82563, 21.42664],
  books: [
    { source: 'biladi-maalim', page: 301, shamela: 236, text: 'هي مكة المكرمة، وهي الحرم الآمن، وأم القرى' },
  ],
  geonames: [104515],
} satisfies CatalogPlace;

export default makkah;

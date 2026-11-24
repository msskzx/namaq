import type { CatalogPlace } from '@/lib/catalog/types';

// al-Biladi gives a distance only («جبل أحمر جنوب المدينة على (٢٠) كيلا»): the pin is 20 km due south of GeoNames'
// al-Madinah.
const hamraAlAsad = {
  kind: 'PLACE',
  slug: 'hamra-al-asad',
  name: 'حمراء الأسد',
  at: [39.61417, 24.28875],
  books: [
    { source: 'biladi-maalim', page: 105, shamela: 88, text: 'وحمراء الأسد: جبل أحمر جنوب المدينة على (٢٠) كيلا' },
  ],
  geonames: [109223],
} satisfies CatalogPlace;

export default hamraAlAsad;

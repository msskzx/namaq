import type { CatalogPlace } from '@/lib/catalog/types';

const tabuk = {
  kind: 'PLACE',
  slug: 'tabuk',
  name: 'تبوك',
  at: [36.57151, 28.3998],
  books: [
    { source: 'biladi-maalim', page: 59, shamela: 51, text: 'وقد أصبحت اليوم مدينة من مدن شمال الحجاز الرئيسية' },
  ],
  geonames: [101628],
} satisfies CatalogPlace;

export default tabuk;

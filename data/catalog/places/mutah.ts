import type { CatalogPlace } from '@/lib/catalog/types';

const mutah = {
  kind: 'PLACE',
  slug: 'mutah',
  name: 'مؤتة',
  at: [35.69444, 31.0925],
  books: [
    { source: 'biladi-maalim', page: 304, shamela: 239, text: 'مؤتة: بلدة أردنية، تقع جنوب الكرك غير بعيدة منها' },
  ],
  geonames: [247809],
} satisfies CatalogPlace;

export default mutah;

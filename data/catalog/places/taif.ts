import type { CatalogPlace } from '@/lib/catalog/types';

const taif = {
  kind: 'PLACE',
  slug: 'taif',
  name: 'الطائف',
  at: [40.41583, 21.27028],
  books: [
    { source: 'shurrab-maalim', page: 170, shamela: 157, text: 'الطائف: مدينة غنية عن التعريف، تقع شرق مكة مع ميل قليل إلى الجنوب، على مسافة تسعة وتسعين كيلا' },
  ],
  geonames: [107968],
} satisfies CatalogPlace;

export default taif;

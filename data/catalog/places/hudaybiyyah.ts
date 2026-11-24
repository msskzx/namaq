import type { CatalogPlace } from '@/lib/catalog/types';

const hudaybiyyah = {
  kind: 'PLACE',
  slug: 'hudaybiyyah',
  name: 'الحديبية',
  at: [39.61822, 21.34915],
  books: [
    { source: 'biladi-maalim', page: 94, shamela: 77, text: 'الحديبية على (٢٢) كيلا غرب مكة على طريق جدة القديم' },
    { source: 'biladi-maalim', page: 106, shamela: 89, text: 'فالحديبية بئر يعرف اليوم موقعها بالشميسي' },
  ],
  geonames: [108201],
} satisfies CatalogPlace;

export default hudaybiyyah;

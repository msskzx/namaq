import type { CatalogPlace } from '@/lib/catalog/types';

const hunayn = {
  kind: 'PLACE',
  slug: 'hunayn',
  name: 'حنين',
  at: [40.06353, 21.51615],
  books: [
    { source: 'biladi-maalim', page: 107, shamela: 90, text: 'وهو واد من أودية مكة، يقع شرقها بقرابة ثلاثين كيلا، يسمى اليوم وادي الشرائع' },
  ],
  geonames: [108246],
} satisfies CatalogPlace;

export default hunayn;

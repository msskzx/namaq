import type { CatalogPlace } from '@/lib/catalog/types';

const nakhlah = {
  kind: 'PLACE',
  slug: 'nakhlah',
  name: 'نخلة',
  at: [40.1028, 21.61709],
  books: [
    { source: 'biladi-maalim', page: 317, shamela: 249, text: 'والمقصود في هذه الرواية نخلة اليمانية، لأنها على الطريق القديم بين مكة والطائف' },
  ],
  geonames: [100427],
} satisfies CatalogPlace;

export default nakhlah;

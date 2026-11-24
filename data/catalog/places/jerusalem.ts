import type { CatalogPlace } from '@/lib/catalog/types';

const jerusalem = {
  kind: 'PLACE',
  slug: 'jerusalem',
  name: 'بيت المقدس',
  at: [35.21633, 31.76904],
  books: [
    { source: 'biladi-maalim', page: 292, shamela: 227, text: 'المسجد الأقصى ما زال معروفا وما زال يسمى بيت المقدس، والقدس' },
  ],
  geonames: [281184],
} satisfies CatalogPlace;

export default jerusalem;

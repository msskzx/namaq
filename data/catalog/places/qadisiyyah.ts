import type { CatalogPlace } from '@/lib/catalog/types';

const qadisiyyah = {
  kind: 'PLACE',
  slug: 'qadisiyyah',
  name: 'القادسية',
  at: [44.43333, 31.58333],
  books: [
    { source: 'yaqut-buldan', volume: 4, page: 291, shamela: 1828, text: 'وبهذا الموضع كان يوم القادسية بين سعد ابن ابي وقاص والمسلمين والفرس' },
  ],
  geonames: [99021],
} satisfies CatalogPlace;

export default qadisiyyah;

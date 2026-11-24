import type { CatalogPlace } from '@/lib/catalog/types';

const nahavand = {
  kind: 'PLACE',
  slug: 'nahavand',
  name: 'نهاوند',
  at: [48.37446, 34.19088],
  books: [
    { source: 'yaqut-buldan', volume: 5, page: 313, shamela: 2346, text: 'هي مدينة عظيمة في قبلة همذان بينهما ثلاثة أيام' },
  ],
  geonames: [122915],
} satisfies CatalogPlace;

export default nahavand;

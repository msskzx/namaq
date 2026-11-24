import type { CatalogPlace } from '@/lib/catalog/types';

const alexandria = {
  kind: 'PLACE',
  slug: 'alexandria',
  name: 'الإسكندرية',
  at: [29.91582, 31.20176],
  books: [
    { source: 'yaqut-buldan', volume: 1, page: 188, shamela: 183, text: 'وفتحت الإسكندرية سنة عشرين من الهجرة في أيام عمر بن الخطاب' },
  ],
  geonames: [361058],
} satisfies CatalogPlace;

export default alexandria;

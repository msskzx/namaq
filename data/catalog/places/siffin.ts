import type { CatalogPlace } from '@/lib/catalog/types';

// Yaqut gives a stretch only («بين الرقة وبالس»): the pin is halfway between GeoNames' al-Raqqa and Balis.
const siffin = {
  kind: 'PLACE',
  slug: 'siffin',
  name: 'صفين',
  at: [38.55963, 35.96984],
  books: [
    { source: 'yaqut-buldan', volume: 3, page: 414, shamela: 1488, text: 'وهو موضع بقرب الرقة على شاطئ الفرات من الجانب الغربي بين الرقة وبالس' },
  ],
  geonames: [172955, 171885],
} satisfies CatalogPlace;

export default siffin;

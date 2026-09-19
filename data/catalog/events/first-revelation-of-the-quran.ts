import type { CatalogEvent } from '@/lib/catalog/types';

// Name, type and year stay the seed's. The chapter places the revelation in
// Ramadan at Hira and dates it by his age, forty, rather than by a year.
const firstRevelationOfTheQuran = {
  kind: 'EVENT',
  slug: 'first-revelation-of-the-quran',
  name: 'نزول الوحي الأول',
  nameTransliterated: 'The First Revelation of the Quran',
  type: 'OTHER',
  fields: {
    description: {
      value:
        'كان يجاور بحراء من كل سنة شهرا، فلما كان الشهر الذي أراد الله كرامته فيه، وهو رمضان، جاءه الملك فقال: اقرأ. فقال: ما أنا بقارئ. حتى أنزل عليه: اقرأ باسم ربك الذي خلق.',
      claims: ['prophet/first-revelation', 'prophet/first-revelation-ramadan'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['prophet/first-revelation'] }],
} satisfies CatalogEvent;

export default firstRevelationOfTheQuran;

import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Two narrations of one conversion, and they differ on who led him in: Ibn
 * Abbas has Ali meet him at Zamzam, Abd Allah ibn al-Samit has him find the
 * Prophet himself. The model records one description, so it keeps what both
 * agree on -- the concealment he refused -- and leaves the difference on the
 * page.
 */
const islamOfAbuDharr = {
  kind: 'EVENT',
  slug: 'islam-of-abu-dharr',
  name: 'إسلام أبي ذر الغفاري',
  nameTransliterated: 'The Islam of Abu Dharr al-Ghifari',
  type: 'OTHER',
  fields: {
    location: { value: 'مكة', claims: ['abu-dharr/islam'] },
    description: {
      value:
        'أسلم أبو ذر فقال له النبي صلى الله عليه وسلم: اكتم إسلامك وارجع إلى قومك. فقال: والله لأصرخن بها بين أظهرهم، فجاء المسجد فنادى بالشهادة، فضرب حتى كاد يموت، فأدركه العباس فأكب عليه.',
      claims: ['abu-dharr/islam'],
    },
  },
  people: [
    { person: 'abu-dharr-al-ghifari', claims: ['abu-dharr/islam'] },
    { person: 'prophet-muhammad', claims: ['abu-dharr/islam'] },
  ],
} satisfies CatalogEvent;

export default islamOfAbuDharr;

import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In Umm Salamah's house the Prophet ﷺ heard an effeminate man describing Ghaylan's daughter to Abd Allah ibn Abi Umayyah
 * for when al-Ta'if fell, and said «لا يدخلن هؤلاء عليكن». Told from Sahih al-Bukhari 4324 (al-Maghazi, the raid of
 * al-Ta'if), whole, with its notes that his name was Hit and that it was during the siege. Hit and Abd Allah ibn Abi Umayyah
 * have no catalog subject and are not linked.
 */
const theMukhannathInUmmSalamahsHouse = {
  kind: 'EVENT',
  slug: 'the-mukhannath-in-umm-salamahs-house',
  name: "المخنث في بيت أم سلمة",
  nameTransliterated: "The mukhannath in Umm Salamah's house",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'umm-salamah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4324, 0, 161),
      source: { slug: 'sahih-al-bukhari', hadith: 4324, url: 'https://sunnah.com/bukhari:4324' },
      moments: [
        { title: "«فعليك بابنة غيلان»", text: sahih('bukhari', 4324, 162, 424), people: ['prophet-muhammad', 'umm-salamah'] },
        { title: "«لا يدخلن هؤلاء عليكن»", text: sahih('bukhari', 4324, 425, 678), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMukhannathInUmmSalamahsHouse;

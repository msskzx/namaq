import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A man on hajj asked Ibn Umar whether Uthman fled at Uhud, missed Badr and missed the pledge of al-Ridwan, and said «الله
 * أكبر»; Ibn Umar answered each: Allah pardoned him, he stayed by the Prophet's sick daughter with a share of Badr, and he
 * was in Makkah on the Prophet's errand, whose right hand stood for his. Told from Sahih al-Bukhari 4066 (al-Maghazi, the
 * chapter on «إن الذين تولوا منكم يوم التقى الجمعان»), whole. Ibn Umar has no catalog subject and is not linked; nor is the
 * Prophet's daughter, unnamed here.
 */
const ibnUmarAnswersAboutUthman = {
  kind: 'EVENT',
  slug: 'ibn-umar-answers-about-uthman',
  name: "ابن عمر يجيب عن عثمان",
  nameTransliterated: "Ibn Umar answers about Uthman",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'uthman-ibn-affan' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4066, 0, 85),
      source: { slug: 'sahih-al-bukhari', hadith: 4066, url: 'https://sunnah.com/bukhari:4066' },
      moments: [
        { title: "«أتعلم أن عثمان بن عفان فر يوم أحد؟»", text: sahih('bukhari', 4066, 86, 633), people: ['uthman-ibn-affan'] },
        { title: "«أما فراره يوم أحد، فأشهد أن الله عفا عنه»", text: sahih('bukhari', 4066, 634, 979), people: ['uthman-ibn-affan', 'prophet-muhammad'] },
        { title: "«هذه يد عثمان»", text: sahih('bukhari', 4066, 980, 1378), people: ['uthman-ibn-affan', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ibnUmarAnswersAboutUthman;

import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Bakr rode in from al-Sunh, went to Aisha's room, uncovered the Prophet's face, kissed him weeping and said «والله لا
 * يجمع الله عليك موتتين»; then he came out while Umar was speaking, told him to sit, and said «من كان منكم يعبد محمدا ﷺ
 * فإن محمدا قد مات، ومن كان منكم يعبد الله فإن الله حي لا يموت», reciting «وما محمد إلا رسول قد خلت من قبله الرسل», and
 * Umar's legs gave way under him. Told from Sahih al-Bukhari (al-Maghazi, the illness and death of the Prophet ﷺ), each
 * whole: Aisha's 4452 first; then 4454, al-Zuhri's next chain, Ibn Abbas's telling of the speech with Sa'id ibn
 * al-Musayyab's report of Umar (our copy has no 4453); then 4455, the kiss in one line.
 */
const abuBakrOnTheDayOfHisDeath = {
  kind: 'EVENT',
  slug: 'abu-bakr-on-the-day-of-his-death',
  name: "أبو بكر يوم وفاة النبي ﷺ",
  nameTransliterated: "Abu Bakr on the day of his death",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-bakr-as-siddiq' }, { person: 'aisha-bint-abi-bakr' }, { person: 'prophet-muhammad' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['HIS_WORDS'],
  ayat: [
    {
      kind: 'RECITED',
      from: '3:144',
      to: '3:144',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4454, url: 'https://sunnah.com/bukhari:4454', quote: sahih('bukhari', 4454, 426, 537) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4452, 0, 155),
      source: { slug: 'sahih-al-bukhari', hadith: 4452, url: 'https://sunnah.com/bukhari:4452' },
      moments: [
        { title: "أكب عليه فقبله وبكى", text: sahih('bukhari', 4452, 156, 462), people: ['abu-bakr-as-siddiq', 'aisha-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "«لا يجمع الله عليك موتتين»", text: sahih('bukhari', 4452, 463, 613), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4454, 0, 81),
      source: { slug: 'sahih-al-bukhari', hadith: 4454, url: 'https://sunnah.com/bukhari:4454' },
      moments: [
        { title: "«اجلس يا عمر»", text: sahih('bukhari', 4454, 82, 244), people: ['abu-bakr-as-siddiq', 'umar-ibn-al-khattab'] },
        { title: "«فإن محمدا قد مات»", text: sahih('bukhari', 4454, 245, 754), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "«حتى ما تقلني رجلاي»", text: sahih('bukhari', 4454, 755, 1015), people: ['umar-ibn-al-khattab', 'abu-bakr-as-siddiq'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4455, 0, 213),
      source: { slug: 'sahih-al-bukhari', hadith: 4455, url: 'https://sunnah.com/bukhari:4455' },
      moments: [
        { title: "قبله بعد موته", text: sahih('bukhari', 4455, 214, 285), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuBakrOnTheDayOfHisDeath;

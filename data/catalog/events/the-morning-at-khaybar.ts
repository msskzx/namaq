import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ came to Khaybar by night and waited for morning; when the people came out with their spades and baskets and
 * saw him they cried «محمد والخميس», and he said «الله أكبر، خربت خيبر، إنا إذا نزلنا بساحة قوم فساء صباح المنذرين».
 * Told from Sahih al-Bukhari (al-Maghazi, the chapter on Khaybar), each hadith whole: Anas's 4200 first, the fullest, with
 * Safiyyah among the captives; then 4198, with the call against the donkeys' meat; then 4197, from its own chain (the
 * route printed before it, Qutaybah's «نشأ بها», is the end of 4196).
 */
const theMorningAtKhaybar = {
  kind: 'EVENT',
  slug: 'the-morning-at-khaybar',
  name: "صباح خيبر",
  nameTransliterated: "The morning at Khaybar",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'safiyyah-bint-huyayy' }, { person: 'dihyah-al-kalbi' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4200, 0, 115),
      source: { slug: 'sahih-al-bukhari', hadith: 4200, url: 'https://sunnah.com/bukhari:4200' },
      moments: [
        { title: "«خربت خيبر»", text: sahih('bukhari', 4200, 116, 298), people: ['prophet-muhammad'] },
        { title: "فجعل عتقها صداقها", text: sahih('bukhari', 4200, 299, 690), people: ['prophet-muhammad', 'safiyyah-bint-huyayy', 'dihyah-al-kalbi'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4198, 0, 163),
      source: { slug: 'sahih-al-bukhari', hadith: 4198, url: 'https://sunnah.com/bukhari:4198' },
      moments: [
        { title: "«محمد والخميس»", text: sahih('bukhari', 4198, 164, 312), people: ['prophet-muhammad'] },
        { title: "«خربت خيبر»", text: sahih('bukhari', 4198, 313, 440), people: ['prophet-muhammad'] },
        { title: "«إن الله ورسوله ينهيانكم عن لحوم الحمر»", text: sahih('bukhari', 4198, 441, 592), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4197, 0, 111),
      source: { slug: 'sahih-al-bukhari', hadith: 4197, url: 'https://sunnah.com/bukhari:4197' },
      moments: [
        { title: "لم يغر بهم حتى يصبح", text: sahih('bukhari', 4197, 112, 371), people: ['prophet-muhammad'] },
        { title: "«خربت خيبر»", text: sahih('bukhari', 4197, 372, 485), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMorningAtKhaybar;

import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * An ifrit of the jinn sprang at the Prophet ﷺ in the night to cut off his prayer; Allah gave him power over it, and he
 * meant to tie it to a pillar of the mosque, then remembered the du'a of his brother Sulayman (Sad 35, which he gives in
 * part, in his own telling) and it was driven back (al-Dhahabi: «متفق عليه», al-Sira 1 p162). Told from Sahih al-Bukhari,
 * each hadith whole: 3423 (the Prophets), 461 (the Prayer) and 1210 (action in the prayer), which has al-Dhahabi's other
 * wording «فذعته» and calls it الشيطان. 3423 ends with a gloss on the word عفريت that follows the hadith in al-Bukhari's
 * text, and 1210 with al-Nadr ibn Shumayl's note on «فذعته». 4808 (Tafsir, Sad) is word for word 461, and 3284 is the
 * same chain cut short, so neither is repeated. The du'a is quoted, not recited, so the story carries no ayat range.
 */
const theIfritInThePrayer = {
  kind: 'EVENT',
  slug: 'the-ifrit-in-the-prayer',
  name: 'عفريت يتفلّت عليه في صلاته',
  nameTransliterated: 'The ifrit in the prayer',
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3423, 0, 157),
      source: { slug: 'sahih-al-bukhari', hadith: 3423, url: 'https://sunnah.com/bukhari:3423' },
      moments: [
        { title: '«تفلّت البارحة ليقطع علي صلاتي»', text: sahih('bukhari', 3423, 158, 240), people: ['prophet-muhammad'] },
        { title: '«فأمكنني الله منه»', text: sahih('bukhari', 3423, 241, 386), people: ['prophet-muhammad'] },
        { title: '«فذكرت دعوة أخي سليمان»', text: sahih('bukhari', 3423, 387, 507), people: ['prophet-muhammad'] },
        { title: 'في معنى العفريت', text: sahih('bukhari', 3423, 508, 600), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 461, 0, 176),
      source: { slug: 'sahih-al-bukhari', hadith: 461, url: 'https://sunnah.com/bukhari:461' },
      moments: [
        { title: '«تفلّت علي البارحة»', text: sahih('bukhari', 461, 177, 301), people: ['prophet-muhammad'] },
        { title: '«فأمكنني الله منه»', text: sahih('bukhari', 461, 302, 450), people: ['prophet-muhammad'] },
        { title: '«فذكرت قول أخي سليمان»', text: sahih('bukhari', 461, 451, 546), people: ['prophet-muhammad'] },
        { title: 'قول روح: فرده خاسئا', text: sahih('bukhari', 461, 547, 581), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 1210, 0, 149),
      source: { slug: 'sahih-al-bukhari', hadith: 1210, url: 'https://sunnah.com/bukhari:1210' },
      moments: [
        { title: '«إن الشيطان عرض لي»', text: sahih('bukhari', 1210, 150, 259), people: ['prophet-muhammad'] },
        { title: '«فأمكنني الله منه فذعته»', text: sahih('bukhari', 1210, 260, 389), people: ['prophet-muhammad'] },
        { title: '«فذكرت قول سليمان»', text: sahih('bukhari', 1210, 390, 520), people: ['prophet-muhammad'] },
        { title: 'قول النضر بن شميل في «فذعته»', text: sahih('bukhari', 1210, 521, 761), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theIfritInThePrayer;

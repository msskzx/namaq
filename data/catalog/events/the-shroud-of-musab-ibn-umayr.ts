import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Khabbab: they emigrated with the Prophet ﷺ seeking the face of Allah, and some died having taken none of their reward,
 * among them Mus'ab ibn Umayr, killed at Uhud, who left only a namirah too short to cover him; the Prophet ﷺ had them
 * cover his head and put idhkhir on his feet. Told from Sahih al-Bukhari, each hadith whole, as its chapter on the hijra
 * (Manaqib al-Ansar) gives them: 3914 first, the fuller, then 3897. 3913 is only the opening of 3914's double chain
 * («هاجرنا مع رسول الله ﷺ») and is not repeated. Then 4047 and 4082, the same hadith in the chapters on
 * Uhud (al-Maghazi), each whole, folded.
 */
const theShroudOfMusabIbnUmayr = {
  kind: 'EVENT',
  slug: 'the-shroud-of-musab-ibn-umayr',
  name: "كفن مصعب بن عمير",
  nameTransliterated: "The shroud of Mus'ab ibn Umayr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'khabbab-ibn-al-aratt' }, { person: 'prophet-muhammad' }, { person: 'musab-ibn-umayr' }],
  reports: [
    {
      isnad: sahih('bukhari', 3914, 0, 132),
      source: { slug: 'sahih-al-bukhari', hadith: 3914, url: 'https://sunnah.com/bukhari:3914' },
      moments: [
        { title: "«لم يأكل من أجره شيئا»", text: sahih('bukhari', 3914, 133, 278), people: ['khabbab-ibn-al-aratt', 'prophet-muhammad'] },
        { title: "لم نجد إلا نمرة", text: sahih('bukhari', 3914, 279, 598), people: ['musab-ibn-umayr', 'prophet-muhammad'] },
        { title: "«ومنا من أينعت له ثمرته»", text: sahih('bukhari', 3914, 599, 660), people: ['khabbab-ibn-al-aratt'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3897, 0, 110),
      source: { slug: 'sahih-al-bukhari', hadith: 3897, url: 'https://sunnah.com/bukhari:3897' },
      moments: [
        { title: "«نريد وجه الله»", text: sahih('bukhari', 3897, 111, 279), people: ['khabbab-ibn-al-aratt', 'prophet-muhammad'] },
        { title: "إذا غطينا بها رأسه بدت رجلاه", text: sahih('bukhari', 3897, 280, 562), people: ['musab-ibn-umayr', 'prophet-muhammad'] },
        { title: "«ومنا من أينعت له ثمرته»", text: sahih('bukhari', 3897, 563, 624), people: ['khabbab-ibn-al-aratt'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4047, 0, 127),
      source: { slug: 'sahih-al-bukhari', hadith: 4047, url: 'https://sunnah.com/bukhari:4047' },
      moments: [
        {
          title: "«لم يأكل من أجره شيئا»",
          text: sahih('bukhari', 4047, 128, 287),
          people: ['khabbab-ibn-al-aratt', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4047, 128, 287) },
          ],
        },
        {
          title: "«غطوا بها رأسه»",
          text: sahih('bukhari', 4047, 288, 631),
          people: ['musab-ibn-umayr', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4047, 288, 487) },
            { text: sahih('bukhari', 4047, 488, 631), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 4047, 488, 515) },
          ],
        },
        {
          title: "«ومنا من أينعت له ثمرته»",
          text: sahih('bukhari', 4047, 632, 699),
          people: ['khabbab-ibn-al-aratt'],
          turns: [
            { text: sahih('bukhari', 4047, 632, 699) },
          ],
        },
      ],
    },
    {
      isnad: sahih('bukhari', 4082, 0, 127),
      source: { slug: 'sahih-al-bukhari', hadith: 4082, url: 'https://sunnah.com/bukhari:4082' },
      moments: [
        {
          title: "«لم يأكل من أجره شيئا»",
          text: sahih('bukhari', 4082, 128, 293),
          people: ['khabbab-ibn-al-aratt', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4082, 128, 293) },
          ],
        },
        {
          title: "«غطوا بها رأسه»",
          text: sahih('bukhari', 4082, 294, 644),
          people: ['musab-ibn-umayr', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4082, 294, 496) },
            { text: sahih('bukhari', 4082, 497, 644), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 4082, 497, 524) },
          ],
        },
        {
          title: "«ومنا من أينعت له ثمرته»",
          text: sahih('bukhari', 4082, 645, 706),
          people: ['khabbab-ibn-al-aratt'],
          turns: [
            { text: sahih('bukhari', 4082, 645, 706) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theShroudOfMusabIbnUmayr;

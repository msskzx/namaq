import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Khaybar Abu Hurayrah told the Prophet ﷺ that Aban ibn Sa'id was the killer of Ibn Qawqal, and Aban answered him
 * «واعجبا لك، وبر تدأدأ من قدوم ضأن، ينعى علي امرأ أكرمه الله بيدي». Told from Sahih al-Bukhari (al-Maghazi, the chapter on
 * Khaybar), each hadith whole: 4239 first, which names Aban; then 4237, whole, folded, whose «فقال» is Aban, as 4239 names
 * him. 4238, which al-Bukhari gives with «ويذكر عن الزبيدي», is left out. Ibn Qawqal has no catalog subject and is not
 * linked.
 */
const abanAndAbuHurayrah = {
  kind: 'EVENT',
  slug: 'aban-and-abu-hurayrah',
  name: "أبان بن سعيد وأبو هريرة",
  nameTransliterated: "Aban ibn Sa'id and Abu Hurayrah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'aban-ibn-said' }, { person: 'prophet-muhammad' }, { person: 'abu-hurayrah' }],
  reports: [
    {
      isnad: sahih('bukhari', 4239, 0, 108),
      source: { slug: 'sahih-al-bukhari', hadith: 4239, url: 'https://sunnah.com/bukhari:4239' },
      moments: [
        {
          title: "«هذا قاتل ابن قوقل»",
          text: sahih('bukhari', 4239, 109, 259),
          people: ['aban-ibn-said', 'prophet-muhammad', 'abu-hurayrah'],
          turns: [
            { text: sahih('bukhari', 4239, 109, 184) },
            { text: sahih('bukhari', 4239, 185, 259), speaker: { person: "abu-hurayrah", name: "أبو هريرة" }, lead: sahih('bukhari', 4239, 185, 210) },
          ],
        },
        {
          title: "«ينعى علي امرأ أكرمه الله بيدي»",
          text: sahih('bukhari', 4239, 260, 439),
          people: ['aban-ibn-said', 'abu-hurayrah'],
          turns: [
            { text: sahih('bukhari', 4239, 260, 439), speaker: { person: "aban-ibn-said", name: "أبان" }, lead: sahih('bukhari', 4239, 260, 295) },
          ],
        },
      ],
    },
    {
      isnad: sahih('bukhari', 4237, 0, 172),
      source: { slug: 'sahih-al-bukhari', hadith: 4237, url: 'https://sunnah.com/bukhari:4237' },
      moments: [
        {
          title: "«لا تعطه»",
          text: sahih('bukhari', 4237, 173, 301),
          people: ['abu-hurayrah', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4237, 173, 240) },
            { text: sahih('bukhari', 4237, 241, 301), speaker: { name: "بعض بني سعيد بن العاص" }, lead: sahih('bukhari', 4237, 241, 287) },
          ],
        },
        {
          title: "«هذا قاتل ابن قوقل»",
          text: sahih('bukhari', 4237, 302, 423),
          people: ['abu-hurayrah', 'aban-ibn-said'],
          turns: [
            { text: sahih('bukhari', 4237, 302, 357), speaker: { person: "abu-hurayrah", name: "أبو هريرة" }, lead: sahih('bukhari', 4237, 302, 327) },
            { text: sahih('bukhari', 4237, 358, 423) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abanAndAbuHurayrah;

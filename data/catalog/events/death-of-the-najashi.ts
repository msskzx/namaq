import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ announced the Najashi's death on the day he died, «مات اليوم رجل صالح», called him their brother Ashamah,
 * lined them up at the musalla and prayed over him with four takbirs. Told from Sahih al-Bukhari, each hadith whole, as
 * its chapter on the Najashi's death (Manaqib al-Ansar) gives them: Jabir's 3877 first for his words, then Abu Hurayrah's 3880 and
 * 3881 (al-Bukhari's own continuation of the chain «وعن صالح»), then Jabir's 3878 and 3879.
 */
const deathOfTheNajashi = {
  kind: 'EVENT',
  slug: 'death-of-the-najashi',
  name: "موت النجاشي والصلاة عليه",
  nameTransliterated: "The death of the Najashi and the prayer over him",
  type: 'DEATH',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'an-najashi' }, { person: 'jabir-ibn-abdullah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3877, 0, 120),
      source: { slug: 'sahih-al-bukhari', hadith: 3877, url: 'https://sunnah.com/bukhari:3877' },
      moments: [
        {
          title: "«مات اليوم رجل صالح»",
          text: sahih('bukhari', 3877, 121, 248),
          people: ['prophet-muhammad', 'an-najashi'],
          turns: [
            { text: sahih('bukhari', 3877, 121, 248), speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: sahih('bukhari', 3877, 121, 167) },
          ],
        },
      ],
    },
    {
      isnad: sahih('bukhari', 3880, 0, 254),
      source: { slug: 'sahih-al-bukhari', hadith: 3880, url: 'https://sunnah.com/bukhari:3880' },
      moments: [
        { title: "نعاه في اليوم الذي مات فيه", text: sahih('bukhari', 3880, 255, 361), people: ['prophet-muhammad', 'an-najashi'] },
        { title: "«استغفروا لأخيكم»", text: sahih('bukhari', 3880, 362, 398), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3881, 0, 130),
      source: { slug: 'sahih-al-bukhari', hadith: 3881, url: 'https://sunnah.com/bukhari:3881' },
      moments: [
        { title: "صفّ بهم في المصلى", text: sahih('bukhari', 3881, 131, 224), people: ['prophet-muhammad', 'an-najashi'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3878, 0, 210),
      source: { slug: 'sahih-al-bukhari', hadith: 3878, url: 'https://sunnah.com/bukhari:3878' },
      moments: [
        { title: "في الصف الثاني أو الثالث", text: sahih('bukhari', 3878, 211, 333), people: ['prophet-muhammad', 'an-najashi', 'jabir-ibn-abdullah'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3879, 0, 174),
      source: { slug: 'sahih-al-bukhari', hadith: 3879, url: 'https://sunnah.com/bukhari:3879' },
      moments: [
        { title: "كبّر عليه أربعا", text: sahih('bukhari', 3879, 175, 292), people: ['prophet-muhammad', 'an-najashi'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default deathOfTheNajashi;

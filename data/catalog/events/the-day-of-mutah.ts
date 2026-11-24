import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ put Zayd ibn Harithah over the army of Mu'tah, then Ja'far if Zayd fell, then Abd Allah ibn Rawahah; all
 * three fell, Ja'far with more than ninety wounds, none in his back, and the Prophet ﷺ gave the news in Medina before it
 * came, his eyes streaming, «حتى أخذ الراية سيف من سيوف الله». Told from Sahih al-Bukhari (al-Maghazi, the chapter on
 * Mu'tah), each hadith whole: Ibn Umar's 4261 first; then Anas's 4262, Ibn Umar's 4260 and Khalid's own 4265 and 4266
 * (nine swords broke in his hand). The «سيف من سيوف الله» is not named in 4262 and is not linked from it.
 * 4263 (the women of Ja'far) and 4267–4268 (Ibn Rawahah's fainting) are their own events; 4264 is a one-line greeting.
 */
const theDayOfMutah = {
  kind: 'EVENT',
  slug: 'the-day-of-mutah',
  name: "يوم مؤتة",
  nameTransliterated: "The day of Mu'tah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'zaid-ibn-harithah' }, { person: 'jaafar-ibn-abi-talib' }, { person: 'abdullah-ibn-rawahah' }, { person: 'khalid-ibn-al-walid' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4261, 0, 183),
      source: { slug: 'sahih-al-bukhari', hadith: 4261, url: 'https://sunnah.com/bukhari:4261' },
      moments: [
        {
          title: "«إن قتل زيد فجعفر»",
          text: sahih('bukhari', 4261, 184, 363),
          people: ['prophet-muhammad', 'zaid-ibn-harithah', 'jaafar-ibn-abi-talib', 'abdullah-ibn-rawahah'],
          turns: [
            { text: sahih('bukhari', 4261, 184, 253) },
            { text: sahih('bukhari', 4261, 254, 363), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4261, 254, 278) },
          ],
        },
        {
          title: "وجدناه في القتلى",
          text: sahih('bukhari', 4261, 364, 573),
          people: ['jaafar-ibn-abi-talib'],
          turns: [
            { text: sahih('bukhari', 4261, 364, 573) },
          ],
        },
      ],
    },
    {
      isnad: sahih('bukhari', 4262, 0, 136),
      source: { slug: 'sahih-al-bukhari', hadith: 4262, url: 'https://sunnah.com/bukhari:4262' },
      moments: [
        { title: "نعاهم قبل أن يأتي خبرهم", text: sahih('bukhari', 4262, 137, 365), people: ['prophet-muhammad', 'zaid-ibn-harithah', 'jaafar-ibn-abi-talib', 'abdullah-ibn-rawahah'] },
        { title: "«حتى أخذ الراية سيف من سيوف الله»", text: sahih('bukhari', 4262, 366, 475), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4260, 0, 145),
      source: { slug: 'sahih-al-bukhari', hadith: 4260, url: 'https://sunnah.com/bukhari:4260' },
      moments: [
        { title: "خمسون بين طعنة وضربة", text: sahih('bukhari', 4260, 146, 318), people: ['jaafar-ibn-abi-talib'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4265, 0, 147),
      source: { slug: 'sahih-al-bukhari', hadith: 4265, url: 'https://sunnah.com/bukhari:4265' },
      moments: [
        { title: "تسعة أسياف", text: sahih('bukhari', 4265, 148, 267), people: ['khalid-ibn-al-walid'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4266, 0, 150),
      source: { slug: 'sahih-al-bukhari', hadith: 4266, url: 'https://sunnah.com/bukhari:4266' },
      moments: [
        { title: "تسعة أسياف", text: sahih('bukhari', 4266, 151, 259), people: ['khalid-ibn-al-walid'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDayOfMutah;

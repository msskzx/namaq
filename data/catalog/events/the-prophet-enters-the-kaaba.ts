import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In the year of the conquest the Prophet ﷺ rode in with Usamah behind him, had Uthman ibn Talhah bring the key and went
 * into the House with Usamah, Bilal and Uthman, staying a long while; Ibn Umar, first in after them, asked Bilal where he had
 * prayed. Ibn Abbas tells that he would not enter while the gods were in it, had them brought out, among them images of
 * Ibrahim and Isma'il holding divining arrows («قاتلهم الله»), then said takbir in its corners and came out without
 * praying in it. The two do not agree on the prayer and both are kept whole. Told from Sahih al-Bukhari, each hadith whole:
 * Ibn Umar's 4400 first (al-Maghazi, the farewell hajj, though it says «عام الفتح»), the fullest; then 4289, given by
 * al-Bukhari with «وقال الليث»; then Ibn Abbas's 4288.
 */
const theProphetEntersTheKaaba = {
  kind: 'EVENT',
  slug: 'the-prophet-enters-the-kaaba',
  name: "دخوله ﷺ الكعبة عام الفتح",
  nameTransliterated: "The Prophet enters the Ka'bah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'usamah-ibn-zaid' }, { person: 'bilal-ibn-rabah' }, { person: 'uthman-ibn-talhah' }],
  reports: [
    {
      isnad: sahih('bukhari', 4400, 0, 136),
      source: { slug: 'sahih-al-bukhari', hadith: 4400, url: 'https://sunnah.com/bukhari:4400' },
      moments: [
        { title: "«ائتنا بالمفتاح»", text: sahih('bukhari', 4400, 137, 494), people: ['prophet-muhammad', 'usamah-ibn-zaid', 'bilal-ibn-rabah', 'uthman-ibn-talhah'] },
        { title: "سأل بلالا أين صلى", text: sahih('bukhari', 4400, 495, 1113), people: ['bilal-ibn-rabah', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4289, 0, 108),
      source: { slug: 'sahih-al-bukhari', hadith: 4289, url: 'https://sunnah.com/bukhari:4289' },
      moments: [
        { title: "أمره أن يأتي بمفتاح البيت", text: sahih('bukhari', 4289, 109, 498), people: ['prophet-muhammad', 'usamah-ibn-zaid', 'bilal-ibn-rabah', 'uthman-ibn-talhah'] },
        { title: "سأل بلالا أين صلى", text: sahih('bukhari', 4289, 499, 796), people: ['bilal-ibn-rabah', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4288, 0, 149),
      source: { slug: 'sahih-al-bukhari', hadith: 4288, url: 'https://sunnah.com/bukhari:4288' },
      moments: [
        {
          title: "«قاتلهم الله»",
          text: sahih('bukhari', 4288, 150, 445),
          people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4288, 150, 357) },
            { text: sahih('bukhari', 4288, 358, 445), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 4288, 358, 379) },
          ],
        },
        {
          title: "كبر في نواحي البيت",
          text: sahih('bukhari', 4288, 446, 644),
          people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4288, 446, 644) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theProphetEntersTheKaaba;

import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Ansar gave the Prophet ﷺ palms until he took Qurayzah and al-Nadir; Anas's people sent him to ask for theirs back,
 * but the Prophet ﷺ had given them to Umm Ayman, who put her cloth round Anas's neck and refused, «كلا والذي لا إله إلا
 * هو», until he gave her about ten times as much. Told from Sahih al-Bukhari 4120 (al-Maghazi, the chapter on Banu
 * Qurayzah), whole.
 *
 * Then Anas's hadith in Sahih Muslim 1771 (al-Jihad, the muhajirun returning the Ansar's gifts), whole: Umm Sulaym's palms
 * given to Umm Ayman and given back after Khaybar, with al-Zuhri's note on Umm Ayman's life. Abd Allah ibn Abd al-Muttalib
 * is named in the note only as her first master and is not linked.
 */
const ummAymanAndThePalms = {
  kind: 'EVENT',
  slug: 'umm-ayman-and-the-palms',
  name: "أم أيمن والنخلات",
  nameTransliterated: "Umm Ayman and the palms",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'anas-ibn-malik' }, { person: 'umm-ayman' }, { person: 'umm-sulaym-al-ghumaysa' }, { person: 'amina-bint-wahb' }, { person: 'zaid-ibn-harithah' }],
  reports: [
    {
      isnad: sahih('bukhari', 4120, 0, 159),
      source: { slug: 'sahih-al-bukhari', hadith: 4120, url: 'https://sunnah.com/bukhari:4120' },
      moments: [
        { title: "يجعل للنبي ﷺ النخلات", text: sahih('bukhari', 4120, 160, 415), people: ['prophet-muhammad', 'anas-ibn-malik'] },
        { title: "«كلا والذي لا إله إلا هو»", text: sahih('bukhari', 4120, 416, 727), people: ['umm-ayman', 'prophet-muhammad', 'anas-ibn-malik'] },
      ],
    },
    {
      isnad: sahih('muslim', 1771, 0, 125),
      source: { slug: 'sahih-muslim', hadith: 1771, url: 'https://sunnah.com/muslim:1771' },
      moments: [
        { title: "قاسمهم الأنصار", text: sahih('muslim', 1771, 126, 678), people: ['umm-sulaym-al-ghumaysa', 'prophet-muhammad', 'umm-ayman'] },
        { title: "رد المهاجرون إلى الأنصار منائحهم", text: sahih('muslim', 1771, 679, 1053), people: ['prophet-muhammad', 'umm-sulaym-al-ghumaysa', 'umm-ayman'] },
        { title: "من شأن أم أيمن", text: sahih('muslim', 1771, 1054, 1508), people: ['umm-ayman', 'amina-bint-wahb', 'prophet-muhammad', 'zaid-ibn-harithah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ummAymanAndThePalms;

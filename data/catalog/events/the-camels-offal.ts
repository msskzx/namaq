import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * While the Prophet ﷺ was prostrating with men of Quraysh around him, Uqbah ibn Abi Mu'ayt threw a camel's offal on his
 * back; Fatimah took it off and prayed against whoever did it, and he prayed against the chiefs of Quraysh by name. Ibn
 * Mas'ud saw them killed at Badr. Told from Sahih al-Bukhari 3854 (Manaqib al-Ansar), whole. Of those named in the du'a,
 * Shaybah ibn Rabi'ah and Ubayy ibn Khalaf have no catalog subject and are not linked; Umayyah is linked though Shu'bah
 * doubts whether it was Umayyah or Ubayy, as the text says, because al-Bukhari settles it himself after Shu'bah's doubt
 * in 2934: «وَقَالَ شُعْبَةُ: أُمَيَّةُ أَوْ أُبَيٌّ وَالصَّحِيحُ أُمَيَّةُ». Then 3960 (al-Maghazi, the chapter on the du'a against
 * Shaybah, Utbah, al-Walid and Abu Jahl), the same hadith by another route, whole, folded; al-Walid ibn Utbah has no
 * catalog subject and is not linked.
 * Then Ibn Mas'ud's telling in Sahih Muslim 1794 (al-Jihad, the chapter on what the Prophet ﷺ met from the mushrikun),
 * whole, folded, naming Abu Jahl as the one who asked for it; Shaybah and al-Walid ibn Uqbah (whom Abu Ishaq calls a slip)
 * are not linked.
 */
const theCamelsOffal = {
  kind: 'EVENT',
  slug: 'the-camels-offal',
  name: "سلى الجزور على ظهره ﷺ",
  nameTransliterated: "The camel's offal on his back",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'uqba-ibn-abi-muayt' }, { person: 'fatimah-bint-muhammad' }, { person: 'abu-jahl-ibn-hisham' }, { person: 'utbah-ibn-rabiah' }, { person: 'umayyah-ibn-khalaf' }, { person: 'abdullah-ibn-masud' }],
  reports: [
    {
      isnad: sahih('bukhari', 3854, 0, 160),
      source: { slug: 'sahih-al-bukhari', hadith: 3854, url: 'https://sunnah.com/bukhari:3854' },
      moments: [
        {
          title: "سلى الجزور على ظهره",
          text: sahih('bukhari', 3854, 161, 346),
          people: ['prophet-muhammad', 'uqba-ibn-abi-muayt'],
          turns: [
            { text: sahih('bukhari', 3854, 161, 346) },
          ],
        },
        {
          title: "فاطمة تأخذه عن ظهره",
          text: sahih('bukhari', 3854, 347, 434),
          people: ['fatimah-bint-muhammad', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 3854, 347, 434) },
          ],
        },
        {
          title: "«اللهم عليك الملأ من قريش»",
          text: sahih('bukhari', 3854, 435, 651),
          people: ['prophet-muhammad', 'abu-jahl-ibn-hisham', 'utbah-ibn-rabiah', 'umayyah-ibn-khalaf'],
          turns: [
            { text: sahih('bukhari', 3854, 435, 651), speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: sahih('bukhari', 3854, 435, 456) },
          ],
        },
        {
          title: "قُتلوا يوم بدر",
          text: sahih('bukhari', 3854, 652, 798),
          people: ['abdullah-ibn-masud'],
          turns: [
            { text: sahih('bukhari', 3854, 652, 798) },
          ],
        },
      ],
    },
    {
      isnad: sahih('bukhari', 3960, 0, 164),
      source: { slug: 'sahih-al-bukhari', hadith: 3960, url: 'https://sunnah.com/bukhari:3960' },
      moments: [
        { title: "دعا على نفر من قريش", text: sahih('bukhari', 3960, 165, 353), people: ['prophet-muhammad', 'utbah-ibn-rabiah', 'abu-jahl-ibn-hisham'] },
        { title: "«لقد رأيتهم صرعى»", text: sahih('bukhari', 3960, 354, 458), people: ['abdullah-ibn-masud'] },
      ],
    },
    {
      isnad: sahih('muslim', 1794, 0, 248),
      source: { slug: 'sahih-muslim', hadith: 1794, url: 'https://sunnah.com/muslim:1794' },
      moments: [
        { title: "«أيكم يقوم إلى سلا جزور بني فلان»", text: sahih('muslim', 1794, 249, 789), people: ['prophet-muhammad', 'abu-jahl-ibn-hisham'] },
        { title: "فطرحته عنه", text: sahih('muslim', 1794, 790, 933), people: ['fatimah-bint-muhammad', 'prophet-muhammad'] },
        { title: "«اللهم عليك بقريش»", text: sahih('muslim', 1794, 934, 1453), people: ['prophet-muhammad', 'abu-jahl-ibn-hisham', 'utbah-ibn-rabiah', 'umayyah-ibn-khalaf', 'uqba-ibn-abi-muayt'] },
        { title: "«لقد رأيت الذين سمى صرعى يوم بدر»", text: sahih('muslim', 1794, 1454, 1669), people: ['abdullah-ibn-masud'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theCamelsOffal;

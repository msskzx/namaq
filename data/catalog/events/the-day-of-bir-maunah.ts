import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent seventy men, called the readers, among them Anas's uncle Haram ibn Milhan; Amir ibn al-Tufayl's
 * people, Ri'l, Dhakwan and Usayyah, killed them at Bi'r Ma'unah, Haram crying «فزت ورب الكعبة» as the spear went through
 * him, and the Prophet ﷺ prayed against them for a month in the dawn prayer. Told from Sahih al-Bukhari (al-Maghazi, the
 * chapter on al-Raji', Ri'l, Dhakwan and Bi'r Ma'unah), each hadith whole: Anas's 4091 first, the fullest; then 4088, 4090,
 * 4096, 4095 and 4092; then Aisha's 4093, which al-Bukhari files here though its first half is the hijra, for its end:
 * Amir ibn Fuhayrah, killed that day, was raised to the sky. The words «بلغوا عنا قومنا…» were recited Quran that was
 * later lifted («ثم كان من المنسوخ»), so no ayah range is given. 4089 and 4094 are the qunut alone (one line each). Haram,
 * Amir ibn al-Tufayl, Amir ibn Fuhayrah, al-Mundhir ibn Amr and Urwah ibn Asma have no catalog subject and are not
 * linked; neither is Umm Sulaym, named only as his sister.
 */
const theDayOfBirMaunah = {
  kind: 'EVENT',
  slug: 'the-day-of-bir-maunah',
  name: "يوم بئر معونة",
  nameTransliterated: "The day of Bi'r Ma'unah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'amr-ibn-umayyah-al-damri' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4091, 0, 136),
      source: { slug: 'sahih-al-bukhari', hadith: 4091, url: 'https://sunnah.com/bukhari:4091' },
      moments: [
        { title: "بعث خاله في سبعين راكبا", text: sahih('bukhari', 4091, 137, 450), people: ['prophet-muhammad'] },
        { title: "«غدة كغدة البكر»", text: sahih('bukhari', 4091, 451, 622), people: [] },
        { title: "«فزت ورب الكعبة»", text: sahih('bukhari', 4091, 623, 1084), people: ['prophet-muhammad'] },
        { title: "«إنا قد لقينا ربنا فرضي عنا وأرضانا»", text: sahih('bukhari', 4091, 1085, 1288), people: [] },
        { title: "دعا عليهم ثلاثين صباحا", text: sahih('bukhari', 4091, 1289, 1437), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4088, 0, 119),
      source: { slug: 'sahih-al-bukhari', hadith: 4088, url: 'https://sunnah.com/bukhari:4088' },
      moments: [
        { title: "سبعون يقال لهم القراء", text: sahih('bukhari', 4088, 120, 433), people: ['prophet-muhammad'] },
        { title: "وذلك بدء القنوت", text: sahih('bukhari', 4088, 434, 727), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4090, 0, 153),
      source: { slug: 'sahih-al-bukhari', hadith: 4090, url: 'https://sunnah.com/bukhari:4090' },
      moments: [
        { title: "استمدوه على عدو", text: sahih('bukhari', 4090, 154, 476), people: ['prophet-muhammad'] },
        { title: "فقنت شهرا", text: sahih('bukhari', 4090, 477, 636), people: ['prophet-muhammad'] },
        { title: "«بلغوا عنا قومنا»", text: sahih('bukhari', 4090, 637, 790), people: [] },
        { title: "قنت شهرا في صلاة الصبح", text: sahih('bukhari', 4090, 791, 1211), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4096, 0, 104),
      source: { slug: 'sahih-al-bukhari', hadith: 4096, url: 'https://sunnah.com/bukhari:4096' },
      moments: [
        { title: "سأل أنسا عن القنوت", text: sahih('bukhari', 4096, 105, 346), people: [] },
        { title: "بعث ناسا يقال لهم القراء", text: sahih('bukhari', 4096, 347, 728), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4095, 0, 139),
      source: { slug: 'sahih-al-bukhari', hadith: 4095, url: 'https://sunnah.com/bukhari:4095' },
      moments: [
        { title: "دعا عليهم ثلاثين صباحا", text: sahih('bukhari', 4095, 140, 324), people: ['prophet-muhammad'] },
        { title: "«بلغوا قومنا فقد لقينا ربنا»", text: sahih('bukhari', 4095, 325, 552), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4092, 0, 184),
      source: { slug: 'sahih-al-bukhari', hadith: 4092, url: 'https://sunnah.com/bukhari:4092' },
      moments: [
        { title: "«فزت ورب الكعبة»", text: sahih('bukhari', 4092, 185, 370), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 4093, 0, 133),
      source: { slug: 'sahih-al-bukhari', hadith: 4093, url: 'https://sunnah.com/bukhari:4093' },
      moments: [
        { title: "استأذنه أبو بكر في الخروج", text: sahih('bukhari', 4093, 134, 360), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "«أشعرت أنه قد أذن لي في الخروج»", text: sahih('bukhari', 4093, 361, 676), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "حتى أتيا الغار", text: sahih('bukhari', 4093, 677, 903), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "عامر بن فهيرة", text: sahih('bukhari', 4093, 904, 1329), people: ['abu-bakr-as-siddiq'] },
        { title: "«رفع إلى السماء»", text: sahih('bukhari', 4093, 1330, 1802), people: ['amr-ibn-umayyah-al-damri'] },
        { title: "«إن أصحابكم قد أصيبوا»", text: sahih('bukhari', 4093, 1803, 2184), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDayOfBirMaunah;

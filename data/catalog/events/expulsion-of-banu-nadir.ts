import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Dated two ways, and the chapter says so plainly. al-Zuhri on Urwah's
 * authority puts it على رأس ستة أشهر من وقعة بدر, which the same chapter makes
 * المحرم سنة ثلاث. Musa ibn Uqbah and Ibn Ishaq put it after Uhud instead,
 * which would be year four. `sira/banu-nadir-after-uhud` is DISPUTED for that,
 * and the year here follows the reading the chapter dates outright.
 *
 * Told as a story from Sahih al-Bukhari (al-Maghazi, the chapter on Banu al-Nadir), each hadith whole: Ibn Umar's 4031,
 * the burning of their palms and the ayah sent down on it, first; then 4032, the same with Hassan's verse and Abu Sufyan
 * ibn al-Harith's answer.
 *
 * Then Ibn Umar's same hadith in Sahih Muslim 1746 (al-Jihad, cutting the trees of the disbelievers), whole, which gives
 * 59:5 to its end.
 */
const expulsionOfBanuNadir = {
  kind: 'EVENT',
  slug: 'expulsion-of-banu-nadir',
  name: 'إجلاء بني النضير',
  nameTransliterated: 'The Expulsion of Banu an-Nadir',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 3, claims: ['sira/banu-nadir'] },
    description: {
      value:
        'حاصرهم رسول الله صلى الله عليه وسلم حتى نزلوا على الجلاء، ولهم ما أقلت الإبل إلا السلاح، فأجلاهم إلى الشام، وفيهم نزلت: {هُوَ الَّذِي أَخْرَجَ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ مِنْ دِيَارِهِمْ لِأَوَّلِ الْحَشْرِ} . وذهب موسى بن عقبة وابن إسحاق إلى أنها كانت بعد أحد.',
      claims: ['sira/banu-nadir', 'sira/banu-nadir-after-uhud'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/banu-nadir'] }, { person: 'hassan-ibn-thabit' }, { person: 'abu-sufyan-ibn-al-harith' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '59:5',
      to: '59:5',
      evidence: [
        { source: 'sahih-al-bukhari', hadith: 4031, url: 'https://sunnah.com/bukhari:4031', quote: sahih('bukhari', 4031, 176, 281) },
        { source: 'sahih-muslim', hadith: 1746, url: 'https://sunnah.com/muslim:1746', quote: sahih('muslim', 1746, 306, 444) },
      ],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4031, 0, 94),
      source: { slug: 'sahih-al-bukhari', hadith: 4031, url: 'https://sunnah.com/bukhari:4031' },
      moments: [
        { title: "حرق نخل بني النضير", text: sahih('bukhari', 4031, 95, 283), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4032, 0, 132),
      source: { slug: 'sahih-al-bukhari', hadith: 4032, url: 'https://sunnah.com/bukhari:4032' },
      moments: [
        { title: "حرق نخل بني النضير", text: sahih('bukhari', 4032, 133, 185), people: ['prophet-muhammad'] },
        { title: "«حريق بالبويرة مستطير»", text: sahih('bukhari', 4032, 186, 305), people: ['hassan-ibn-thabit'] },
        { title: "فأجابه أبو سفيان بن الحارث", text: sahih('bukhari', 4032, 306, 508), people: ['abu-sufyan-ibn-al-harith'] },
      ],
    },
    {
      isnad: sahih('muslim', 1746, 0, 176),
      source: { slug: 'sahih-muslim', hadith: 1746, url: 'https://sunnah.com/muslim:1746' },
      moments: [
        { title: "حرق نخل بني النضير", text: sahih('muslim', 1746, 177, 255), people: ['prophet-muhammad'] },
        { title: "فأنزل الله", text: sahih('muslim', 1746, 256, 461), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default expulsionOfBanuNadir;

import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Dated two ways, and the chapter says so plainly. al-Zuhri on Urwah's
 * authority puts it على رأس ستة أشهر من وقعة بدر, which the same chapter makes
 * المحرم سنة ثلاث. Musa ibn Uqbah and Ibn Ishaq put it after Uhud instead,
 * which would be year four. `sira/banu-nadir-after-uhud` is DISPUTED for that,
 * and the year here follows the reading the chapter dates outright.
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
  people: [{ person: 'prophet-muhammad', claims: ['sira/banu-nadir'] }],
} satisfies CatalogEvent;

export default expulsionOfBanuNadir;

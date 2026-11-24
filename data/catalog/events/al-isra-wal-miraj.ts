import { sahih } from '@/lib/catalog/sahihText';
import { legacyUnreviewed, type CatalogEvent } from '@/lib/catalog/types';

/**
 * The chapter dates it only against the hijra, which `hijriYear` can now hold:
 * al-Zuhri's قبل الهجرة بسنة is -1. Ibn Sa'd's بثمانية عشر شهرا reaches back
 * into the year before that and is `sira/isra-year-alt`, DISPUTED; his Rabi
 * al-Awwal against Ramadan is a month, which the model does not hold.
 *
 * al-Waqidi splits the Isra' from the Mi'raj and dates them separately. The
 * model has one event, so both legs share it; the description says so.
 *
 * prisma/eventSeedData.ts held this event too, under the slug
 * night-journey-and-ascension-isra-and-miraaj, and events have no per-subject
 * authority guard, so catalog:project created a second row rather than
 * reporting the collision. That entry is retired; its location is carried
 * below, and its hijriYear of -10 is left behind as the error it was.
 *
 * Told as a story from Sahih al-Bukhari, each hadith whole: Malik ibn Sa'sa'ah's 3887 (Manaqib al-Ansar, the
 * chapter on the Mi'raj) first, in the Prophet's ﷺ own words, then Jabir's 3886 (Quraysh deny him and Bayt al-Maqdis is shown to him).
 */
const alIsraWalMiraj = {
  kind: 'EVENT',
  slug: 'al-isra-wal-miraj',
  name: 'الإسراء والمعراج',
  nameTransliterated: "Al-Isra' wal-Mi'raj",
  type: 'TRAVEL',
  fields: {
    hijriYear: { value: -1, claims: ['sira/isra-year'] },
    // Carried from the retired seed entry. The chapter names المسجد الحرام and
    // بيت المقدس in the description, but not as a field the batch cites.
    location: { value: 'من مكة إلى القدس ثم السماوات العلى', claims: legacyUnreviewed },
    description: {
      value:
        'أسري به من المسجد الحرام إلى بيت المقدس على البراق قبل الهجرة بسنة، فربطه بالحلقة التي تربط بها الأنبياء وصلى بهم، ثم عرج به إلى السموات، وفرضت الصلوات خمسين ثم خففت إلى خمس بمراجعة موسى عليه السلام.',
      claims: ['sira/isra', 'sira/miraj-salah'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/isra'] }, { person: 'anas-ibn-malik' }, { person: 'jabir-ibn-abdullah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3887, 0, 161),
      source: { slug: 'sahih-al-bukhari', hadith: 3887, url: 'https://sunnah.com/bukhari:3887' },
      moments: [
        { title: "«بينما أنا في الحطيم»", text: sahih('bukhari', 3887, 162, 329), people: ['prophet-muhammad'] },
        { title: "شق صدره وغسل قلبه", text: sahih('bukhari', 3887, 330, 672), people: ['prophet-muhammad'] },
        { title: "البراق", text: sahih('bukhari', 3887, 673, 887), people: ['prophet-muhammad', 'anas-ibn-malik'] },
        { title: "السماء الدنيا: آدم", text: sahih('bukhari', 3887, 888, 1349), people: ['prophet-muhammad'] },
        { title: "الثانية: يحيى وعيسى", text: sahih('bukhari', 3887, 1350, 1811), people: ['prophet-muhammad'] },
        { title: "الثالثة: يوسف", text: sahih('bukhari', 3887, 1812, 2229), people: ['prophet-muhammad'] },
        { title: "الرابعة: إدريس", text: sahih('bukhari', 3887, 2230, 2660), people: ['prophet-muhammad'] },
        { title: "الخامسة: هارون", text: sahih('bukhari', 3887, 2661, 3082), people: ['prophet-muhammad'] },
        { title: "السادسة: موسى", text: sahih('bukhari', 3887, 3083, 3673), people: ['prophet-muhammad'] },
        { title: "السابعة: إبراهيم", text: sahih('bukhari', 3887, 3674, 4110), people: ['prophet-muhammad'] },
        { title: "سدرة المنتهى", text: sahih('bukhari', 3887, 4111, 4490), people: ['prophet-muhammad'] },
        { title: "البيت المعمور و«هي الفطرة»", text: sahih('bukhari', 3887, 4491, 4689), people: ['prophet-muhammad'] },
        { title: "خمسون صلاة", text: sahih('bukhari', 3887, 4690, 5480), people: ['prophet-muhammad'] },
        { title: "«ولكن أرضى وأسلّم»", text: sahih('bukhari', 3887, 5481, 5884), people: ['prophet-muhammad'] },
        { title: "«أمضيت فريضتي»", text: sahih('bukhari', 3887, 5885, 5977), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3886, 0, 193),
      source: { slug: 'sahih-al-bukhari', hadith: 3886, url: 'https://sunnah.com/bukhari:3886' },
      moments: [
        { title: "«لما كذبني قريش»", text: sahih('bukhari', 3886, 194, 284), people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "«فجلا الله لي بيت المقدس»", text: sahih('bukhari', 3886, 285, 388), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default alIsraWalMiraj;

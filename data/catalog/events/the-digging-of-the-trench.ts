import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Muhajirun and the Ansar dug the trench round Medina on a cold morning, hungry, carrying the earth on their backs and
 * chanting «نحن الذين بايعوا محمدا», and the Prophet ﷺ answered them «اللهم لا عيش إلا عيش الآخره» and carried earth
 * himself until the dust covered his belly, chanting Ibn Rawahah's lines. Told from the two Sahihs, each hadith whole: Anas's
 * Sahih al-Bukhari 4100 first (al-Maghazi, the chapter on al-Khandaq); then 4099; al-Bara's 4106, 4104 and Sahih Muslim
 * 1803; then Sahl's al-Bukhari 4098 and Muslim 1804. Muslim 1805 is the line alone, with no scene, and is not repeated.
 */
const theDiggingOfTheTrench = {
  kind: 'EVENT',
  slug: 'the-digging-of-the-trench',
  name: "حفر الخندق",
  nameTransliterated: "Digging the trench",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abdullah-ibn-rawahah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4100, 0, 113),
      source: { slug: 'sahih-al-bukhari', hadith: 4100, url: 'https://sunnah.com/bukhari:4100' },
      moments: [
        { title: "«نحن الذين بايعوا محمدا»", text: sahih('bukhari', 4100, 114, 340), people: ['prophet-muhammad'] },
        { title: "«فبارك في الأنصار والمهاجره»", text: sahih('bukhari', 4100, 341, 490), people: ['prophet-muhammad'] },
        { title: "إهالة سنخة", text: sahih('bukhari', 4100, 491, 692), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 4099, 0, 158),
      source: { slug: 'sahih-al-bukhari', hadith: 4099, url: 'https://sunnah.com/bukhari:4099' },
      moments: [
        { title: "يحفرون في غداة باردة", text: sahih('bukhari', 4099, 159, 332), people: ['prophet-muhammad'] },
        { title: "«اللهم إن العيش عيش الآخره»", text: sahih('bukhari', 4099, 333, 481), people: ['prophet-muhammad'] },
        { title: "«على الجهاد ما بقينا أبدا»", text: sahih('bukhari', 4099, 482, 588), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 4106, 0, 205),
      source: { slug: 'sahih-al-bukhari', hadith: 4106, url: 'https://sunnah.com/bukhari:4106' },
      moments: [
        { title: "وارى الغبار جلدة بطنه", text: sahih('bukhari', 4106, 206, 391), people: ['prophet-muhammad'] },
        { title: "يرتجز بكلمات ابن رواحة", text: sahih('bukhari', 4106, 392, 759), people: ['prophet-muhammad', 'abdullah-ibn-rawahah'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4104, 0, 118),
      source: { slug: 'sahih-al-bukhari', hadith: 4104, url: 'https://sunnah.com/bukhari:4104' },
      moments: [
        { title: "ينقل التراب يوم الخندق", text: sahih('bukhari', 4104, 119, 228), people: ['prophet-muhammad'] },
        { title: "«والله لولا الله ما اهتدينا»", text: sahih('bukhari', 4104, 229, 510), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('muslim', 1803, 0, 185),
      source: { slug: 'sahih-muslim', hadith: 1803, url: 'https://sunnah.com/muslim:1803' },
      moments: [
        { title: "ينقل معنا التراب", text: sahih('muslim', 1803, 186, 464), people: ['prophet-muhammad'] },
        { title: "«إن أرادوا فتنة أبينا»", text: sahih('muslim', 1803, 465, 560), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4098, 0, 117),
      source: { slug: 'sahih-al-bukhari', hadith: 4098, url: 'https://sunnah.com/bukhari:4098' },
      moments: [
        {
          title: "«اللهم لا عيش إلا عيش الآخره»",
          text: sahih('bukhari', 4098, 118, 348),
          people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4098, 118, 232) },
            { text: sahih('bukhari', 4098, 233, 348), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4098, 233, 257) },
          ],
        },
      ],
    },
    {
      isnad: sahih('muslim', 1804, 0, 137),
      source: { slug: 'sahih-muslim', hadith: 1804, url: 'https://sunnah.com/muslim:1804' },
      moments: [
        { title: "«اللهم لا عيش إلا عيش الآخرة»", text: sahih('muslim', 1804, 138, 356), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDiggingOfTheTrench;

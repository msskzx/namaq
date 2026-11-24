import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Hunayn the Muslims broke under Hawazin's arrows and fled while the Prophet ﷺ rode his white mule towards the enemy,
 * al-Abbas at its bridle and Abu Sufyan ibn al-Harith at the stirrup, saying «أنا النبي لا كذب، أنا ابن عبد المطلب»; at
 * his word al-Abbas called «أين أصحاب السمرة؟» and they turned back like cows to their calves; he said «هذا حين حمي
 * الوطيس» and threw pebbles, or a handful of earth, «شاهت الوجوه», and they fled. Told first from al-Abbas's Sahih Muslim
 * 1775 (al-Jihad, the battle of Hunayn), whole, the fullest; then Salamah's 1777 and al-Bara's 1776; then al-Bara's
 * Sahih al-Bukhari 4317, 4315 and 4316 (al-Maghazi, the chapter on Hunayn), each whole. 4317 calls the man at the bridle
 * only «أبا سفيان»; he is Abu Sufyan ibn al-Harith as 4315 and Muslim 1776 name him. Al-Bara is linked as the one
 * questioned; the man who asked him is not named.
 */
const theProphetStandsFirmAtHunayn = {
  kind: 'EVENT',
  slug: 'the-prophet-stands-firm-at-hunayn',
  name: "ثباته ﷺ يوم حنين",
  nameTransliterated: "The Prophet stands firm at Hunayn",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'al-abbas-ibn-abd-al-muttalib' }, { person: 'abu-sufyan-ibn-al-harith' }, { person: 'prophet-muhammad' }, { person: 'al-baraa-ibn-azib' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1775, 0, 218),
      source: { slug: 'sahih-muslim', hadith: 1775, url: 'https://sunnah.com/muslim:1775' },
      moments: [
        { title: "على بغلة له بيضاء", text: sahih('muslim', 1775, 219, 489), people: ['al-abbas-ibn-abd-al-muttalib', 'abu-sufyan-ibn-al-harith', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1775, 219, 489) },
          ] },
        { title: "ولى المسلمون مدبرين", text: sahih('muslim', 1775, 490, 800), people: ['prophet-muhammad', 'al-abbas-ibn-abd-al-muttalib', 'abu-sufyan-ibn-al-harith'],
          turns: [
            { text: sahih('muslim', 1775, 490, 800) },
          ] },
        { title: "«أين أصحاب السمرة؟»", text: sahih('muslim', 1775, 801, 1406), people: ['prophet-muhammad', 'al-abbas-ibn-abd-al-muttalib'],
          turns: [
            { text: sahih('muslim', 1775, 801, 863), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1775, 801, 817) },
            { text: sahih('muslim', 1775, 864, 966), speaker: { person: "al-abbas-ibn-abd-al-muttalib", name: "عباس" }, lead: sahih('muslim', 1775, 864, 936) },
            { text: sahih('muslim', 1775, 967, 1182) },
            { text: sahih('muslim', 1775, 1183, 1248), speaker: { name: "الأنصار" }, lead: sahih('muslim', 1775, 1183, 1194), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 246, quote: "والمناداة فيما بين الأنصار (يقولون) أي يقول بعضهم لبعض", url: "https://shamela.ws/book/18268/7921" } },
            { text: sahih('muslim', 1775, 1249, 1406) },
          ] },
        { title: "«هذا حين حمي الوطيس»", text: sahih('muslim', 1775, 1407, 1564), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1775, 1407, 1505) },
            { text: sahih('muslim', 1775, 1506, 1564), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1775, 1506, 1531) },
          ] },
        { title: "رماهم بحصياته", text: sahih('muslim', 1775, 1565, 1877), people: ['prophet-muhammad', 'al-abbas-ibn-abd-al-muttalib'],
          turns: [
            { text: sahih('muslim', 1775, 1565, 1877) },
          ] },
      ],
    },
    {
      isnad: sahih('muslim', 1777, 0, 174),
      source: { slug: 'sahih-muslim', hadith: 1777, url: 'https://sunnah.com/muslim:1777' },
      moments: [
        { title: "فولى صحابة النبي ﷺ", text: sahih('muslim', 1777, 175, 512), people: [] },
        { title: "«لقد رأى ابن الأكوع فزعا»", text: sahih('muslim', 1777, 513, 817), people: ['prophet-muhammad'] },
        { title: "«شاهت الوجوه»", text: sahih('muslim', 1777, 818, 1189), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('muslim', 1776, 0, 85),
      source: { slug: 'sahih-muslim', hadith: 1776, url: 'https://sunnah.com/muslim:1776' },
      moments: [
        { title: "«أفررتم يوم حنين؟»", text: sahih('muslim', 1776, 86, 460), people: ['al-baraa-ibn-azib'] },
        { title: "«أنا النبي لا كذب»", text: sahih('muslim', 1776, 461, 722), people: ['prophet-muhammad', 'abu-sufyan-ibn-al-harith'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4317, 0, 99),
      source: { slug: 'sahih-al-bukhari', hadith: 4317, url: 'https://sunnah.com/bukhari:4317' },
      moments: [
        { title: "«أفررتم عن رسول الله ﷺ يوم حنين؟»", text: sahih('bukhari', 4317, 100, 390), people: ['al-baraa-ibn-azib', 'prophet-muhammad'] },
        { title: "«أنا النبي لا كذب»", text: sahih('bukhari', 4317, 391, 613), people: ['prophet-muhammad', 'abu-sufyan-ibn-al-harith'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4315, 0, 84),
      source: { slug: 'sahih-al-bukhari', hadith: 4315, url: 'https://sunnah.com/bukhari:4315' },
      moments: [
        { title: "«أتوليت يوم حنين؟»", text: sahih('bukhari', 4315, 85, 334), people: ['al-baraa-ibn-azib', 'prophet-muhammad'] },
        { title: "«أنا النبي لا كذب»", text: sahih('bukhari', 4315, 335, 481), people: ['abu-sufyan-ibn-al-harith', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4316, 0, 70),
      source: { slug: 'sahih-al-bukhari', hadith: 4316, url: 'https://sunnah.com/bukhari:4316' },
      moments: [
        { title: "«أنا النبي لا كذب»", text: sahih('bukhari', 4316, 71, 282), people: ['al-baraa-ibn-azib', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theProphetStandsFirmAtHunayn;

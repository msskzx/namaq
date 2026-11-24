import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A man told Hudhayfah he would have fought beside the Prophet ﷺ; Hudhayfah told him of the night of the Confederates, cold
 * and windy, when the Prophet ﷺ asked three times for a man to bring news of the enemy and no one answered, then called him
 * by name; he walked as if in a warm bath, saw Abu Sufyan warming his back at the fire and did not shoot, remembering
 * «ولا تذعرهم علي», and came back and slept in the Prophet's cloak till morning: «قم يا نومان». Told from Sahih Muslim
 * 1788 (al-Jihad, the chapter on the battle of the Confederates), whole.
 */
const hudhayfahOnTheNightOfTheConfederates = {
  kind: 'EVENT',
  slug: 'hudhayfah-on-the-night-of-the-confederates',
  name: "حذيفة ليلة الأحزاب",
  nameTransliterated: "Hudhayfah on the night of the Confederates",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'hudhayfah-ibn-al-yaman' }, { person: 'prophet-muhammad' }, { person: 'abu-sufyan-ibn-harb' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1788, 0, 188),
      source: { slug: 'sahih-muslim', hadith: 1788, url: 'https://sunnah.com/muslim:1788' },
      moments: [
        { title: "«أنت كنت تفعل ذلك؟»", text: sahih('muslim', 1788, 189, 346), people: ['hudhayfah-ibn-al-yaman', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1788, 189, 214) },
            { text: sahih('muslim', 1788, 215, 295), speaker: { name: "رجل" }, lead: sahih('muslim', 1788, 215, 230) },
            { text: sahih('muslim', 1788, 296, 346), speaker: { person: "hudhayfah-ibn-al-yaman", name: "حذيفة" }, lead: sahih('muslim', 1788, 296, 315) },
          ] },
        { title: "«ألا برجل يأتينا بخبر القوم»", text: sahih('muslim', 1788, 347, 879), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1788, 347, 450) },
            { text: sahih('muslim', 1788, 451, 558), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1788, 451, 470) },
            { text: sahih('muslim', 1788, 559, 602) },
            { text: sahih('muslim', 1788, 603, 695), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1788, 603, 609), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 305, quote: "ولم يكونوا ليختلفوا عما يدعوهم إليه ﷺ بهذه البشارة العظيمة ثلاث مرات", url: "https://shamela.ws/book/18268/7980" } },
            { text: sahih('muslim', 1788, 696, 739) },
            { text: sahih('muslim', 1788, 740, 835), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1788, 740, 749), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 305, quote: "ولم يكونوا ليختلفوا عما يدعوهم إليه ﷺ بهذه البشارة العظيمة ثلاث مرات", url: "https://shamela.ws/book/18268/7980" } },
            { text: sahih('muslim', 1788, 836, 879) },
          ] },
        { title: "«قم يا حذيفة فأتنا بخبر القوم»", text: sahih('muslim', 1788, 880, 1074), people: ['prophet-muhammad', 'hudhayfah-ibn-al-yaman'],
          turns: [
            { text: sahih('muslim', 1788, 880, 1000) },
            { text: sahih('muslim', 1788, 1001, 1074), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1788, 1001, 1006), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 306, quote: "(فذكرت) أي تذكرت بقلبي (قول رسول الله ﷺ ولا تذعرهم)", url: "https://shamela.ws/book/18268/7981" } },
          ] },
        { title: "«ولا تذعرهم علي»", text: sahih('muslim', 1788, 1075, 1384), people: ['hudhayfah-ibn-al-yaman', 'abu-sufyan-ibn-harb', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1788, 1075, 1384) },
          ] },
        { title: "«قم يا نومان»", text: sahih('muslim', 1788, 1385, 1687), people: ['hudhayfah-ibn-al-yaman', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1788, 1385, 1662) },
            { text: sahih('muslim', 1788, 1663, 1687), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1788, 1663, 1668), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 307, quote: "(فلما أصبحت قال) لي رسول الله ﷺ: (قم)", url: "https://shamela.ws/book/18268/7982" } },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default hudhayfahOnTheNightOfTheConfederates;

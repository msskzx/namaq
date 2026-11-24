import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Aisha went out with the Prophet ﷺ on a raid; on the way back she lost her necklace, the army left without her, and
 * Safwan ibn al-Mu'attal found her asleep and brought her on his camel; Abd Allah ibn Ubayy and others spread the slander,
 * she learned of it a month later from Umm Mistah, the Prophet ﷺ consulted Ali and Usamah and asked Barirah and Zaynab,
 * the Aws and the Khazraj nearly fought, and at last her innocence was sent down, and Abu Bakr, who had sworn off Mistah,
 * took him back. Told whole from Sahih al-Bukhari 4141 (al-Maghazi, the chapter on the hadith of the Ifk), with al-Zuhri's
 * account of how he gathered it from four men; then Umm Ruman's telling, 4143, whole, folded. «أبواي» and «أبي» are Abu
 * Bakr, as the end of the story names him. Umm Mistah, Hamnah bint Jahsh and Umm Ruman have no catalog subject and are not
 * linked. 4142 (al-Zuhri: Ali was «مسلما» in her matter) and 4144 (her reading «إذ تلقونه») are one line each and not told;
 * 4146 (Hassan reciting to her) is its own story.
 */
const theIfk = {
  kind: 'EVENT',
  slug: 'the-ifk',
  name: "حديث الإفك",
  nameTransliterated: "The slander (al-Ifk)",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'aisha-bint-abi-bakr' }, { person: 'prophet-muhammad' }, { person: 'safwan-ibn-al-muattal' }, { person: 'abdullah-ibn-ubayy' }, { person: 'hassan-ibn-thabit' }, { person: 'mistah-ibn-uthathah' }, { person: 'ali-ibn-abi-talib' }, { person: 'usamah-ibn-zaid' }, { person: 'barirah' }, { person: 'saad-ibn-muadh' }, { person: 'saad-ibn-ubadah' }, { person: 'usayd-ibn-al-hudayr' }, { person: 'abu-bakr-as-siddiq' }, { person: 'zaynab-bint-jahsh' }],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      about: 'aisha-bint-abi-bakr',
      from: '24:11',
      to: '24:20',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4141, url: 'https://sunnah.com/bukhari:4141', quote: sahih('bukhari', 4141, 10858, 10984) }],
    },
    {
      kind: 'REVEALED_ABOUT',
      about: 'abu-bakr-as-siddiq',
      from: '24:22',
      to: '24:22',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4141, url: 'https://sunnah.com/bukhari:4141', quote: sahih('bukhari', 4141, 10986, 11288) }],
    },
    {
      kind: 'RECITED',
      from: '12:18',
      to: '12:18',
      evidence: [
        { source: 'sahih-al-bukhari', hadith: 4141, url: 'https://sunnah.com/bukhari:4141', quote: sahih('bukhari', 4141, 9754, 9849) },
        { source: 'sahih-al-bukhari', hadith: 4143, url: 'https://sunnah.com/bukhari:4143', quote: sahih('bukhari', 4143, 1002, 1090) },
      ],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4141, 0, 723),
      source: { slug: 'sahih-al-bukhari', hadith: 4141, url: 'https://sunnah.com/bukhari:4141' },
      moments: [
        { title: "فخرج فيها سهمي", text: sahih('bukhari', 4141, 724, 1212), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4141, 724, 1212) },
          ] },
        { title: "انقطع عقدي", text: sahih('bukhari', 4141, 1213, 1473), people: ['aisha-bint-abi-bakr'],
          turns: [
            { text: sahih('bukhari', 4141, 1213, 1473) },
          ] },
        { title: "احتملوا هودجي وهم يحسبون أني فيه", text: sahih('bukhari', 4141, 1474, 2161), people: ['aisha-bint-abi-bakr'],
          turns: [
            { text: sahih('bukhari', 4141, 1474, 2161) },
          ] },
        { title: "صفوان بن المعطل", text: sahih('bukhari', 4141, 2162, 2835), people: ['aisha-bint-abi-bakr', 'safwan-ibn-al-muattal'],
          turns: [
            { text: sahih('bukhari', 4141, 2162, 2835) },
          ] },
        { title: "الذي تولى كبر الإفك", text: sahih('bukhari', 4141, 2836, 3574), people: ['abdullah-ibn-ubayy', 'hassan-ibn-thabit', 'mistah-ibn-uthathah', 'aisha-bint-abi-bakr'],
          turns: [
            { text: sahih('bukhari', 4141, 2836, 3390) },
            { text: sahih('bukhari', 4141, 3391, 3574), speaker: { person: "aisha-bint-abi-bakr", name: "عائشة" }, lead: sahih('bukhari', 4141, 3391, 3477) },
          ] },
        { title: "«كيف تيكم»", text: sahih('bukhari', 4141, 3575, 4022), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4141, 3575, 3872) },
            { text: sahih('bukhari', 4141, 3873, 3957), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4141, 3873, 3942) },
            { text: sahih('bukhari', 4141, 3958, 4022) },
          ] },
        { title: "«تعس مسطح»", text: sahih('bukhari', 4141, 4023, 5050), people: ['aisha-bint-abi-bakr', 'mistah-ibn-uthathah'],
          turns: [
            { text: sahih('bukhari', 4141, 4023, 4739) },
            { text: sahih('bukhari', 4141, 4740, 4807), speaker: { name: "أم مسطح" }, lead: sahih('bukhari', 4141, 4740, 4790) },
            { text: sahih('bukhari', 4141, 4808, 4879), speaker: { person: "aisha-bint-abi-bakr", name: "عائشة" }, lead: sahih('bukhari', 4141, 4808, 4823), teller: true },
            { text: sahih('bukhari', 4141, 4880, 4933), speaker: { name: "أم مسطح" }, lead: sahih('bukhari', 4141, 4880, 4890), witness: { source: "fath-al-bari", volume: 8, volumeLabel: "8", page: 466, quote: "قَوْلُهُ: (قَالَتْ: أَيْ هَنْتَاهْ) أَيْ حَرْفُ نِدَاءٍ لِلْبَعِيدِ، وَقَدْ يُسْتَعْمَلُ لِلْقَرِيبِ حَيْثُ يَنْزِلُ مَنْزِلَةَ الْبَعِيدِ، وَالنُّكْتَةُ فِيهِ هُنَا أَنَّ أُمَّ مِسْطَحٍ نَسَبَتْ عَائِشَةَ إِلَى الْغَفْلَةِ", url: "https://shamela.ws/book/1673/4813" } },
            { text: sahih('bukhari', 4141, 4934, 4963), speaker: { person: "aisha-bint-abi-bakr", name: "عائشة" }, lead: sahih('bukhari', 4141, 4934, 4952), teller: true },
            { text: sahih('bukhari', 4141, 4964, 5050) },
          ] },
        { title: "«يا أمتاه، ماذا يتحدث الناس؟»", text: sahih('bukhari', 4141, 5051, 5751), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4141, 5051, 5153), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4141, 5051, 5137) },
            { text: sahih('bukhari', 4141, 5154, 5205), speaker: { person: "aisha-bint-abi-bakr", name: "عائشة" }, lead: sahih('bukhari', 4141, 5154, 5168), teller: true },
            { text: sahih('bukhari', 4141, 5206, 5309) },
            { text: sahih('bukhari', 4141, 5310, 5373), speaker: { person: "aisha-bint-abi-bakr", name: "عائشة" }, lead: sahih('bukhari', 4141, 5310, 5328), teller: true },
            { text: sahih('bukhari', 4141, 5374, 5542) },
            { text: sahih('bukhari', 4141, 5543, 5617), speaker: { person: "aisha-bint-abi-bakr", name: "عائشة" }, lead: sahih('bukhari', 4141, 5543, 5561), teller: true },
            { text: sahih('bukhari', 4141, 5618, 5751) },
          ] },
        { title: "يستشير عليا وأسامة", text: sahih('bukhari', 4141, 5752, 6265), people: ['prophet-muhammad', 'ali-ibn-abi-talib', 'usamah-ibn-zaid'],
          turns: [
            { text: sahih('bukhari', 4141, 5752, 6066) },
            { text: sahih('bukhari', 4141, 6067, 6126), speaker: { person: "usamah-ibn-zaid", name: "أسامة" }, lead: sahih('bukhari', 4141, 6067, 6085) },
            { text: sahih('bukhari', 4141, 6127, 6265), speaker: { person: "ali-ibn-abi-talib", name: "علي" }, lead: sahih('bukhari', 4141, 6127, 6152) },
          ] },
        { title: "«أي بريرة، هل رأيت من شيء يريبك»", text: sahih('bukhari', 4141, 6266, 6587), people: ['prophet-muhammad', 'barirah', 'aisha-bint-abi-bakr'],
          turns: [
            { text: sahih('bukhari', 4141, 6266, 6371), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4141, 6266, 6318) },
            { text: sahih('bukhari', 4141, 6372, 6587), speaker: { person: "barirah", name: "بريرة" }, lead: sahih('bukhari', 4141, 6372, 6395) },
          ] },
        { title: "«من يعذرني من رجل»", text: sahih('bukhari', 4141, 6588, 7218), people: ['prophet-muhammad', 'abdullah-ibn-ubayy', 'saad-ibn-muadh'],
          turns: [
            { text: sahih('bukhari', 4141, 6588, 6974), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4141, 6588, 6715) },
            { text: sahih('bukhari', 4141, 6975, 7218), speaker: { person: "saad-ibn-muadh", name: "سعد بن معاذ" }, lead: sahih('bukhari', 4141, 6975, 7051) },
          ] },
        { title: "فثار الحيان الأوس والخزرج", text: sahih('bukhari', 4141, 7219, 8003), people: ['saad-ibn-ubadah', 'saad-ibn-muadh', 'usayd-ibn-al-hudayr', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4141, 7219, 7605), speaker: { person: "saad-ibn-ubadah", name: "سعد بن عبادة" }, lead: sahih('bukhari', 4141, 7219, 7477) },
            { text: sahih('bukhari', 4141, 7606, 7790), speaker: { person: "usayd-ibn-al-hudayr", name: "أسيد بن حضير" }, lead: sahih('bukhari', 4141, 7606, 7697) },
            { text: sahih('bukhari', 4141, 7791, 8003) },
          ] },
        { title: "«أظن أن البكاء فالق كبدي»", text: sahih('bukhari', 4141, 8004, 8664), people: ['aisha-bint-abi-bakr', 'abu-bakr-as-siddiq'],
          turns: [
            { text: sahih('bukhari', 4141, 8004, 8664) },
          ] },
        { title: "«فإن كنت بريئة فسيبرئك الله»", text: sahih('bukhari', 4141, 8665, 8990), people: ['prophet-muhammad', 'aisha-bint-abi-bakr'],
          turns: [
            { text: sahih('bukhari', 4141, 8665, 8990), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4141, 8665, 8728) },
          ] },
        { title: "«أجب رسول الله ﷺ عني فيما قال»", text: sahih('bukhari', 4141, 8991, 9345), people: ['aisha-bint-abi-bakr', 'abu-bakr-as-siddiq', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4141, 8991, 9093) },
            { text: sahih('bukhari', 4141, 9094, 9155), speaker: { person: "aisha-bint-abi-bakr", name: "عائشة" }, lead: sahih('bukhari', 4141, 9094, 9111), teller: true },
            { text: sahih('bukhari', 4141, 9156, 9221), speaker: { person: "abu-bakr-as-siddiq", name: "أبي" }, lead: sahih('bukhari', 4141, 9156, 9170) },
            { text: sahih('bukhari', 4141, 9222, 9278), speaker: { person: "aisha-bint-abi-bakr", name: "عائشة" }, lead: sahih('bukhari', 4141, 9222, 9239), teller: true },
            { text: sahih('bukhari', 4141, 9279, 9345), speaker: { name: "أمي" }, lead: sahih('bukhari', 4141, 9279, 9294) },
          ] },
        { title: "«فصبر جميل والله المستعان على ما تصفون»", text: sahih('bukhari', 4141, 9346, 10247), people: ['aisha-bint-abi-bakr'],
          turns: [
            { text: sahih('bukhari', 4141, 9346, 9849), speaker: { person: "aisha-bint-abi-bakr", name: "عائشة" }, lead: sahih('bukhari', 4141, 9346, 9431), teller: true },
            { text: sahih('bukhari', 4141, 9850, 10247) },
          ] },
        { title: "حتى أنزل عليه", text: sahih('bukhari', 4141, 10248, 10559), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4141, 10248, 10559) },
          ] },
        { title: "«أما الله فقد برأك»", text: sahih('bukhari', 4141, 10560, 10985), people: ['prophet-muhammad', 'aisha-bint-abi-bakr'],
          turns: [
            { text: sahih('bukhari', 4141, 10560, 10717), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4141, 10560, 10671) },
            { text: sahih('bukhari', 4141, 10718, 10765), speaker: { name: "أمي" }, lead: sahih('bukhari', 4141, 10718, 10748) },
            { text: sahih('bukhari', 4141, 10766, 10848), speaker: { person: "aisha-bint-abi-bakr", name: "عائشة" }, lead: sahih('bukhari', 4141, 10766, 10775), teller: true },
            { text: sahih('bukhari', 4141, 10849, 10985) },
          ] },
        { title: "«ولا يأتل أولو الفضل منكم»", text: sahih('bukhari', 4141, 10986, 11494), people: ['abu-bakr-as-siddiq', 'mistah-ibn-uthathah'],
          turns: [
            { text: sahih('bukhari', 4141, 10986, 11194), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر الصديق" }, lead: sahih('bukhari', 4141, 10986, 11097) },
            { text: sahih('bukhari', 4141, 11195, 11288) },
            { text: sahih('bukhari', 4141, 11289, 11376), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر الصديق" }, lead: sahih('bukhari', 4141, 11289, 11320) },
            { text: sahih('bukhari', 4141, 11377, 11494) },
          ] },
        { title: "«أحمي سمعي وبصري»", text: sahih('bukhari', 4141, 11495, 11924), people: ['prophet-muhammad', 'zaynab-bint-jahsh', 'aisha-bint-abi-bakr'],
          turns: [
            { text: sahih('bukhari', 4141, 11495, 11634), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4141, 11495, 11601) },
            { text: sahih('bukhari', 4141, 11635, 11924) },
          ] },
        { title: "«ما كشفت من كنف أنثى قط»", text: sahih('bukhari', 4141, 11925, 12251), people: ['aisha-bint-abi-bakr', 'safwan-ibn-al-muattal'],
          turns: [
            { text: sahih('bukhari', 4141, 11925, 12251) },
          ] },
      ],
    },
    {
      isnad: sahih('bukhari', 4143, 0, 226),
      source: { slug: 'sahih-al-bukhari', hadith: 4143, url: 'https://sunnah.com/bukhari:4143' },
      moments: [
        { title: "«ابني فيمن حدث الحديث»", text: sahih('bukhari', 4143, 227, 587), people: ['aisha-bint-abi-bakr', 'prophet-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "خرت مغشيا عليها", text: sahih('bukhari', 4143, 588, 720), people: ['aisha-bint-abi-bakr'] },
        { title: "«ما شأن هذه؟»", text: sahih('bukhari', 4143, 721, 892), people: ['prophet-muhammad', 'aisha-bint-abi-bakr'] },
        { title: "«مثلي ومثلكم كيعقوب وبنيه»", text: sahih('bukhari', 4143, 893, 1090), people: ['aisha-bint-abi-bakr'] },
        { title: "«بحمد الله لا بحمد أحد ولا بحمدك»", text: sahih('bukhari', 4143, 1091, 1225), people: ['prophet-muhammad', 'aisha-bint-abi-bakr'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theIfk;

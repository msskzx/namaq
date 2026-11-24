import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Salamah ibn al-Akwa' pledged three times under the tree at al-Hudaybiyah and brought in four mushrikun at swordpoint; back
 * in Medina, when Abd al-Rahman al-Fazari raided the Prophet's camels he cried «يا صباحاه», ran after the raiders alone
 * shooting and chanting until he had taken back every camel and they threw down thirty cloaks and thirty spears; al-Akhram
 * and Abu Qatadah caught up, he kept the raiders from the water of Dhu Qarad, raced the Ansari back to Medina, and then went
 * out to Khaybar, where his uncle Amir fell and Ali killed Marhab. Told whole from Sahih Muslim 1807 (al-Jihad, the chapter on
 * the raid of Dhu Qarad), the fullest; then the short telling of the morning of Dhu Qarad, Sahih Muslim 1806 and Sahih
 * al-Bukhari 4194, folded. Salamah and his uncle Amir, Rabah, Abd al-Rahman al-Fazari, al-Akhram, Mikraz, Ibn Zunaym and
 * Marhab have no catalog subject and are not linked. In 1806 and 4194 the slave is «غلام لعبد الرحمن بن عوف», who is
 * linked by name.
 */
const salamahAtDhuQarad = {
  kind: 'EVENT',
  slug: 'salamah-at-dhu-qarad',
  name: "سلمة بن الأكوع يوم ذي قرد",
  nameTransliterated: "Salamah ibn al-Akwa' at Dhu Qarad",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'talhah-ibn-ubaydullah' }, { person: 'abu-qatadah-al-ansari' }, { person: 'al-miqdad-ibn-amr' }, { person: 'bilal-ibn-rabah' }, { person: 'umar-ibn-al-khattab' }, { person: 'ali-ibn-abi-talib' }, { person: 'abdur-rahman-ibn-awf' }],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '48:24',
      to: '48:24',
      evidence: [{ source: 'sahih-muslim', hadith: 1807, url: 'https://sunnah.com/muslim:1807', quote: sahih('muslim', 1807, 3120, 3262) }],
    },
  ],
  reports: [
    {
      isnad: sahih('muslim', 1807, 0, 447),
      source: { slug: 'sahih-muslim', hadith: 1807, url: 'https://sunnah.com/muslim:1807' },
      moments: [
        { title: "جاشت الركية", text: sahih('muslim', 1807, 448, 718), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 448, 718) },
          ] },
        { title: "«بايع يا سلمة»", text: sahih('muslim', 1807, 719, 1418), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 719, 908) },
            { text: sahih('muslim', 1807, 909, 939), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 909, 914), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 376, quote: "(وسط من الناس قال) لي رسول الله ﷺ: (بايعـ) ـني (يا سلمة", url: "https://shamela.ws/book/18268/8051" } },
            { text: sahih('muslim', 1807, 940, 1014), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 940, 953), teller: true },
            { text: sahih('muslim', 1807, 1015, 1032), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 1015, 1020), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 376, quote: "(قد بايعتك يا رسول الله في أول الناس قال) رسول الله ﷺ: (وأيضًا)", url: "https://shamela.ws/book/18268/8051" } },
            { text: sahih('muslim', 1807, 1033, 1222) },
            { text: sahih('muslim', 1807, 1223, 1264), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 1223, 1228), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 377, quote: "(قال) لي رسول الله ﷺ: (ألا تبايعني يا سلمة", url: "https://shamela.ws/book/18268/8052" } },
            { text: sahih('muslim', 1807, 1265, 1365), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 1265, 1279), teller: true },
            { text: sahih('muslim', 1807, 1366, 1383), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 1366, 1371), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 377, quote: "وفي أوسط الناس قال) لي رسول الله ﷺ (وأيضًا)", url: "https://shamela.ws/book/18268/8052" } },
            { text: sahih('muslim', 1807, 1384, 1418) },
          ] },
        { title: "«اللهم أبغني حبيبا هو أحب إلي من نفسي»", text: sahih('muslim', 1807, 1419, 1747), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 1419, 1506), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 1419, 1434), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 377, quote: "(ثم قال لي) رسول الله ﷺ: (يا سلمة أين حجفتك", url: "https://shamela.ws/book/18268/8052" } },
            { text: sahih('muslim', 1807, 1507, 1601), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 1507, 1520), teller: true },
            { text: sahih('muslim', 1807, 1602, 1747), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 1602, 1643) },
          ] },
        { title: "«لا يرفع أحد منكم رأسه إلا ضربت الذي فيه عيناه»", text: sahih('muslim', 1807, 1748, 2755), people: ['talhah-ibn-ubaydullah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 1748, 2619) },
            { text: sahih('muslim', 1807, 2620, 2755), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 2620, 2640), teller: true },
          ] },
        { title: "فعفا عنهم رسول الله ﷺ", text: sahih('muslim', 1807, 2756, 3297), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 2756, 2993) },
            { text: sahih('muslim', 1807, 2994, 3083), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 2994, 3036) },
            { text: sahih('muslim', 1807, 3084, 3297) },
          ] },
        { title: "طليعة على الجبل", text: sahih('muslim', 1807, 3298, 3636), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 3298, 3636) },
          ] },
        { title: "«يا صباحاه»", text: sahih('muslim', 1807, 3637, 4251), people: ['prophet-muhammad', 'talhah-ibn-ubaydullah'],
          turns: [
            { text: sahih('muslim', 1807, 3637, 3972) },
            { text: sahih('muslim', 1807, 3973, 4148), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 3973, 3988), teller: true },
            { text: sahih('muslim', 1807, 4149, 4251) },
          ] },
        { title: "«أنا ابن الأكوع، واليوم يوم الرضع»", text: sahih('muslim', 1807, 4252, 4751), people: [],
          turns: [
            { text: sahih('muslim', 1807, 4252, 4499) },
            { text: sahih('muslim', 1807, 4500, 4579), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 4500, 4513), teller: true },
            { text: sahih('muslim', 1807, 4580, 4751) },
          ] },
        { title: "آراما من الحجارة", text: sahih('muslim', 1807, 4752, 5254), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 4752, 5254) },
          ] },
        { title: "«هل تعرفوني؟»", text: sahih('muslim', 1807, 5255, 6080), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 5255, 5446) },
            { text: sahih('muslim', 1807, 5447, 5492), speaker: { name: "الفزاري" }, lead: sahih('muslim', 1807, 5447, 5467) },
            { text: sahih('muslim', 1807, 5493, 5631) },
            { text: sahih('muslim', 1807, 5632, 5687), speaker: { name: "الفزاري" }, lead: sahih('muslim', 1807, 5632, 5638), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 386, quote: "(قال) فلان الفزاري (فليقم إليه)", url: "https://shamela.ws/book/18268/8061" } },
            { text: sahih('muslim', 1807, 5688, 5791) },
            { text: sahih('muslim', 1807, 5792, 5824), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 5792, 5805), teller: true },
            { text: sahih('muslim', 1807, 5825, 5853) },
            { text: sahih('muslim', 1807, 5854, 6028), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 5854, 5864), teller: true },
            { text: sahih('muslim', 1807, 6029, 6061), speaker: { name: "أحدهم" }, lead: sahih('muslim', 1807, 6029, 6046) },
            { text: sahih('muslim', 1807, 6062, 6080) },
          ] },
        { title: "«فلا تحل بيني وبين الشهادة»", text: sahih('muslim', 1807, 6081, 6680), people: ['prophet-muhammad', 'abu-qatadah-al-ansari', 'al-miqdad-ibn-amr'],
          turns: [
            { text: sahih('muslim', 1807, 6081, 6408) },
            { text: sahih('muslim', 1807, 6409, 6510), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 6409, 6416), teller: true },
            { text: sahih('muslim', 1807, 6511, 6680), speaker: { name: "الأخرم" }, lead: sahih('muslim', 1807, 6511, 6517), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 388, quote: "لي الأخرم: (يا سلمة إن كنت تؤمن", url: "https://shamela.ws/book/18268/8063" } },
          ] },
        { title: "طعنه أبو قتادة فقتله", text: sahih('muslim', 1807, 6681, 6954), people: ['abu-qatadah-al-ansari', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 6681, 6954) },
          ] },
        { title: "«أكوعه بكرة»", text: sahih('muslim', 1807, 6955, 7788), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 6955, 7482) },
            { text: sahih('muslim', 1807, 7483, 7562), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 7483, 7496), teller: true },
            { text: sahih('muslim', 1807, 7563, 7614), speaker: { name: "ذلك الرجل" }, lead: sahih('muslim', 1807, 7563, 7569), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 390, quote: "الرضع قال) ذلك الرجل: (يا ثكلته أمه)", url: "https://shamela.ws/book/18268/8065" } },
            { text: sahih('muslim', 1807, 7615, 7679), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 7615, 7628), teller: true },
            { text: sahih('muslim', 1807, 7680, 7788) },
          ] },
        { title: "«يا سلمة! أتراك كنت فاعلا؟»", text: sahih('muslim', 1807, 7789, 8806), people: ['prophet-muhammad', 'bilal-ibn-rabah'],
          turns: [
            { text: sahih('muslim', 1807, 7789, 8266) },
            { text: sahih('muslim', 1807, 8267, 8427), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 8267, 8280), teller: true },
            { text: sahih('muslim', 1807, 8428, 8548), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 8428, 8505) },
            { text: sahih('muslim', 1807, 8549, 8586), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 8549, 8556), teller: true },
            { text: sahih('muslim', 1807, 8587, 8647), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 8587, 8594), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 392, quote: "(فقال) رسول الله ﷺ: (إنهم الآن ليقرون)", url: "https://shamela.ws/book/18268/8067" } },
            { text: sahih('muslim', 1807, 8648, 8751), speaker: { name: "رجل من غطفان" }, lead: sahih('muslim', 1807, 8648, 8687) },
            { text: sahih('muslim', 1807, 8752, 8806) },
          ] },
        { title: "«كان خير فرساننا اليوم أبو قتادة»", text: sahih('muslim', 1807, 8807, 9148), people: ['prophet-muhammad', 'abu-qatadah-al-ansari'],
          turns: [
            { text: sahih('muslim', 1807, 8807, 8930), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 8807, 8845) },
            { text: sahih('muslim', 1807, 8931, 9148) },
          ] },
        { title: "«ألا مسابق إلى المدينة؟»", text: sahih('muslim', 1807, 9149, 9607), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 9149, 9183) },
            { text: sahih('muslim', 1807, 9184, 9326), speaker: { name: "رجل من الأنصار" }, lead: sahih('muslim', 1807, 9184, 9269) },
            { text: sahih('muslim', 1807, 9327, 9386) },
            { text: sahih('muslim', 1807, 9387, 9443), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 9387, 9394), teller: true },
            { text: sahih('muslim', 1807, 9444, 9494), speaker: { name: "الرجل" }, lead: sahih('muslim', 1807, 9444, 9450), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 393, quote: "شريفًا قال) الرجل (لا)", url: "https://shamela.ws/book/18268/8068" } },
            { text: sahih('muslim', 1807, 9495, 9587), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 9495, 9508), teller: true },
            { text: sahih('muslim', 1807, 9588, 9607), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 9588, 9593), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 394, quote: "(قال) رسول الله ﷺ: (إن شئت)", url: "https://shamela.ws/book/18268/8069" } },
          ] },
        { title: "فسبقته إلى المدينة", text: sahih('muslim', 1807, 9608, 9994), people: [],
          turns: [
            { text: sahih('muslim', 1807, 9608, 9639), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 9608, 9621), teller: true },
            { text: sahih('muslim', 1807, 9640, 9892) },
            { text: sahih('muslim', 1807, 9893, 9932), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 9893, 9906), teller: true },
            { text: sahih('muslim', 1807, 9933, 9954), speaker: { name: "الرجل" }, lead: sahih('muslim', 1807, 9933, 9939), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 395, quote: "(قال) الرجل (أنا أظن)", url: "https://shamela.ws/book/18268/8070" } },
            { text: sahih('muslim', 1807, 9955, 9994) },
          ] },
        { title: "«غفر لك ربك»", text: sahih('muslim', 1807, 9995, 10659), people: ['prophet-muhammad', 'umar-ibn-al-khattab'],
          turns: [
            { text: sahih('muslim', 1807, 9995, 10107) },
            { text: sahih('muslim', 1807, 10108, 10360), speaker: { name: "عامر" }, lead: sahih('muslim', 1807, 10108, 10162) },
            { text: sahih('muslim', 1807, 10361, 10400), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 10361, 10386) },
            { text: sahih('muslim', 1807, 10401, 10422), speaker: { name: "عامر" }, lead: sahih('muslim', 1807, 10401, 10407), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 395, quote: "(قال) عمي: (أنا عامر)", url: "https://shamela.ws/book/18268/8070" } },
            { text: sahih('muslim', 1807, 10423, 10450), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 10423, 10428), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 395, quote: "(قال) رسول الله ﷺ: (غفر لك ربك", url: "https://shamela.ws/book/18268/8070" } },
            { text: sahih('muslim', 1807, 10451, 10535) },
            { text: sahih('muslim', 1807, 10536, 10659), speaker: { person: "umar-ibn-al-khattab", name: "عمر بن الخطاب" }, lead: sahih('muslim', 1807, 10536, 10602) },
          ] },
        { title: "«بل له أجره مرتين»", text: sahih('muslim', 1807, 10660, 11565), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1807, 10660, 10873), speaker: { name: "مرحب" }, lead: sahih('muslim', 1807, 10660, 10759) },
            { text: sahih('muslim', 1807, 10874, 10994), speaker: { name: "عامر" }, lead: sahih('muslim', 1807, 10874, 10919) },
            { text: sahih('muslim', 1807, 10995, 11187) },
            { text: sahih('muslim', 1807, 11188, 11310), speaker: { name: "نفر من أصحاب النبي ﷺ" }, lead: sahih('muslim', 1807, 11188, 11270) },
            { text: sahih('muslim', 1807, 11311, 11361) },
            { text: sahih('muslim', 1807, 11362, 11416), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 11362, 11371), teller: true },
            { text: sahih('muslim', 1807, 11417, 11461), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 11417, 11440) },
            { text: sahih('muslim', 1807, 11462, 11499), speaker: { name: "سلمة" }, lead: sahih('muslim', 1807, 11462, 11475), teller: true },
            { text: sahih('muslim', 1807, 11500, 11565), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 11500, 11505), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 397, quote: "(ناس من أصحابك قال) رسول الله ﷺ: (كذب", url: "https://shamela.ws/book/18268/8072" } },
          ] },
        { title: "«أنا الذي سمتني أمي حيدره»", text: sahih('muslim', 1807, 11566, 12374), people: ['prophet-muhammad', 'ali-ibn-abi-talib'],
          turns: [
            { text: sahih('muslim', 1807, 11566, 11615) },
            { text: sahih('muslim', 1807, 11616, 11722), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1807, 11616, 11623), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 397, quote: "(فقال) رسول الله ﷺ عندما أرسلني", url: "https://shamela.ws/book/18268/8072" } },
            { text: sahih('muslim', 1807, 11723, 11889) },
            { text: sahih('muslim', 1807, 11890, 12030), speaker: { name: "مرحب" }, lead: sahih('muslim', 1807, 11890, 11916) },
            { text: sahih('muslim', 1807, 12031, 12152), speaker: { person: "ali-ibn-abi-talib", name: "علي" }, lead: sahih('muslim', 1807, 12031, 12047) },
            { text: sahih('muslim', 1807, 12153, 12374) },
          ] },
      ],
    },
    {
      isnad: sahih('muslim', 1806, 0, 156),
      source: { slug: 'sahih-muslim', hadith: 1806, url: 'https://sunnah.com/muslim:1806' },
      moments: [
        { title: "«يا صباحاه»", text: sahih('muslim', 1806, 157, 505), people: ['abdur-rahman-ibn-awf', 'prophet-muhammad'] },
        { title: "«أنا ابن الأكوع»", text: sahih('muslim', 1806, 506, 834), people: [] },
        { title: "«يا ابن الأكوع! ملكت فأسجح»", text: sahih('muslim', 1806, 835, 1143), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4194, 0, 139),
      source: { slug: 'sahih-al-bukhari', hadith: 4194, url: 'https://sunnah.com/bukhari:4194' },
      moments: [
        { title: "«يا صباحاه»", text: sahih('bukhari', 4194, 140, 493), people: ['abdur-rahman-ibn-awf', 'prophet-muhammad'] },
        { title: "«أنا ابن الأكوع»", text: sahih('bukhari', 4194, 494, 810), people: [] },
        { title: "«يا ابن الأكوع ملكت، فأسجح»", text: sahih('bukhari', 4194, 811, 1115), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default salamahAtDhuQarad;

import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Undated. He came to Mecca to treat what he had heard called madness and left
 * having given his hand on Islam -- and on his people's, which the Prophet
 * asked for and he gave. Told first as Sahih Muslim (868) has it, split by speaker; who
 * speaks where the text says only «فقال» is al-Harari's (al-Kawkab al-Wahhaj). al-Dhahabi's
 * telling (al-Sira 1 p158) follows, folded.
 */
const islamOfDimad = {
  kind: 'EVENT',
  slug: 'islam-of-dimad',
  name: 'إسلام ضماد الأزدي',
  nameTransliterated: 'The Islam of Dimad al-Azdi',
  type: 'OTHER',
  fields: {
    location: { value: 'مكة', claims: ['dimad/islam'] },
    description: {
      value:
        'قدم ضماد مكة وهو من أزد شنوءة يرقي من الريح، فسمع سفهاء الناس يقولون: إن محمدا مجنون، فأتاه ليرقيه، فسمع منه خطبة الحاجة، فقال: والله لقد سمعت قول الكهنة والسحرة والشعراء، فما سمعت مثل هؤلاء الكلمات، فهلم يدك أبايعك على الإسلام. فبايعه وقال له: (وعلى قومك) . قال: وعلى قومي.',
      claims: ['dimad/islam'],
    },
  },
  people: [
    { person: 'dimad-al-azdi', claims: ['dimad/islam'] },
    { person: 'prophet-muhammad', claims: ['dimad/islam'] },
  ],
  tags: ['ISLAM', 'HIS_WORDS'],
  reports: [
    {
      // Muslim's own telling (owner, 2026-11-21): clearer than al-Dhahabi's, whose «"ثلاث مرات"» sits inside the shahada.
      isnad: sahih('muslim', 868, 0, 273),
      source: { slug: 'sahih-muslim', hadith: 868, url: 'https://sunnah.com/muslim:868' },
      moments: [
        {
          title: "جاء ليرقيه",
          text: sahih('muslim', 868, 274, 663),
          people: ["dimad-al-azdi"],
          turns: [
            { text: sahih('muslim', 868, 274, 441) },
            { text: sahih('muslim', 868, 442, 528), speaker: { person: "dimad-al-azdi", name: "ضماد" }, lead: sahih('muslim', 868, 442, 450), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 343, quote: "(فقال) ضماد (لو أني رأيت هذا الرجل)", url: "https://shamela.ws/book/18268/4142" } },
            { text: sahih('muslim', 868, 529, 546) },
            { text: sahih('muslim', 868, 547, 663), speaker: { person: "dimad-al-azdi", name: "ضماد" }, lead: sahih('muslim', 868, 547, 555), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 343, quote: "(فقال) ضماد له ﷺ (يا محمد إني أرقي)", url: "https://shamela.ws/book/18268/4142" } },
          ],
        },
        {
          title: "ما قاله النبي ﷺ",
          text: sahih('muslim', 868, 664, 1057),
          people: ["prophet-muhammad", "dimad-al-azdi"],
          turns: [
            { text: sahih('muslim', 868, 664, 946), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 868, 664, 690) },
            { text: sahih('muslim', 868, 947, 999), speaker: { person: "dimad-al-azdi", name: "ضماد" }, lead: sahih('muslim', 868, 947, 961), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 344, quote: "(قال) ابن عباس (فقال) ضماد لرسول الله ﷺ (أعد عليّ)", url: "https://shamela.ws/book/18268/4143" } },
            { text: sahih('muslim', 868, 1000, 1057) },
          ],
        },
        {
          title: "ناعوس البحر",
          text: sahih('muslim', 868, 1058, 1369),
          people: ["dimad-al-azdi", "prophet-muhammad"],
          turns: [
            { text: sahih('muslim', 868, 1058, 1228), speaker: { person: "dimad-al-azdi", name: "ضماد" }, lead: sahih('muslim', 868, 1058, 1072), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 344, quote: "(فقال) ضماد: والله (لقد سمعت قول الكهنة)", url: "https://shamela.ws/book/18268/4143" } },
            { text: sahih('muslim', 868, 1229, 1288), speaker: { person: "dimad-al-azdi", name: "ضماد" }, lead: sahih('muslim', 868, 1229, 1243), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 344, quote: "(قال) ابن عباس (فقال) ضماد: (هات يدك)", url: "https://shamela.ws/book/18268/4143" } },
            { text: sahih('muslim', 868, 1289, 1307) },
            { text: sahih('muslim', 868, 1308, 1345), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 868, 1308, 1325) },
            { text: sahih('muslim', 868, 1346, 1369), speaker: { person: "dimad-al-azdi", name: "ضماد" }, lead: sahih('muslim', 868, 1346, 1352), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 345, quote: "(قال) ضماد (و) بايعت (على) الإسلام لنفسي ولـ (قومي", url: "https://shamela.ws/book/18268/4144" } },
          ],
        },
        {
          title: "قوم ضماد",
          text: sahih('muslim', 868, 1370, 1620),
          people: [],
          turns: [
            { text: sahih('muslim', 868, 1370, 1434) },
            { text: sahih('muslim', 868, 1435, 1515), speaker: { name: "صاحب السرية" }, lead: sahih('muslim', 868, 1435, 1475) },
            { text: sahih('muslim', 868, 1516, 1576), speaker: { name: "رجل من القوم" }, lead: sahih('muslim', 868, 1516, 1546) },
            { text: sahih('muslim', 868, 1577, 1620), speaker: { name: "صاحب السرية" }, lead: sahih('muslim', 868, 1577, 1585), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 345, quote: "(فقال صاحب السرية) أي أميرهم … (فقال) أمير السرية (ردها)", url: "https://shamela.ws/book/18268/4144" } },
          ],
        },
      ],
    },
    {
      isnad: 'داود بن أبي هند، عن عمرو بن سعيد، عن سعيد بن جبير، عن ابن عباس،',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 158, url: 'https://shamela.ws/book/10906/296' },
      grading: 'أخرجه مسلم',
      moments: [
        { title: 'جاء ليرقيه', text: 'قال: قدم ضماد مكة، وهو من أزد شنوءة، وكان يرقي من هذه الرياح، فسمع سفهاء من سفهاء الناس يقولون: إن محمدا مجنون، فقال: آتي هذا الرجل لعل الله أن يشفيه على يدي. قال: فلقيت محمدا فقلت: إني أرقي من هذه الرياح، وإن الله يشفي على يدي من يشاء، فهلم.', people: ['dimad-al-azdi'] },
        { title: 'ما قاله النبي ﷺ', text: 'فقال محمد: "إن الحمد لله نحمده ونستعينه، من يهده الله فلا مضل له، ومن يضلل فلا هادي له، وأشهد أن لا إله إلا الله، وحده لا شريك له". "ثلاث مرات"، وأن محمدا عبده ورسوله، أما بعد.', people: ['prophet-muhammad'] },
        { title: '«قاموس البحر»', text: 'فقال: والله لقد سمعت قول الكهنة، وقول السحرة، وقول الشعراء، فما سمعت مثل هؤلاء الكلمات ولقد بلغن قاموس البحر، فهلم يدك أبايعك على الإسلام. فبايعه رسول الله صلى الله عليه وسلم وقال له: "وعلى قومك". فقال: وعلى قومي.', people: ['dimad-al-azdi', 'prophet-muhammad'] },
        { title: 'قوم ضماد', text: 'فبعث رسول الله صلى الله عليه وسلم سرية، فمروا بقوم ضماد، فقال صاحب الجيش للسرية: هل أصبتم من هؤلاء شيئا؟ فقال رجل منهم: أصبت منهم مطهرة. فقال: ردوها عليهم فإنهم قوم ضماد.', people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfDimad;

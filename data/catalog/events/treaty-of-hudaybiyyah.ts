import { sahih } from '@/lib/catalog/sahihText';
import { legacyUnreviewed, type CatalogEvent } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/eventSeedData.ts entry, uncited. Distinct
 * from the `hudaybiyyah` battle record (data/catalog/battles/hudaybiyyah.ts):
 * the seed modeled the treaty as both an event and a battle, and this module
 * only carries the event side forward.
 *
 * Told as a story from the two Sahihs, each hadith whole. First al-Miswar and Marwan's whole telling, Sahih al-Bukhari 2731
 * (al-Shurut, the chapter on conditions in jihad; our copy prints 2732 inside it): al-Qaswa' kneels, the arrow in the well,
 * Budayl, Urwah ibn Mas'ud and al-Mughirah, the writing with Suhayl, Abu Jandal in his chains, Umar's «ألست نبي الله حقا؟»,
 * Umm Salamah's counsel, the believing women, and Abu Basir. Al-Maghazi has only pieces of it: 4178 (the march and the
 * consultation) and 4180 (Suhayl's condition, Abu Jandal, Umm Kulthum bint Uqbah), folded. Then Sahih Muslim 1783 (al-Bara,
 * Ali told to erase «رسول الله»), 1784 (Anas, «باسمك اللهم»), 1785 (Sahl ibn Hunayf at Siffin, Umar's objection and al-Fath
 * read to him) and Sahih al-Bukhari 4189 (Sahl's «اتهموا الرأي… يوم أبي جندل»), folded. 4157 (the ihram at Dhu al-Hulayfah,
 * with Sufyan's doubt) and 4182 (the testing of the women, ending «فذكره بطوله») are not repeated. Budayl, Urwah ibn
 * Mas'ud, Mikraz, Suhayl ibn Amr and Abu Basir have no catalog subject and are not linked.
 */
const treatyOfHudaybiyyah = {
  kind: 'EVENT',
  slug: 'treaty-of-hudaybiyyah',
  name: 'صلح الحديبية',
  nameTransliterated: 'Treaty of Hudaybiyyah',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 6, claims: legacyUnreviewed },
    location: { value: 'الحديبية', claims: legacyUnreviewed },
    description: { value: 'صلح الحديبية', claims: legacyUnreviewed },
  },
  people: [
    { person: 'prophet-muhammad', claims: legacyUnreviewed },
    { person: 'abu-bakr-as-siddiq', claims: legacyUnreviewed },
    { person: 'umar-ibn-al-khattab', claims: legacyUnreviewed },
    { person: 'khalid-ibn-al-walid' },
    { person: 'al-mughirah-ibn-shubah' },
    { person: 'abu-jandal' },
    { person: 'umm-salamah' },
    { person: 'muawiyah-ibn-abi-sufyan' },
    { person: 'safwan-ibn-umayyah' },
    { person: 'umm-kulthum-bint-uqbah' },
    { person: 'ali-ibn-abi-talib' },
    { person: 'sahl-ibn-hunayf' },
  ],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '60:10',
      to: '60:10',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 2731, url: 'https://sunnah.com/bukhari:2731', quote: sahih('bukhari', 2731, 10747, 10906) }],
    },
    {
      kind: 'REVEALED_ABOUT',
      from: '48:24',
      to: '48:26',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 2731, url: 'https://sunnah.com/bukhari:2731', quote: sahih('bukhari', 2731, 12762, 12970) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 2731, 0, 276),
      source: { slug: 'sahih-al-bukhari', hadith: 2731, url: 'https://sunnah.com/bukhari:2731' },
      moments: [
        { title: "«إن خالد بن الوليد بالغميم»", text: sahih('bukhari', 2731, 277, 602), people: ['prophet-muhammad', 'khalid-ibn-al-walid'],
          turns: [
            { text: sahih('bukhari', 2731, 277, 360) },
            { text: sahih('bukhari', 2731, 361, 484), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 361, 380) },
            { text: sahih('bukhari', 2731, 485, 602) },
          ] },
        { title: "«حبسها حابس الفيل»", text: sahih('bukhari', 2731, 603, 1097), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 603, 721) },
            { text: sahih('bukhari', 2731, 722, 750), speaker: { name: "الناس" }, lead: sahih('bukhari', 2731, 722, 739) },
            { text: sahih('bukhari', 2731, 751, 820) },
            { text: sahih('bukhari', 2731, 821, 1069), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 821, 842) },
            { text: sahih('bukhari', 2731, 1070, 1097) },
          ] },
        { title: "يجيش لهم بالري", text: sahih('bukhari', 2731, 1098, 1465), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 1098, 1465) },
          ] },
        { title: "«إنا لم نجئ لقتال أحد»", text: sahih('bukhari', 2731, 1466, 2344), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 1466, 1841), speaker: { name: "بديل بن ورقاء الخزاعي" }, lead: sahih('bukhari', 2731, 1466, 1655) },
            { text: sahih('bukhari', 2731, 1842, 2344), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 2731, 1842, 1866) },
          ] },
        { title: "«ألستم بالوالد؟»", text: sahih('bukhari', 2731, 2345, 3342), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 2345, 2391), speaker: { name: "بديل" }, lead: sahih('bukhari', 2731, 2345, 2362) },
            { text: sahih('bukhari', 2731, 2392, 2572) },
            { text: sahih('bukhari', 2731, 2573, 2647), speaker: { name: "سفهاؤهم" }, lead: sahih('bukhari', 2731, 2573, 2595) },
            { text: sahih('bukhari', 2731, 2648, 2711), speaker: { name: "ذوو الرأي منهم" }, lead: sahih('bukhari', 2731, 2648, 2681) },
            { text: sahih('bukhari', 2731, 2712, 2792) },
            { text: sahih('bukhari', 2731, 2793, 2871), speaker: { name: "عروة بن مسعود" }, lead: sahih('bukhari', 2731, 2793, 2833) },
            { text: sahih('bukhari', 2731, 2872, 3342) },
          ] },
        { title: "«أنحن نفر عنه وندعه؟»", text: sahih('bukhari', 2731, 3343, 3884), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 3343, 3643), speaker: { name: "عروة" }, lead: sahih('bukhari', 2731, 3343, 3374) },
            { text: sahih('bukhari', 2731, 3644, 3733), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: sahih('bukhari', 2731, 3644, 3670) },
            { text: sahih('bukhari', 2731, 3734, 3884) },
          ] },
        { title: "«أخر يدك عن لحية رسول الله ﷺ»", text: sahih('bukhari', 2731, 3885, 4590), people: ['prophet-muhammad', 'al-mughirah-ibn-shubah'],
          turns: [
            { text: sahih('bukhari', 2731, 3885, 3966) },
            { text: sahih('bukhari', 2731, 3967, 4232), speaker: { name: "المغيرة بن شعبة" }, lead: sahih('bukhari', 2731, 3967, 4186) },
            { text: sahih('bukhari', 2731, 4233, 4281), speaker: { name: "عروة" }, lead: sahih('bukhari', 2731, 4233, 4269) },
            { text: sahih('bukhari', 2731, 4282, 4491) },
            { text: sahih('bukhari', 2731, 4492, 4590), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 4492, 4513) },
          ] },
        { title: "«إن رأيت ملكا قط يعظمه أصحابه»", text: sahih('bukhari', 2731, 4591, 5639), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 4591, 5002) },
            { text: sahih('bukhari', 2731, 5003, 5639), speaker: { name: "عروة" }, lead: sahih('bukhari', 2731, 5003, 5047) },
          ] },
        { title: "«ما ينبغي لهؤلاء أن يصدوا عن البيت»", text: sahih('bukhari', 2731, 5640, 6155), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 5640, 5693), speaker: { name: "رجل من بني كنانة" }, lead: sahih('bukhari', 2731, 5640, 5676) },
            { text: sahih('bukhari', 2731, 5694, 5765) },
            { text: sahih('bukhari', 2731, 5766, 5866), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 2731, 5766, 5788) },
            { text: sahih('bukhari', 2731, 5867, 6155) },
          ] },
        { title: "«لقد سهل لكم من أمركم»", text: sahih('bukhari', 2731, 6156, 6604), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 6156, 6241), speaker: { name: "مكرز بن حفص" }, lead: sahih('bukhari', 2731, 6156, 6224) },
            { text: sahih('bukhari', 2731, 6242, 6291) },
            { text: sahih('bukhari', 2731, 6292, 6350), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 6292, 6311) },
            { text: sahih('bukhari', 2731, 6351, 6546) },
            { text: sahih('bukhari', 2731, 6547, 6604), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 6547, 6566) },
          ] },
        { title: "«اكتب باسمك اللهم»", text: sahih('bukhari', 2731, 6605, 7104), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 6605, 6740), speaker: { name: "سهيل بن عمرو" }, lead: sahih('bukhari', 2731, 6605, 6693) },
            { text: sahih('bukhari', 2731, 6741, 6773) },
            { text: sahih('bukhari', 2731, 6774, 6832), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 6774, 6795) },
            { text: sahih('bukhari', 2731, 6833, 6960), speaker: { name: "سهيل" }, lead: sahih('bukhari', 2731, 6833, 6848) },
            { text: sahih('bukhari', 2731, 6961, 7052), speaker: { name: "المسلمون" }, lead: sahih('bukhari', 2731, 6961, 6984) },
            { text: sahih('bukhari', 2731, 7053, 7104), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 7053, 7074) },
          ] },
        { title: "«والله إني لرسول الله وإن كذبتموني»", text: sahih('bukhari', 2731, 7105, 7584), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 7105, 7168) },
            { text: sahih('bukhari', 2731, 7169, 7335), speaker: { name: "سهيل" }, lead: sahih('bukhari', 2731, 7169, 7186) },
            { text: sahih('bukhari', 2731, 7336, 7449), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 7336, 7357) },
            { text: sahih('bukhari', 2731, 7450, 7584) },
          ] },
        { title: "«ولكن ذلك من العام المقبل»", text: sahih('bukhari', 2731, 7585, 8026), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 7585, 7677), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 7585, 7611) },
            { text: sahih('bukhari', 2731, 7678, 7799), speaker: { name: "سهيل" }, lead: sahih('bukhari', 2731, 7678, 7695) },
            { text: sahih('bukhari', 2731, 7800, 7809) },
            { text: sahih('bukhari', 2731, 7810, 7928), speaker: { name: "سهيل" }, lead: sahih('bukhari', 2731, 7810, 7827) },
            { text: sahih('bukhari', 2731, 7929, 8026), speaker: { name: "المسلمون" }, lead: sahih('bukhari', 2731, 7929, 7950) },
          ] },
        { title: "«أرد إلى المشركين وقد جئت مسلما»", text: sahih('bukhari', 2731, 8027, 8794), people: ['abu-jandal', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 8027, 8316), speaker: { name: "سهيل" }, lead: sahih('bukhari', 2731, 8027, 8240) },
            { text: sahih('bukhari', 2731, 8317, 8376), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 8317, 8338) },
            { text: sahih('bukhari', 2731, 8377, 8438) },
            { text: sahih('bukhari', 2731, 8439, 8474), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 8439, 8458) },
            { text: sahih('bukhari', 2731, 8475, 8561) },
            { text: sahih('bukhari', 2731, 8562, 8605), speaker: { name: "مكرز" }, lead: sahih('bukhari', 2731, 8562, 8577) },
            { text: sahih('bukhari', 2731, 8606, 8744), speaker: { name: "أبو جندل" }, lead: sahih('bukhari', 2731, 8606, 8627) },
            { text: sahih('bukhari', 2731, 8745, 8794) },
          ] },
        { title: "«ألست نبي الله حقا؟»", text: sahih('bukhari', 2731, 8795, 9317), people: ['umar-ibn-al-khattab', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 8795, 8902), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 2731, 8795, 8871) },
            { text: sahih('bukhari', 2731, 8903, 8916), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 8903, 8909), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "قَوْلُهُ: (فَقُلْتُ: أَلَسْتَ نَبِيَّ اللَّهِ حَقًّا؟ قَالَ: بَلَى) زَادَ الْوَاقِدِيُّ مِنْ حَدِيثِ أَبِي سَعِيدٍ قَالَ عُمَرُ: لَقَدْ دَخَلَنِي أَمْرٌ عَظِيمٌ، وَرَاجَعْتُ النَّبِيَّ ﷺ", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 8917, 8980), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 2731, 8917, 8924), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "هَذَا مِمَّا يُقَوِّي أَنَّ الَّذِي حَدَّثَ الْمِسْوَرَ، وَمَرْوَانَ بِقِصَّةِ الْحُدَيْبِيَةِ هُوَ عُمَرُ", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 8981, 8994), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 8981, 8987), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 8995, 9050), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 2731, 8995, 9002), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "هَذَا مِمَّا يُقَوِّي أَنَّ الَّذِي حَدَّثَ الْمِسْوَرَ، وَمَرْوَانَ بِقِصَّةِ الْحُدَيْبِيَةِ هُوَ عُمَرُ", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9051, 9116), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 9051, 9057), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "قَوْلُهُ: (إِنِّي رَسُولُ اللَّهِ وَلَسْتُ أَعْصِيهِ) ظَاهِرٌ فِي أَنَّهُ ﷺ", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9117, 9198), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 2731, 9117, 9124), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "هَذَا مِمَّا يُقَوِّي أَنَّ الَّذِي حَدَّثَ الْمِسْوَرَ، وَمَرْوَانَ بِقِصَّةِ الْحُدَيْبِيَةِ هُوَ عُمَرُ", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9199, 9254), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 9199, 9205), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9255, 9274), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 2731, 9255, 9269), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "هَذَا مِمَّا يُقَوِّي أَنَّ الَّذِي حَدَّثَ الْمِسْوَرَ، وَمَرْوَانَ بِقِصَّةِ الْحُدَيْبِيَةِ هُوَ عُمَرُ", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9275, 9317), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 9275, 9281), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
          ] },
        { title: "«فاستمسك بغرزه»", text: sahih('bukhari', 2731, 9318, 9977), people: ['umar-ibn-al-khattab', 'abu-bakr-as-siddiq'],
          turns: [
            { text: sahih('bukhari', 2731, 9318, 9413), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 2731, 9318, 9358), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "(فَأَتَيْتُ أَبَا بَكْرٍ) لَمْ يَذْكُرْ عُمَرُ أَنَّهُ رَاجَعَ أَحَدًا فِي ذَلِكَ بَعْدَ رَسُولِ اللَّهِ ﷺ غَيْرَ أَبِي بَكْرٍ الصِّدِّيقِ، وَذَلِكَ لِجَلَالَةِ قَدْرِهِ وَسَعَةِ عِلْمِهِ عِنْدَهُ، وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9414, 9427), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: sahih('bukhari', 2731, 9414, 9420), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "(فَأَتَيْتُ أَبَا بَكْرٍ) لَمْ يَذْكُرْ عُمَرُ أَنَّهُ رَاجَعَ أَحَدًا فِي ذَلِكَ بَعْدَ رَسُولِ اللَّهِ ﷺ غَيْرَ أَبِي بَكْرٍ الصِّدِّيقِ، وَذَلِكَ لِجَلَالَةِ قَدْرِهِ وَسَعَةِ عِلْمِهِ عِنْدَهُ، وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9428, 9491), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 2731, 9428, 9435), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "(فَأَتَيْتُ أَبَا بَكْرٍ) لَمْ يَذْكُرْ عُمَرُ أَنَّهُ رَاجَعَ أَحَدًا فِي ذَلِكَ بَعْدَ رَسُولِ اللَّهِ ﷺ غَيْرَ أَبِي بَكْرٍ الصِّدِّيقِ، وَذَلِكَ لِجَلَالَةِ قَدْرِهِ وَسَعَةِ عِلْمِهِ عِنْدَهُ، وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9492, 9505), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: sahih('bukhari', 2731, 9492, 9498), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "(فَأَتَيْتُ أَبَا بَكْرٍ) لَمْ يَذْكُرْ عُمَرُ أَنَّهُ رَاجَعَ أَحَدًا فِي ذَلِكَ بَعْدَ رَسُولِ اللَّهِ ﷺ غَيْرَ أَبِي بَكْرٍ الصِّدِّيقِ، وَذَلِكَ لِجَلَالَةِ قَدْرِهِ وَسَعَةِ عِلْمِهِ عِنْدَهُ، وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9506, 9561), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 2731, 9506, 9513), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "(فَأَتَيْتُ أَبَا بَكْرٍ) لَمْ يَذْكُرْ عُمَرُ أَنَّهُ رَاجَعَ أَحَدًا فِي ذَلِكَ بَعْدَ رَسُولِ اللَّهِ ﷺ غَيْرَ أَبِي بَكْرٍ الصِّدِّيقِ، وَذَلِكَ لِجَلَالَةِ قَدْرِهِ وَسَعَةِ عِلْمِهِ عِنْدَهُ، وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9562, 9719), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: sahih('bukhari', 2731, 9562, 9568), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "وَقَوْلُ أَبِي بَكْرٍ: فَاسْتَمْسِكْ بِغَرْزِهِ", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9720, 9798), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 2731, 9720, 9727), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "(فَأَتَيْتُ أَبَا بَكْرٍ) لَمْ يَذْكُرْ عُمَرُ أَنَّهُ رَاجَعَ أَحَدًا فِي ذَلِكَ بَعْدَ رَسُولِ اللَّهِ ﷺ غَيْرَ أَبِي بَكْرٍ الصِّدِّيقِ، وَذَلِكَ لِجَلَالَةِ قَدْرِهِ وَسَعَةِ عِلْمِهِ عِنْدَهُ، وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9799, 9855), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: sahih('bukhari', 2731, 9799, 9805), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "(فَأَتَيْتُ أَبَا بَكْرٍ) لَمْ يَذْكُرْ عُمَرُ أَنَّهُ رَاجَعَ أَحَدًا فِي ذَلِكَ بَعْدَ رَسُولِ اللَّهِ ﷺ غَيْرَ أَبِي بَكْرٍ الصِّدِّيقِ، وَذَلِكَ لِجَلَالَةِ قَدْرِهِ وَسَعَةِ عِلْمِهِ عِنْدَهُ، وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9856, 9868), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 2731, 9856, 9863), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "(فَأَتَيْتُ أَبَا بَكْرٍ) لَمْ يَذْكُرْ عُمَرُ أَنَّهُ رَاجَعَ أَحَدًا فِي ذَلِكَ بَعْدَ رَسُولِ اللَّهِ ﷺ غَيْرَ أَبِي بَكْرٍ الصِّدِّيقِ، وَذَلِكَ لِجَلَالَةِ قَدْرِهِ وَسَعَةِ عِلْمِهِ عِنْدَهُ، وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9869, 9911), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: sahih('bukhari', 2731, 9869, 9875), witness: { source: "fath-al-bari", volume: 5, volumeLabel: "5", page: 346, quote: "(فَأَتَيْتُ أَبَا بَكْرٍ) لَمْ يَذْكُرْ عُمَرُ أَنَّهُ رَاجَعَ أَحَدًا فِي ذَلِكَ بَعْدَ رَسُولِ اللَّهِ ﷺ غَيْرَ أَبِي بَكْرٍ الصِّدِّيقِ، وَذَلِكَ لِجَلَالَةِ قَدْرِهِ وَسَعَةِ عِلْمِهِ عِنْدَهُ، وَفِي جَوَابِ أَبِي بَكْرٍ، لِعُمَرَ بِنَظِيرِ مَا أَجَابَهُ النَّبِيُّ ﷺ سَوَاءً", url: "https://shamela.ws/book/1673/3128" } },
            { text: sahih('bukhari', 2731, 9912, 9977), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 2731, 9912, 9945) },
          ] },
        { title: "«اخرج ثم لا تكلم أحدا منهم كلمة»", text: sahih('bukhari', 2731, 9978, 10710), people: ['prophet-muhammad', 'umm-salamah'],
          turns: [
            { text: sahih('bukhari', 2731, 9978, 10027) },
            { text: sahih('bukhari', 2731, 10028, 10101), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 2731, 10028, 10064) },
            { text: sahih('bukhari', 2731, 10102, 10289) },
            { text: sahih('bukhari', 2731, 10290, 10468), speaker: { name: "أم سلمة" }, lead: sahih('bukhari', 2731, 10290, 10315) },
            { text: sahih('bukhari', 2731, 10469, 10710) },
          ] },
        { title: "جاءه نسوة مؤمنات", text: sahih('bukhari', 2731, 10711, 11075), people: ['umar-ibn-al-khattab', 'muawiyah-ibn-abi-sufyan', 'safwan-ibn-umayyah'],
          turns: [
            { text: sahih('bukhari', 2731, 10711, 11075) },
          ] },
        { title: "«ويل أمه، مسعر حرب»", text: sahih('bukhari', 2731, 11076, 12156), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 11076, 11390) },
            { text: sahih('bukhari', 2731, 11391, 11496), speaker: { name: "أبو بصير" }, lead: sahih('bukhari', 2731, 11391, 11436) },
            { text: sahih('bukhari', 2731, 11497, 11603) },
            { text: sahih('bukhari', 2731, 11604, 11653), speaker: { name: "أبو بصير" }, lead: sahih('bukhari', 2731, 11604, 11626) },
            { text: sahih('bukhari', 2731, 11654, 11774) },
            { text: sahih('bukhari', 2731, 11775, 11839), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 2731, 11775, 11811) },
            { text: sahih('bukhari', 2731, 11840, 11929) },
            { text: sahih('bukhari', 2731, 11930, 12079), speaker: { name: "أبو بصير" }, lead: sahih('bukhari', 2731, 11930, 11960) },
            { text: sahih('bukhari', 2731, 12080, 12156), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 2731, 12080, 12099) },
          ] },
        { title: "لحق أبو جندل بأبي بصير", text: sahih('bukhari', 2731, 12157, 13142), people: ['abu-jandal', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 2731, 12157, 13142) },
          ] },
      ],
    },
    {
      isnad: sahih('bukhari', 4178, 0, 300),
      source: { slug: 'sahih-al-bukhari', hadith: 4178, url: 'https://sunnah.com/bukhari:4178' },
      moments: [
        { title: "قلد الهدي وأشعره", text: sahih('bukhari', 4178, 301, 485), people: ['prophet-muhammad'] },
        { title: "«أشيروا أيها الناس علي»", text: sahih('bukhari', 4178, 486, 1024), people: ['prophet-muhammad'] },
        { title: "«امضوا على اسم الله»", text: sahih('bukhari', 4178, 1025, 1237), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4180, 0, 339),
      source: { slug: 'sahih-al-bukhari', hadith: 4180, url: 'https://sunnah.com/bukhari:4180' },
      moments: [
        { title: "ما اشترط سهيل بن عمرو", text: sahih('bukhari', 4180, 340, 759), people: ['prophet-muhammad'] },
        { title: "رد أبا جندل إلى أبيه", text: sahih('bukhari', 4180, 760, 1078), people: ['prophet-muhammad', 'abu-jandal'] },
        { title: "أم كلثوم بنت عقبة", text: sahih('bukhari', 4180, 1079, 1373), people: ['umm-kulthum-bint-uqbah', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('muslim', 1783, 0, 158),
      source: { slug: 'sahih-muslim', hadith: 1783, url: 'https://sunnah.com/muslim:1783' },
      moments: [
        { title: "«لا تكتب: رسول الله»", text: sahih('muslim', 1783, 159, 435), people: ['ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«امحه»", text: sahih('muslim', 1783, 436, 549), people: ['prophet-muhammad', 'ali-ibn-abi-talib'] },
        { title: "جلبان السلاح", text: sahih('muslim', 1783, 550, 779), people: [] },
      ],
    },
    {
      isnad: sahih('muslim', 1784, 0, 103),
      source: { slug: 'sahih-muslim', hadith: 1784, url: 'https://sunnah.com/muslim:1784' },
      moments: [
        { title: "«اكتب بسم الله الرحمن الرحيم»", text: sahih('muslim', 1784, 104, 396), people: ['prophet-muhammad', 'ali-ibn-abi-talib'] },
        { title: "«اكتب من محمد بن عبد الله»", text: sahih('muslim', 1784, 397, 607), people: ['prophet-muhammad'] },
        { title: "«سيجعل الله له فرجا ومخرجا»", text: sahih('muslim', 1784, 608, 939), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('muslim', 1785, 0, 228),
      source: { slug: 'sahih-muslim', hadith: 1785, url: 'https://sunnah.com/muslim:1785' },
      moments: [
        { title: "«اتهموا أنفسكم»", text: sahih('muslim', 1785, 229, 508), people: ['sahl-ibn-hunayf', 'prophet-muhammad'] },
        { title: "«ألسنا على حق وهم على باطل؟»", text: sahih('muslim', 1785, 509, 931), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "«إنه رسول الله ولن يضيعه الله أبدا»", text: sahih('muslim', 1785, 932, 1382), people: ['umar-ibn-al-khattab', 'abu-bakr-as-siddiq'] },
        { title: "فطابت نفسه ورجع", text: sahih('muslim', 1785, 1383, 1562), people: ['prophet-muhammad', 'umar-ibn-al-khattab'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4189, 0, 162),
      source: { slug: 'sahih-al-bukhari', hadith: 4189, url: 'https://sunnah.com/bukhari:4189' },
      moments: [
        { title: "«اتهموا الرأي»", text: sahih('bukhari', 4189, 163, 656), people: ['sahl-ibn-hunayf', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default treatyOfHudaybiyyah;

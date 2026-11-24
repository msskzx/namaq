import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ka'b ibn Malik stayed behind from Tabuk with no excuse, putting off his preparations day after day; when the Prophet ﷺ
 * came back he told him the truth, «لا والله ما كان لي من عذر», and was told «أما هذا فقد صدق، فقم حتى يقضي الله فيك».
 * He, Murarah ibn al-Rabi' and Hilal ibn Umayyah were shunned for fifty nights: Abu Qatadah would not return his salam, the
 * king of Ghassan wrote inviting him and he burned the letter, he was told to keep away from his wife, and on the fiftieth
 * dawn a voice from Sal' cried «يا كعب بن مالك، أبشر»; Talhah rose to greet him, the Prophet ﷺ said «أبشر بخير يوم مر
 * عليك منذ ولدتك أمك», and «لقد تاب الله على النبي والمهاجرين…» to «وكونوا مع الصادقين» was sent down. Told whole from
 * Sahih al-Bukhari 4418 (al-Maghazi, the hadith of Ka'b ibn Malik). Murarah, Hilal and Hilal's wife, the man of Banu
 * Salimah, the Nabataean and the king of Ghassan have no catalog subject and are not linked. 3951 (batch 3) is only its
 * opening line.
 */
const kaabIbnMalikAndTheThreeWhoStayedBehind = {
  kind: 'EVENT',
  slug: 'kaab-ibn-malik-and-the-three-who-stayed-behind',
  name: "كعب بن مالك والثلاثة الذين خلفوا",
  nameTransliterated: "Ka'b ibn Malik and the three who stayed behind",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'kaab-ibn-malik' }, { person: 'prophet-muhammad' }, { person: 'muadh-ibn-jabal' }, { person: 'abu-qatadah-al-ansari' }, { person: 'talhah-ibn-ubaydullah' }],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      about: 'kaab-ibn-malik',
      from: '9:117',
      to: '9:119',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4418, url: 'https://sunnah.com/bukhari:4418', quote: sahih('bukhari', 4418, 11077, 11215) }],
    },
    {
      kind: 'REVEALED_ABOUT',
      from: '9:95',
      to: '9:96',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4418, url: 'https://sunnah.com/bukhari:4418', quote: sahih('bukhari', 4418, 11523, 11667) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4418, 0, 260),
      source: { slug: 'sahih-al-bukhari', hadith: 4418, url: 'https://sunnah.com/bukhari:4418' },
      moments: [
        { title: "لم أتخلف إلا في غزوة تبوك", text: sahih('bukhari', 4418, 261, 1090), people: ['kaab-ibn-malik', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 261, 1090) },
          ] },
        { title: "جلى للمسلمين أمرهم", text: sahih('bukhari', 4418, 1091, 1650), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 1091, 1650) },
          ] },
        { title: "لم أقض من جهازي شيئا", text: sahih('bukhari', 4418, 1651, 2645), people: ['kaab-ibn-malik', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 1651, 2645) },
          ] },
        { title: "«ما فعل كعب؟»", text: sahih('bukhari', 4418, 2646, 3008), people: ['prophet-muhammad', 'kaab-ibn-malik', 'muadh-ibn-jabal'],
          turns: [
            { text: sahih('bukhari', 4418, 2646, 2770), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4418, 2646, 2751) },
            { text: sahih('bukhari', 4418, 2771, 2869), speaker: { name: "رجل من بني سلمة" }, lead: sahih('bukhari', 4418, 2771, 2806) },
            { text: sahih('bukhari', 4418, 2870, 2983), speaker: { person: "muadh-ibn-jabal", name: "معاذ بن جبل" }, lead: sahih('bukhari', 4418, 2870, 2898) },
            { text: sahih('bukhari', 4418, 2984, 3008) },
          ] },
        { title: "فأجمعت صدقه", text: sahih('bukhari', 4418, 3009, 3831), people: ['kaab-ibn-malik', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 3009, 3831) },
          ] },
        { title: "«أما هذا فقد صدق»", text: sahih('bukhari', 4418, 3832, 4665), people: ['kaab-ibn-malik', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 3832, 4043) },
            { text: sahih('bukhari', 4418, 4044, 4566), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 4044, 4053), teller: true },
            { text: sahih('bukhari', 4418, 4567, 4655), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4418, 4567, 4591) },
            { text: sahih('bukhari', 4418, 4656, 4665) },
          ] },
        { title: "رجلان قالا مثل ما قلت", text: sahih('bukhari', 4418, 4666, 5430), people: ['kaab-ibn-malik'],
          turns: [
            { text: sahih('bukhari', 4418, 4666, 4972), speaker: { name: "رجال من بني سلمة" }, lead: sahih('bukhari', 4418, 4666, 4732) },
            { text: sahih('bukhari', 4418, 4973, 5059) },
            { text: sahih('bukhari', 4418, 5060, 5112), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 5060, 5080), teller: true },
            { text: sahih('bukhari', 4418, 5113, 5205) },
            { text: sahih('bukhari', 4418, 5206, 5227), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 5206, 5215), teller: true },
            { text: sahih('bukhari', 4418, 5228, 5430) },
          ] },
        { title: "نهى عن كلامنا", text: sahih('bukhari', 4418, 5431, 6274), people: ['prophet-muhammad', 'kaab-ibn-malik'],
          turns: [
            { text: sahih('bukhari', 4418, 5431, 6274) },
          ] },
        { title: "«الله ورسوله أعلم»", text: sahih('bukhari', 4418, 6275, 6776), people: ['kaab-ibn-malik', 'abu-qatadah-al-ansari'],
          turns: [
            { text: sahih('bukhari', 4418, 6275, 6503) },
            { text: sahih('bukhari', 4418, 6504, 6598), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 6504, 6513), teller: true },
            { text: sahih('bukhari', 4418, 6599, 6674) },
            { text: sahih('bukhari', 4418, 6675, 6711), speaker: { person: "abu-qatadah-al-ansari", name: "أبو قتادة" }, lead: sahih('bukhari', 4418, 6675, 6683), witness: { source: "fath-al-bari", volume: 8, volumeLabel: "8", page: 124, quote: "وَإِنَّمَا قَالَ أَبُو قَتَادَةَ ذَلِكَ لَمَّا أَلَحَّ عَلَيْهِ كَعْبٌ", url: "https://shamela.ws/book/1673/4471" } },
            { text: sahih('bukhari', 4418, 6712, 6776) },
          ] },
        { title: "كتاب ملك غسان", text: sahih('bukhari', 4418, 6777, 7365), people: ['kaab-ibn-malik'],
          turns: [
            { text: sahih('bukhari', 4418, 6777, 6978), speaker: { name: "نبطي من أنباط أهل الشأم" }, lead: sahih('bukhari', 4418, 6777, 6938) },
            { text: sahih('bukhari', 4418, 6979, 7251) },
            { text: sahih('bukhari', 4418, 7252, 7313), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 7252, 7280), teller: true },
            { text: sahih('bukhari', 4418, 7314, 7365) },
          ] },
        { title: "«أن تعتزل امرأتك»", text: sahih('bukhari', 4418, 7366, 7782), people: ['kaab-ibn-malik', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 7366, 7537), speaker: { name: "رسول رسول الله ﷺ" }, lead: sahih('bukhari', 4418, 7366, 7475) },
            { text: sahih('bukhari', 4418, 7538, 7582), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 7538, 7547), teller: true },
            { text: sahih('bukhari', 4418, 7583, 7674) },
            { text: sahih('bukhari', 4418, 7675, 7782), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 7675, 7697), teller: true },
          ] },
        { title: "امرأة هلال بن أمية", text: sahih('bukhari', 4418, 7783, 8592), people: ['prophet-muhammad', 'kaab-ibn-malik'],
          turns: [
            { text: sahih('bukhari', 4418, 7783, 7983), speaker: { name: "امرأة هلال بن أمية" }, lead: sahih('bukhari', 4418, 7783, 7866) },
            { text: sahih('bukhari', 4418, 7984, 8162) },
            { text: sahih('bukhari', 4418, 8163, 8306), speaker: { name: "بعض أهلي" }, lead: sahih('bukhari', 4418, 8163, 8190) },
            { text: sahih('bukhari', 4418, 8307, 8461), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 8307, 8316), teller: true },
            { text: sahih('bukhari', 4418, 8462, 8592) },
          ] },
        { title: "«يا كعب بن مالك، أبشر»", text: sahih('bukhari', 4418, 8593, 9500), people: ['kaab-ibn-malik', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 8593, 8834) },
            { text: sahih('bukhari', 4418, 8835, 8941), speaker: { name: "صارخ" }, lead: sahih('bukhari', 4418, 8835, 8906) },
            { text: sahih('bukhari', 4418, 8942, 9500) },
          ] },
        { title: "قام إلي طلحة", text: sahih('bukhari', 4418, 9501, 9928), people: ['kaab-ibn-malik', 'talhah-ibn-ubaydullah', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 9501, 9652), speaker: { name: "الناس" }, lead: sahih('bukhari', 4418, 9501, 9616) },
            { text: sahih('bukhari', 4418, 9653, 9928) },
          ] },
        { title: "«أبشر بخير يوم مر عليك منذ ولدتك أمك»", text: sahih('bukhari', 4418, 9929, 10347), people: ['kaab-ibn-malik', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 9929, 10114), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4418, 9929, 10047) },
            { text: sahih('bukhari', 4418, 10115, 10188), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 10115, 10129), teller: true },
            { text: sahih('bukhari', 4418, 10189, 10347) },
          ] },
        { title: "«أمسك عليك بعض مالك»", text: sahih('bukhari', 4418, 10348, 11076), people: ['kaab-ibn-malik', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 10348, 10382) },
            { text: sahih('bukhari', 4418, 10383, 10502), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 10383, 10390), teller: true },
            { text: sahih('bukhari', 4418, 10503, 10579), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4418, 10503, 10525) },
            { text: sahih('bukhari', 4418, 10580, 10633), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 10580, 10587), teller: true },
            { text: sahih('bukhari', 4418, 10634, 10774), speaker: { person: "kaab-ibn-malik", name: "كعب بن مالك" }, lead: sahih('bukhari', 4418, 10634, 10643), teller: true },
            { text: sahih('bukhari', 4418, 10775, 11076) },
          ] },
        { title: "فأنزل الله توبتهم", text: sahih('bukhari', 4418, 11077, 11668), people: ['kaab-ibn-malik', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 11077, 11668) },
          ] },
        { title: "«وعلى الثلاثة الذين خلفوا»", text: sahih('bukhari', 4418, 11669, 12161), people: ['kaab-ibn-malik', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4418, 11669, 12161) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default kaabIbnMalikAndTheThreeWhoStayedBehind;

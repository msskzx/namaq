import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

// He came the day the Prophet arrived, and the chapter puts his Islam in the
// first year alongside the mosque and the brotherhood. The story (owner,
// 2026-11-18) gives the chapter's three reports whole (al-Sira 1 pp288-289):
// Anas's (al-Bukhari), Anas's by Humayd (al-Bukhari, with al-Baqarah 97 recited),
// and his own «ليس بوجه كذاب» (صحيح). Al-Bukhari's own text of Humayd's report (3938) follows them,
// whole; Abd al-Aziz's longer one (3911) is told on hijra-to-medina.ts, as it begins with the arrival.
const islamOfAbdullahIbnSalam = {
  kind: 'EVENT',
  slug: 'islam-of-abdullah-ibn-salam',
  name: 'إسلام عبد الله بن سلام',
  nameTransliterated: 'Islam of Abdullah ibn Salam',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 1, claims: ['ibn-salam/islam'] },
    description: {
      value:
        'لما قدم رسول الله صلى الله عليه وسلم المدينة جاءه عبد الله بن سلام فقال: أشهد أنك رسول الله حقا. وكان أول ما سمعه منه: (أيها الناس، أطعموا الطعام، وأفشوا السلام، وصلوا الأرحام، وصلوا بالليل والناس نيام، تدخلوا الجنة بسلام) .',
      claims: ['ibn-salam/islam'],
    },
  },
  people: [
    { person: 'abdullah-ibn-salam', claims: ['ibn-salam/islam'] },
    { person: 'prophet-muhammad', claims: ['ibn-salam/islam'] },
  ],
  tags: ['ISLAM', 'HIS_WORDS'],
  ayat: [
    {
      kind: 'RECITED',
      report: 'في رواية حميد عن أنس',
      from: '2:97',
      to: '2:97',
      evidence: [{ source: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 288, url: 'https://shamela.ws/book/10906/426', quote: "ثم قرأ: {قُلْ مَنْ كَانَ عَدُوًّا لِجِبْرِيلَ فَإِنَّهُ نَزَّلَهُ عَلَى قَلْبِكَ} [البقرة: ٩٧]" }],
    },
  ],
  reports: [
    {
      isnad: "قال عبد العزيز بن صهيب، عن أنس، قال:",
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 288, url: 'https://shamela.ws/book/10906/426' },
      grading: "أخرجه البخاري بأطول منه.",
      moments: [
        { title: "سلهم عني", text: "جاء عبد الله بن سلام فقال: أشهد أنك رسول الله حقا. ولقد علمت يهود أني سيدهم وابن سيدهم، وأعلمهم وابن أعلمهم، فادعهم فسلهم عني قبل أن يعلموا أني قد أسلمت.", people: ["abdullah-ibn-salam", "prophet-muhammad"] },
        { title: "سألهم عنه", text: "فأرسل إليهم فأتوا، فقال لهم: \"يا معشر يهود، ويلكم اتقوا الله، فوالذي لا إله إلا هو إنكم لتعلمون أني رسول الله فأسلموا\". قالوا: ما نعلمه، فأعاد ذلك عليهم ثلاثا. ثم قال: \"فأي رجل فيكم عبد الله بن سلام\"؟ قالوا: ذلك سيدنا وابن سيدنا، وأعلمنا وابن أعلمنا. قال: \"أفرأيتم إن أسلم\"؟ قالوا: حاش لله، ما كان ليسلم.", people: ["prophet-muhammad", "abdullah-ibn-salam"] },
        { title: "خرج عليهم", text: "قال: \"يابن سلام اخرج عليهم\". فخرج عليهم، فقال: ويلكم اتقوا الله، فوالذي لا إله إلا هو إنكم لتعلمون أنه رسول الله حقا، قالوا: كذبت. فأخرجهم رسول الله صلى الله عليه وسلم.", people: ["abdullah-ibn-salam", "prophet-muhammad"] },
      ],
    },
    {
      isnad: "وأخرج من حديث حميد عن أنس، قال:",
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 288, endPage: 289, url: 'https://shamela.ws/book/10906/426' },
      moments: [
        { title: "ثلاث لا يعلمهن إلا نبي", text: "سمع عبد الله بن سلام بقدوم رسول الله صلى الله عليه وسلم، وهو في أرض، فأتى النبي صلى الله عليه وسلم فقال: إني سائلك عن ثلاث لا يعلمهن إلا نبي: ما أول أشراط الساعة؟ وما أول طعام أهل الجنة؟ وما ينزع الولد إلى أبيه أو إلى أمه؟", people: ["abdullah-ibn-salam", "prophet-muhammad"] },
        { title: "جواب النبي ﷺ", text: "قال: \"أخبرني بهن جبريل آنفا\". قال: ذاك عدو اليهود من الملائكة. قال: ثم قرأ: {قُلْ مَنْ كَانَ عَدُوًّا لِجِبْرِيلَ فَإِنَّهُ نَزَّلَهُ عَلَى قَلْبِكَ} [البقرة: ٩٧] ، \"أما أول أشراط الساعة، فنار تخرج على الناس من المشرق إلى المغرب. وأما أول طعام يأكله أهل الجنة فزيادة كبد حوت. وغذا سبق ماء الرجل ماء المرأة نزع الولد إلى أبيه، وإذا سبق ماء المرأة نزع إلى أمه\".", people: ["prophet-muhammad", "abdullah-ibn-salam"] },
        { title: "قوم بهت", text: "فتشهد وقال: إن اليهود قوم بهت، وإنهم إن يعلموا بإسلامي قبل أن تسألهم عني بهتوني. فجاءوا، فقال: \"أي رجل عبد الله بن سلام فيكم\" قالوا: خيرنا وابن خيرنا، وسيدنا وابن سيدنا. قال: \"أرأيتم إن أسلم\"؟ قالوا: أعاذه الله من ذلك. فخرج فقال: أشهد أن لا إله إلا الله، وأن محمدا رسول الله. فقالوا: شرنا وابن شرنا، وتنقصوه. قال: هذا الذي كنت أخاف يا رسول الله.", people: ["abdullah-ibn-salam", "prophet-muhammad"] },
      ],
    },
    {
      isnad: "وقال عوف الأعرابي، عن زرارة بن أوفى، عن عبد الله بن سلام قال:",
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 289, url: 'https://shamela.ws/book/10906/427' },
      grading: "صحيح.",
      moments: [
        { title: "ليس بوجه كذاب", text: "لما قدم رسول الله صلى الله عليه وسلم المدينة انجفل الناس قبله، قالوا: قدم رسول الله صلى الله عليه وسلم. فجئت لأنظر، فلما رأيته عرفت أن وجهه ليس بوجه كذاب.", people: ["abdullah-ibn-salam", "prophet-muhammad"] },
        { title: "أول ما سمعه منه", text: "فكان أول شيء سمعته منه أن قال: \"أيها الناس، أطعموا الطعام، وأفشوا السلام، وصلوا الأرحام، وصلوا بالليل والناس نيام، تدخلوا الجنة بسلام\".", people: ["prophet-muhammad", "abdullah-ibn-salam"] },
      ],
    },
    {
      isnad: sahih('bukhari', 3938, 0, 102),
      source: { slug: 'sahih-al-bukhari', hadith: 3938, url: 'https://sunnah.com/bukhari:3938' },
      moments: [
        { title: "ثلاث لا يعلمهن إلا نبي", text: sahih('bukhari', 3938, 103, 441), people: ['abdullah-ibn-salam', 'prophet-muhammad'] },
        { title: "«أخبرني به جبريل آنفا»", text: sahih('bukhari', 3938, 442, 887), people: ['prophet-muhammad', 'abdullah-ibn-salam'] },
        { title: "«إن اليهود قوم بهت»", text: sahih('bukhari', 3938, 888, 1073), people: ['abdullah-ibn-salam', 'prophet-muhammad'] },
        { title: "«شرنا وابن شرنا»", text: sahih('bukhari', 3938, 1074, 1610), people: ['prophet-muhammad', 'abdullah-ibn-salam'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfAbdullahIbnSalam;

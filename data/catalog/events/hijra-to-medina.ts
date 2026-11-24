import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

// docs/plans/time-layer.md
/**
 * Told as a story from Sahih al-Bukhari's chapter on the hijra (Manaqib al-Ansar), each hadith whole: Aisha's 3905 first,
 * from Ibn al-Dughunnah's protection to the coast road, then 3906, al-Zuhri's continuation (Suraqa, the arrival at Banu
 * Amr ibn Awf, the mosque), then the shorter tellings in the order of the journey: Asma's belt (3907), the cave (3922),
 * Abu Bakr's account to Azib (3917, with al-Bara's 3918 that follows it), al-Bara's 3908, Anas's 3911 (whose second half
 * is Abd Allah ibn Salam's islam, which al-Dhahabi's report there tells «بأطول منه») and al-Bara's 3925 on who came
 * first. Suraqa, Ibn al-Dughunnah, Amir ibn Fuhayrah and Abd Allah ibn Abi Bakr have no catalog subject and are not
 * linked; the «سعد» of 3925 is not named further and is not linked.
 */
const hijraToMedina = {
  kind: 'EVENT',
  slug: 'hijra-to-medina',
  name: 'هجرة إلى المدينة',
  nameTransliterated: 'Hijra to Medina',
  type: 'HIJRA',
  fields: {},
  dateParts: { hijriMonth: { value: 3, claims: ['sira/hijra-madinah'] } },
  people: [
    { person: 'az-zubayr-ibn-al-awwam', claims: ['zubayr/hijra-madinah'] },
    { person: 'abdur-rahman-ibn-awf', claims: ['awf/hijra-madinah'] },
    { person: 'prophet-muhammad', claims: ['sira/hijra-madinah'] },
    { person: 'abu-bakr-as-siddiq', claims: ['abu-bakr/hijra-cave'] },
    // Ibn Ishaq makes him the first of all of them, a year before the greater
    // Aqaba, not one of the party that left with the Prophet.
    { person: 'abu-salamah', claims: ['abu-salamah/hijra-madinah-first'] },
    { person: 'abu-ayyub-al-ansari', claims: ['abu-ayyub/hijra-host'] },
    { person: 'aisha-bint-abi-bakr' },
    { person: 'asma-bint-abi-bakr' },
    { person: 'asad-ibn-zurarah' },
    { person: 'al-baraa-ibn-azib' },
    { person: 'abdullah-ibn-salam' },
    { person: 'musab-ibn-umayr' },
    { person: 'ibn-umm-maktum' },
    { person: 'bilal-ibn-rabah' },
    { person: 'ammar-ibn-yasir' },
    { person: 'umar-ibn-al-khattab' },
  ],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3905, 0, 194),
      source: { slug: 'sahih-al-bukhari', hadith: 3905, url: 'https://sunnah.com/bukhari:3905' },
      moments: [
        { title: "يأتينا طرفي النهار", text: sahih('bukhari', 3905, 195, 376), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "«إن مثلك لا يخرج ولا يخرج»", text: sahih('bukhari', 3905, 377, 971), people: ['abu-bakr-as-siddiq'] },
        { title: "«فليعبد ربه في داره»", text: sahih('bukhari', 3905, 972, 1761), people: ['abu-bakr-as-siddiq'] },
        { title: "مسجد بفناء داره", text: sahih('bukhari', 3905, 1762, 2076), people: ['abu-bakr-as-siddiq'] },
        { title: "أفزع ذلك أشراف قريش", text: sahih('bukhari', 3905, 2077, 2738), people: ['abu-bakr-as-siddiq'] },
        { title: "«وأرضى بجوار الله»", text: sahih('bukhari', 3905, 2739, 3120), people: ['abu-bakr-as-siddiq'] },
        { title: "«إني أريت دار هجرتكم»", text: sahih('bukhari', 3905, 3121, 3407), people: ['prophet-muhammad'] },
        { title: "«على رسلك»", text: sahih('bukhari', 3905, 3408, 3773), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "جاء متقنعا في نحر الظهيرة", text: sahih('bukhari', 3905, 3774, 4133), people: ['aisha-bint-abi-bakr', 'abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "«فإني قد أذن لي في الخروج»", text: sahih('bukhari', 3905, 4134, 4616), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "ذات النطاق", text: sahih('bukhari', 3905, 4617, 4860), people: ['aisha-bint-abi-bakr', 'asma-bint-abi-bakr'] },
        { title: "في غار في جبل ثور", text: sahih('bukhari', 3905, 4861, 5620), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "طريق السواحل", text: sahih('bukhari', 3905, 5621, 6130), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3906, 0, 213),
      source: { slug: 'sahih-al-bukhari', hadith: 3906, url: 'https://sunnah.com/bukhari:3906' },
      moments: [
        { title: "«أراها محمدا وأصحابه»", text: sahih('bukhari', 3906, 214, 769), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "عثرت بي فرسي", text: sahih('bukhari', 3906, 770, 1339), people: [] },
        { title: "ساخت يدا فرسي", text: sahih('bukhari', 3906, 1340, 1769), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "فناديتهم بالأمان", text: sahih('bukhari', 3906, 1770, 2019), people: ['prophet-muhammad'] },
        { title: "كتاب أمن", text: sahih('bukhari', 3906, 2020, 2398), people: ['prophet-muhammad'] },
        { title: "ثياب بياض", text: sahih('bukhari', 3906, 2399, 2645), people: ['prophet-muhammad', 'az-zubayr-ibn-al-awwam', 'abu-bakr-as-siddiq'] },
        { title: "«هذا جدكم الذي تنتظرون»", text: sahih('bukhari', 3906, 2646, 3218), people: ['prophet-muhammad'] },
        { title: "نزل في بني عمرو بن عوف", text: sahih('bukhari', 3906, 3219, 3456), people: ['prophet-muhammad'] },
        { title: "ظلل عليه بردائه", text: sahih('bukhari', 3906, 3457, 3772), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "المسجد الذي أسس على التقوى", text: sahih('bukhari', 3906, 3773, 3941), people: ['prophet-muhammad'] },
        { title: "«هذا إن شاء الله المنزل»", text: sahih('bukhari', 3906, 3942, 4324), people: ['prophet-muhammad', 'asad-ibn-zurarah'] },
        { title: "«بل نهبه لك»", text: sahih('bukhari', 3906, 4325, 4499), people: ['prophet-muhammad'] },
        { title: "«هذا الحمال لا حمال خيبر»", text: sahih('bukhari', 3906, 4500, 4850), people: ['prophet-muhammad'] },
        { title: "لم يتمثل ببيت تام غيره", text: sahih('bukhari', 3906, 4851, 4988), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3907, 0, 150),
      source: { slug: 'sahih-al-bukhari', hadith: 3907, url: 'https://sunnah.com/bukhari:3907' },
      moments: [
        { title: "ذات النطاقين", text: sahih('bukhari', 3907, 151, 358), people: ['asma-bint-abi-bakr', 'prophet-muhammad', 'abu-bakr-as-siddiq'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3922, 0, 123),
      source: { slug: 'sahih-al-bukhari', hadith: 3922, url: 'https://sunnah.com/bukhari:3922' },
      moments: [
        { title: "«اثنان الله ثالثهما»", text: sahih('bukhari', 3922, 124, 359), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3917, 0, 189),
      source: { slug: 'sahih-al-bukhari', hadith: 3917, url: 'https://sunnah.com/bukhari:3917' },
      moments: [
        { title: "سأله عازب عن مسيره", text: sahih('bukhari', 3917, 190, 312), people: ['abu-bakr-as-siddiq', 'al-baraa-ibn-azib', 'prophet-muhammad'] },
        { title: "رفعت لنا صخرة", text: sahih('bukhari', 3917, 313, 516), people: ['abu-bakr-as-siddiq'] },
        { title: "فرشت له فروة", text: sahih('bukhari', 3917, 517, 747), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "«هل أنت حالب؟»", text: sahih('bukhari', 3917, 748, 1026), people: ['abu-bakr-as-siddiq'] },
        { title: "فشرب حتى رضيت", text: sahih('bukhari', 3917, 1027, 1322), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3918, 0, 17),
      source: { slug: 'sahih-al-bukhari', hadith: 3918, url: 'https://sunnah.com/bukhari:3918' },
      moments: [
        { title: "«كيف أنت يا بنية»", text: sahih('bukhari', 3918, 18, 207), people: ['al-baraa-ibn-azib', 'abu-bakr-as-siddiq', 'aisha-bint-abi-bakr'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3908, 0, 146),
      source: { slug: 'sahih-al-bukhari', hadith: 3908, url: 'https://sunnah.com/bukhari:3908' },
      moments: [
        { title: "ساخت به فرسه", text: sahih('bukhari', 3908, 147, 351), people: ['prophet-muhammad'] },
        { title: "فعطش فمر براع", text: sahih('bukhari', 3908, 352, 517), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3911, 0, 164),
      source: { slug: 'sahih-al-bukhari', hadith: 3911, url: 'https://sunnah.com/bukhari:3911' },
      moments: [
        { title: "«هذا الرجل يهديني السبيل»", text: sahih('bukhari', 3911, 165, 579), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "«اللهم اصرعه»", text: sahih('bukhari', 3911, 580, 1032), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "«اركبا آمنين مطاعين»", text: sahih('bukhari', 3911, 1033, 1436), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "«أي بيوت أهلنا أقرب»", text: sahih('bukhari', 3911, 1437, 1977), people: ['prophet-muhammad', 'abu-ayyub-al-ansari', 'abdullah-ibn-salam'] },
        { title: "«فادعهم فاسألهم عني»", text: sahih('bukhari', 3911, 1978, 2370), people: ['abdullah-ibn-salam', 'prophet-muhammad'] },
        { title: "«أفرأيتم إن أسلم»", text: sahih('bukhari', 3911, 2371, 3103), people: ['prophet-muhammad', 'abdullah-ibn-salam'] },
        { title: "«كذبت»", text: sahih('bukhari', 3911, 3104, 3373), people: ['prophet-muhammad', 'abdullah-ibn-salam'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3925, 0, 161),
      source: { slug: 'sahih-al-bukhari', hadith: 3925, url: 'https://sunnah.com/bukhari:3925' },
      moments: [
        { title: "أول من قدم علينا", text: sahih('bukhari', 3925, 162, 402), people: ['musab-ibn-umayr', 'ibn-umm-maktum', 'bilal-ibn-rabah', 'ammar-ibn-yasir', 'umar-ibn-al-khattab'] },
        { title: "فرح أهل المدينة به", text: sahih('bukhari', 3925, 403, 667), people: ['prophet-muhammad', 'al-baraa-ibn-azib'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default hijraToMedina;

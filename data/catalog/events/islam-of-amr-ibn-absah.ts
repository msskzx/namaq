import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Amr ibn Abasah, sure in the Jahiliyyah that the people were astray, came to the Prophet ﷺ at Makkah while he was in
 * hiding, asked what he was and with whom, and was told to go back to his people until he heard he had prevailed; he
 * came to him at Madinah and asked him about the prayer and wudu, and told it to Abu Umamah. Told from Sahih Muslim 832
 * (Salat al-Musafirin), whole. Abu Umamah has no catalog subject and is not linked.
 */
const islamOfAmrIbnAbsah = {
  kind: 'EVENT',
  slug: 'islam-of-amr-ibn-absah',
  name: "إسلام عمرو بن عبسة",
  nameTransliterated: "The Islam of Amr ibn Abasah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'amr-ibn-absah' }, { person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'bilal-ibn-rabah' }],
  tags: ['ISLAM', 'HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 832, 0, 435),
      source: { slug: 'sahih-muslim', hadith: 832, url: 'https://sunnah.com/muslim:832' },
      moments: [
        { title: "«أظن أن الناس على ضلالة»", text: sahih('muslim', 832, 436, 580), people: ['amr-ibn-absah'],
          turns: [
            { text: sahih('muslim', 832, 436, 580) },
          ] },
        { title: "رجل بمكة يخبر أخبارا", text: sahih('muslim', 832, 581, 791), people: ['amr-ibn-absah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 832, 581, 791) },
          ] },
        { title: "«ما أنت؟» «أنا نبي»", text: sahih('muslim', 832, 792, 1046), people: ['amr-ibn-absah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 832, 792, 818), speaker: { person: "amr-ibn-absah", name: "عمرو بن عبسة" }, lead: sahih('muslim', 832, 792, 806), teller: true },
            { text: sahih('muslim', 832, 819, 840), speaker: { person: "prophet-muhammad", name: "ذلك الرجل" }, lead: sahih('muslim', 832, 819, 824), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 225, quote: "فإذا) هو (رسول الله ﷺ مستخفيًا) … (قال) لي ذلك الرجل (أنا نبي)", url: "https://shamela.ws/book/18268/4024" } },
            { text: sahih('muslim', 832, 841, 865), speaker: { person: "amr-ibn-absah", name: "عمرو بن عبسة" }, lead: sahih('muslim', 832, 841, 850), teller: true },
            { text: sahih('muslim', 832, 866, 893), speaker: { person: "prophet-muhammad", name: "ذلك الرجل" }, lead: sahih('muslim', 832, 866, 871), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 226, quote: "(قال) ذلك الرجل معناه أنا رسول (أرسلني الله)", url: "https://shamela.ws/book/18268/4025" } },
            { text: sahih('muslim', 832, 894, 932), speaker: { person: "amr-ibn-absah", name: "عمرو بن عبسة" }, lead: sahih('muslim', 832, 894, 903), teller: true },
            { text: sahih('muslim', 832, 933, 1046), speaker: { person: "prophet-muhammad", name: "ذلك الرجل" }, lead: sahih('muslim', 832, 933, 938), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 226, quote: "(وبأي شيء أرسلك؟ قال: أرسلني بصلة الأرحام) … قال الأبي: قد صح أن جواباته ﷺ تكون بحسب السائل", url: "https://shamela.ws/book/18268/4025" } },
          ] },
        { title: "«حر وعبد»", text: sahih('muslim', 832, 1047, 1179), people: ['amr-ibn-absah', 'prophet-muhammad', 'abu-bakr-as-siddiq', 'bilal-ibn-rabah'],
          turns: [
            { text: sahih('muslim', 832, 1047, 1086), speaker: { person: "amr-ibn-absah", name: "عمرو بن عبسة" }, lead: sahih('muslim', 832, 1047, 1059), teller: true },
            { text: sahih('muslim', 832, 1087, 1109), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('muslim', 832, 1087, 1092), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 226, quote: "(قال) النبي ﷺ معي على هذا التوحيد (حر وعبد", url: "https://shamela.ws/book/18268/4025" } },
            { text: sahih('muslim', 832, 1110, 1179) },
          ] },
        { title: "«ارجع إلى أهلك»", text: sahih('muslim', 832, 1180, 1379), people: ['amr-ibn-absah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 832, 1180, 1209), speaker: { person: "amr-ibn-absah", name: "عمرو بن عبسة" }, lead: sahih('muslim', 832, 1180, 1189), teller: true },
            { text: sahih('muslim', 832, 1210, 1379), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('muslim', 832, 1210, 1215), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 227, quote: "(قال) له النبي ﷺ (إنك)", url: "https://shamela.ws/book/18268/4026" } },
          ] },
        { title: "يتخبّر الأخبار", text: sahih('muslim', 832, 1380, 1799), people: ['amr-ibn-absah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 832, 1380, 1633) },
            { text: sahih('muslim', 832, 1634, 1699), speaker: { person: "amr-ibn-absah", name: "عمرو بن عبسة" }, lead: sahih('muslim', 832, 1634, 1643), teller: true },
            { text: sahih('muslim', 832, 1700, 1799) },
          ] },
        { title: "«أنت الذي لقيتني بمكة»", text: sahih('muslim', 832, 1800, 1968), people: ['amr-ibn-absah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 832, 1800, 1845) },
            { text: sahih('muslim', 832, 1846, 1891), speaker: { person: "amr-ibn-absah", name: "عمرو بن عبسة" }, lead: sahih('muslim', 832, 1846, 1855), teller: true },
            { text: sahih('muslim', 832, 1892, 1945), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 832, 1892, 1897), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 228, quote: "(فقلت: يا رسول الله أتعرفني قال) رسول الله ﷺ (نعم)", url: "https://shamela.ws/book/18268/4027" } },
            { text: sahih('muslim', 832, 1946, 1968), speaker: { person: "amr-ibn-absah", name: "عمرو بن عبسة" }, lead: sahih('muslim', 832, 1946, 1961), teller: true },
          ] },
        { title: "أوقات الصلاة", text: sahih('muslim', 832, 1969, 2714), people: ['amr-ibn-absah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 832, 1969, 2079), speaker: { person: "amr-ibn-absah", name: "عمرو بن عبسة" }, lead: sahih('muslim', 832, 1969, 1978), teller: true },
            { text: sahih('muslim', 832, 2080, 2714), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 832, 2080, 2085), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 228, quote: "(قال) رسول الله ﷺ له (صل صلاة الصبح)", url: "https://shamela.ws/book/18268/4027" } },
          ] },
        { title: "خطايا الوضوء", text: sahih('muslim', 832, 2715, 3583), people: ['amr-ibn-absah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 832, 2715, 2784), speaker: { person: "amr-ibn-absah", name: "عمرو بن عبسة" }, lead: sahih('muslim', 832, 2715, 2730), teller: true },
            { text: sahih('muslim', 832, 2785, 3583), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 832, 2785, 2790), witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 230, quote: "(قال) رسول الله ﷺ في جواب سؤالي (ما منكم)", url: "https://shamela.ws/book/18268/4029" } },
          ] },
        { title: "«انظر ما تقول»", text: sahih('muslim', 832, 3584, 3800), people: ['amr-ibn-absah'],
          turns: [
            { text: sahih('muslim', 832, 3584, 3677) },
            { text: sahih('muslim', 832, 3678, 3800), speaker: { name: "أبو أمامة" }, lead: sahih('muslim', 832, 3678, 3707) },
          ] },
        { title: "«ما بي حاجة أن أكذب على الله»", text: sahih('muslim', 832, 3801, 4169), people: ['amr-ibn-absah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 832, 3801, 4066), speaker: { person: "amr-ibn-absah", name: "عمرو" }, lead: sahih('muslim', 832, 3801, 3817) },
            { text: sahih('muslim', 832, 4067, 4097) },
            { text: sahih('muslim', 832, 4098, 4169), speaker: { person: "amr-ibn-absah", name: "عمرو" }, witness: { source: "kawkab-wahhaj", volume: 10, volumeLabel: "10", page: 232, quote: "(فقال عمرو) بن عبسة لأبي أمامة … (حتى عد) وذكر من الأعداد (سبع مرات) لي (ما حدثت به)", url: "https://shamela.ws/book/18268/4031" } },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfAmrIbnAbsah;

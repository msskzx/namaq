import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The first time the jinn heard the Quran: the Prophet ﷺ led his companions in Fajr at Nakhlah, on the way to Suq Ukaz,
 * the jinn heard, believed and went back to their people, and {قل أوحي إلي} was revealed (Ibn Abbas, al-Sira 1 p159,
 * «متفق عليه»). Ibn Abbas's «ما قرأ ... على الجن ولا رآهم» is shown as his, followed by al-Dhahabi's own reading of it
 * (pp159-160: «يعني أول ما سمعت الجن القرآن ... وابن مسعود قد حفظ القصتين»); the night the jinn's caller came and he
 * recited to them is its own story (the-night-of-the-jinn.ts). Zirr's report from Ibn Mas'ud (p160), which ties
 * {وإذ صرفنا إليك نفرا من الجن} (al-Ahqaf 29) to Nakhlah, is not placed in a Sahih, so it waits.
 */
const theJinnHearTheQuran = {
  kind: 'EVENT',
  slug: 'the-jinn-hear-the-quran',
  name: 'الجن يستمعون القرآن بنخلة',
  nameTransliterated: 'The jinn hear the Quran at Nakhlah',
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abdullah-ibn-masud' }],
  tags: ['ISLAM', 'HEARD_QURAN', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '72:1',
      to: '72:2',
      evidence: [
        { source: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 159, url: 'https://shamela.ws/book/10906/297', quote: 'وأنزل فيهم سورة الجن.' },
        { source: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 159, url: 'https://shamela.ws/book/10906/297', quote: 'فهنالك حين رجعوا إلى قومهم فقالوا: {إِنَّا سَمِعْنَا قُرْآَنًا عَجَبًا، يَهْدِي إِلَى الرُّشْدِ فَآَمَنَّا بِهِ وَلَنْ نُشْرِكَ بِرَبِّنَا أَحَدًا} ، فأنزلت: {قُلْ أُوحِيَ إِلَيَّ} [الجن: ١] ،' },
      ],
    },
  ],
  reports: [
    {
      isnad: 'وقال أبو بشر، عن سعيد بن جبير، عن ابن عباس قال:',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 159, url: 'https://shamela.ws/book/10906/297' },
      grading: 'متفق عليه.',
      moments: [
        { title: 'قول ابن عباس: ما قرأ عليهم ولا رآهم', text: 'ما قرأ رسول الله صلى الله عليه وسلم على الجن ولا رآهم،', people: [] },
        { title: 'إلى سوق عكاظ', text: 'انطلق رسول الله صلى الله عليه وسلم في طائفة من أصحابه عامدين إلى سوق عكاظ,', people: ['prophet-muhammad'] },
        { title: 'حيل بين الشياطين وخبر السماء', text: 'وقد حيل بين الشياطين وبين خبر السماء، وأرسلت عليهم الشهب، فرجعت الشياطين إلى قومهم، فقالوا: ما لكم؟ فقالوا: حيل بيننا وبين خبر السماء وأرسلت علينا الشهب، قالوا: ما حال بينكم وبين خبر السماء إلا شيء حدث، فاضربوا مشارق الأرض ومغاربها.', people: [] },
        { title: 'بنخلة في صلاة الفجر', text: 'قال: فانصرف أولئك النفر الذين توجهوا نحو تهامة إلى رسول الله وهو بنخلة، عامدا إلى سوق عكاظ، وهو يصلي بأصحابه صلاة الفجر،', people: ['prophet-muhammad'] },
        { title: '«هذا الذي حال بينكم وبين خبر السماء»', text: 'فلما سمعوا القرآن استمعوا له، فقالوا: هذا والله الذي حال بينكم وبين خبر السماء،', people: [] },
        { title: '{قل أوحي إلي}', text: 'فهنالك حين رجعوا إلى قومهم فقالوا: {إِنَّا سَمِعْنَا قُرْآَنًا عَجَبًا، يَهْدِي إِلَى الرُّشْدِ فَآَمَنَّا بِهِ وَلَنْ نُشْرِكَ بِرَبِّنَا أَحَدًا} ، فأنزلت: {قُلْ أُوحِيَ إِلَيَّ} [الجن: ١] ،', people: [] },
      ],
    },
    {
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 159, endPage: 160, url: 'https://shamela.ws/book/10906/297' },
      moments: [
        { title: 'قول الذهبي: يعني أول ما سمعت الجن القرآن', text: 'ويحمل قول ابن عباس: إن النبي صلى الله عليه وسلم ما قرأ على الجن ولا رآهم، يعني أول ما سمعت الجن القرآن، ثم إن داعي الجن أتى النبي صلى الله عليه وسلم كما في خبر ابن مسعود، وابن مسعود قد حفظ القصتين،', people: ['prophet-muhammad', 'abdullah-ibn-masud'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theJinnHearTheQuran;

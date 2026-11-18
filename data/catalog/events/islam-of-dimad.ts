import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Undated. He came to Mecca to treat what he had heard called madness and left
 * having given his hand on Islam -- and on his people's, which the Prophet
 * asked for and he gave.
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

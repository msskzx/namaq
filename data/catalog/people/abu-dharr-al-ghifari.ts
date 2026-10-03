import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. The chapter gives
// his Islam at length in two narrations; what the model has a place for is
// his own count of where he stood in it and the greeting he was first to
// give.
const abuDharrAlGhifari = {
  kind: 'PERSON',
  slug: 'abu-dharr-al-ghifari',
  name: 'أبو ذر الغفاري',
  nameTransliterated: 'Abu Dharr al-Ghifari',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['abu-dharr-al-ghifari-siyar10/sex'] },
    fullName: {
      value: 'جُنْدُبُ بنُ جُنَادَةَ الغِفَارِيُّ',
      claims: ['abu-dharr-al-ghifari-siyar10/full-name'],
    },
    kunya: { value: 'أَبُو ذَرٍّ', claims: ['abu-dharr-al-ghifari-siyar10/kunya'] },
    appearance: {
      value: 'كَانَ آدَمَ، ضَخْماً، جَسِيْماً، كَثَّ اللِّحْيَةِ. رَجُلٌ طُوَالٌ، آدَمُ، أَبْيَضُ الرَّأْسِ وَاللِّحْيَةِ',
      claims: ['abu-dharr-al-ghifari-siyar10/appearance'],
    },
    deathYearHijri: { value: '32', claims: ['abu-dharr-al-ghifari-siyar10/death-year'] },
    placeOfDeathArabic: { value: 'الرَّبَذَةِ', claims: ['abu-dharr-al-ghifari-siyar10/death-place'] },
  },
  virtues: [
    {
      value:
        'أحد السابقين الأولين، من نجباء أصحاب محمد صلى الله عليه وسلم؛ رابع الإسلام، أسلم قبله ثلاثة؛ أول من حيا رسول الله بتحية الإسلام؛ رأس في الزهد والصدق والعلم والعمل، قوال بالحق لا تأخذه في الله لومة لائم؛ ما أقلت الغبراء ولا أظلت الخضراء من رجل أصدق لهجة منه؛ من سره أن ينظر إلى زهد عيسى فلينظر إليه؛ بايعه رسول الله خمساً وواثقه سبعاً ألا يخاف في الله لومة لائم؛ رحم الله أبا ذر يمشي وحده ويموت وحده ويبعث وحده؛ كان يفتي في خلافة أبي بكر وعمر وعثمان.',
      claims: ['abu-dharr/rubu-al-islam', 'abu-dharr-al-ghifari-siyar10/virtues'],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['abu-dharr-al-ghifari-siyar10/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'junadah-ibn-sufyan-al-ghifari',
      claims: ['abu-dharr-al-ghifari-siyar10/father'],
    },
    {
      type: 'BROTHER',
      inverse: 'BROTHER',
      to: 'unays-ibn-junadah-al-ghifari',
      claims: ['abu-dharr-al-ghifari-siyar10/brother-unays'],
    },
  ],
} satisfies CatalogPerson;

export default abuDharrAlGhifari;

import type { CatalogUtterance } from '@/lib/catalog/types';

/**
 * The qasida, and the chapter quotes it in two runs with its own break between
 * them: قال قصيدته التي منها, then وفيها يقول. The citation keeps that break as
 * an ellipsis rather than joining the two into a poem the source did not print.
 *
 * Two of its lines are `abu-talib-yustasqa-al-ghamam`, which chapter one quotes
 * seventy pages earlier with different wording: ربيع اليتامى and نعمة وفضائل
 * there, ثمال اليتامى and رحمة وفواضل here. Two records, because the source
 * prints two quotations and a citation is of what was printed.
 */
const abuTalibLamiyyah = {
  kind: 'UTTERANCE',
  slug: 'abu-talib-lamiyyah',
  utteranceKind: 'POETRY',
  speaker: 'abu-talib',
  subject: 'prophet-muhammad',
  textArabic: {
    value: [
      'ولما رأيت القوم لا ود فيهم ... وقد قطعوا كل العرى والوسائل',
      'وقد صارحونا بالعداوة والأذى ... وقد طاوعوا أمر العدو المزايل',
      'صبرت لهم نفسي بسمراء سمحة ... وأبيض عضب من تراث المقاول',
      'وأحضرت عند البيت رهطي وإخوتي ... وأمسكت من أثوابه بالوصائل',
      'أعوذ برب الناس من كل طاعن ... علينا بسوء أو ملح بباطل',
      '...',
      'كذبتم وبيت الله نبزى محمدا ... ولما نطاعن دونه ونناضل',
      'ونسلمه حتى نصرع حوله ... ونذهل عن أبنائنا والحلائل',
      'وينهض قوم نحوكم غير عزل ... ببيض حديث عهدها بالصياقل',
      'وأبيض يستسقى الغمام بوجهه ... ثمال اليتامى عصمة للأرامل',
      'يلوذ به الهلاك من آل هاشم ... فهم عنده في رحمة وفواضل',
      'لعمري لقد كلفت وجدا بأحمد ... وإخوته دأب المحب المواصل',
      'فمن مثله في الناس أي مؤمل ... إذا قاسه الحكام عند التفاضل',
      'حليم رشيد عادل غير طائش ... يوالي إلها ليس عنه بغافل',
      'فوالله لولا أن أجيء بسبة ... تجر على أشياخنا في المحافل',
      'لكنا اتبعناه على كل حالة ... من الدهر جدا غير قول التهازل',
      'لقد علموا أن ابننا لا مكذب ... لدينا ولا يعنى بقول الأباطل',
      'فأصبح فينا أحمد ذو أرومة ... يقصر عنها سورة المتطاول',
      'حدبت بنفسي دونه وحميته ... ودافعت عنه بالذرى والكلاكل',
      'جزى الله عنا عبد شمس ونوفلا ... عقوبة شر عاجلا غير آجل'
    ].join('\n'),
    claims: ['abu-talib/verses-lamiyyah'],
  },
  fields: {
    occasion: {
      value: 'قالها لما خشي دهماء العرب أن يركبوه مع قومه حين انتشر ذكر النبي صلى الله عليه وسلم.',
      claims: ['abu-talib/verses-lamiyyah'],
    },
  },
} satisfies CatalogUtterance;

export default abuTalibLamiyyah;

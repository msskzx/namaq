import type { CatalogUtterance } from '@/lib/catalog/types';

// The man his people called الكامل, who met the Prophet at the mawsim and
// offered him مجلة لقمان. The chapter gives these lines to place him, not to
// tie them to that meeting.
const suwaydIbnAsSamitAlaRubbaMan = {
  kind: 'UTTERANCE',
  slug: 'suwayd-ibn-as-samit-ala-rubba-man',
  utteranceKind: 'POETRY',
  textArabic: {
    value: [
      'ألا رب من تدعو صديقا ولو ترى ... مقالته بالغيب ساءك ما يفرى',
      'مقالته كالشهد ما كان شاهدا ... وبالغيب مأثور على ثغرة النحر',
      'يسرك باديه وتحت أديمه ... تميمة غش تبترى عقب الظهر',
      'تبين لك العينان ما هو كاتم ... من الغل والبغضاء بالنظر الشزر',
      'فرشني بخير طالما قد بريتني ... وخير الموالي من يريش ولا يبري',
    ].join('\n'),
    claims: ['sira/verses-suwayd-ibn-as-samit'],
  },
  fields: {
    speakerName: { value: 'سويد بن الصامت', claims: ['sira/verses-suwayd-ibn-as-samit'] },
    occasion: { value: 'هو الذي عرض على النبي صلى الله عليه وسلم مجلة لقمان فتلا عليه القرآن.', claims: ['sira/verses-suwayd-ibn-as-samit'] },
  },
} satisfies CatalogUtterance;

export default suwaydIbnAsSamitAlaRubbaMan;

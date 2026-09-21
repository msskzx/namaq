import type { CatalogUtterance } from '@/lib/catalog/types';

// Said on the return from Tabuk, after he asked leave to praise him and was
// answered لا يفضض الله فاك. The occasion is the answer, not the poem.
const abbasMinQablihaTibta = {
  kind: 'UTTERANCE',
  slug: 'abbas-min-qabliha-tibta',
  utteranceKind: 'POETRY',
  speaker: 'al-abbas-ibn-abd-al-muttalib',
  subject: 'prophet-muhammad',
  textArabic: {
    value: [
      'من قبلها طبت في الظلال وفي ... مستودع حيث يخصف الورق',
      'ثم هبطت البلاد لا بشر ... أنت ولا مضغة ولا علق',
      'بل نطفة تركب السفين وقد ... ألجم نسرا وأهله الغرق',
      'تنقل من صالب إلى رحم ... إذا مضى عالم بدا طبق',
      'حتى احتوى بيتك المهيمن من ... خندف علياء تحتها النطق',
      'وأنت لما ولدت أشرقت الـ ... ـأرض وضاءت بنورك الأفق',
      'فنحن في ذلك الضياء وفي النْـ ... ـنُور وسبل الرشاد نخترق'
    ].join('\n'),
    claims: ['abbas/verses-madh'],
  },
  fields: {
    occasion: {
      value: 'قال: يا رسول الله إني أريد أن أمتدحك، فقال: (لا يفضض الله فاك) ، فأنشدها.',
      claims: ['abbas/verses-madh'],
    },
  },
} satisfies CatalogUtterance;

export default abbasMinQablihaTibta;

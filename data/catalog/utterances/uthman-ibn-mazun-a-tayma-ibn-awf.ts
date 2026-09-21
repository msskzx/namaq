import type { CatalogUtterance } from '@/lib/catalog/types';

// Reproach rather than satire, and to his own cousin. Umayyah ibn Khalaf is
// the man who would own Bilal, and neither he nor the reproach's subject has a
// subject here.
const uthmanIbnMazunATaymaIbnAwf = {
  kind: 'UTTERANCE',
  slug: 'uthman-ibn-mazun-a-tayma-ibn-awf',
  utteranceKind: 'POETRY',
  speaker: 'uthman-ibn-mazun',
  textArabic: {
    value: [
      'أتيم بن عوف والذي جاء بغضة ... ومن دونه الشرمان والبرك أكتع',
      'أأخرجتني من بطن مكة أيمنا ... وأسكنتني في سرح بيضاء نقذع',
      'تريش نبالا لا يواتيك ريشها ... وتبري نبالا ريشها لك أجمع',
      'وحاربت أقواما كراما أعزة ... وأهلكت أقواما بهم كنت تفزع',
      'ستعلم إن نابتك يوما ملمة ... وأسلمك الأرياش ما كنت تصنع',
    ].join('\n'),
    claims: ['ibn-mazun/verses-umayyah'],
  },
  fields: {
    occasion: { value: 'عاتب بها أمية بن خلف ابن عمه، وكان يؤذيه.', claims: ['ibn-mazun/verses-umayyah'] },
  },
} satisfies CatalogUtterance;

export default uthmanIbnMazunATaymaIbnAwf;

import type { CatalogUtterance } from '@/lib/catalog/types';

// Her dream before Badr was called a lie by Abu Jahl and argued over for
// three days. She answered after the battle, not before.
const atikahAlamTakunArRuyaBiHaqq = {
  kind: 'UTTERANCE',
  slug: 'atikah-alam-takun-ar-ruya-bi-haqq',
  utteranceKind: 'POETRY',
  speaker: 'atikah-bint-abd-al-muttalib',
  battle: 'badr',
  textArabic: {
    value: [
      'ألم تكن الرؤيا بحق وجاءكم ... بتصديقها فل من القوم هارب',
      'فقلتم ولم أكذب كذبت وإنما ... يكذبنا بالصدق من هو كاذب',
    ].join('\n'),
    claims: ['atikah/verses-badr'],
  },
  fields: {
    occasion: { value: 'قالتها بعد بدر وقد كذبوا رؤياها التي رأتها قبله.', claims: ['atikah/verses-badr'] },
  },
} satisfies CatalogUtterance;

export default atikahAlamTakunArRuyaBiHaqq;

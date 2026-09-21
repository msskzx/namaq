import type { CatalogUtterance } from '@/lib/catalog/types';

// Ibn Ishaq gives these as what he said on leaving his people's religion, and
// says فِي أبيات: the chapter prints two lines of a longer poem, so what is
// recorded is what is printed.
const zaydIbnAmrArabbanWahidan = {
  kind: 'UTTERANCE',
  slug: 'zayd-ibn-amr-arabban-wahidan',
  utteranceKind: 'POETRY',
  speaker: 'zayd-ibn-amr-ibn-nufayl',
  textArabic: {
    value: [
      'أربا واحدا أم ألف رب ... أدين إذا تقسمت الأمور',
      'عزلت اللات والعزى جميعا ... كذلك يفعل الجلد الصبور',
    ].join('\n'),
    claims: ['zayd-amr/verses-arabban'],
  },
  fields: {
    occasion: { value: 'قاله في فراق دين قومه.', claims: ['zayd-amr/verses-arabban'] },
  },
} satisfies CatalogUtterance;

export default zaydIbnAmrArabbanWahidan;

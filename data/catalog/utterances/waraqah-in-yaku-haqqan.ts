import type { CatalogUtterance } from '@/lib/catalog/types';

// His second, after she told him what she had heard. The first waits for the
// revelation; this one says it has come.
const waraqahInYakuHaqqan = {
  kind: 'UTTERANCE',
  slug: 'waraqah-in-yaku-haqqan',
  utteranceKind: 'POETRY',
  speaker: 'waraqah-ibn-nawfal',
  subject: 'prophet-muhammad',
  textArabic: {
    value: [
      'إن يك حقا يا خديجة فاعلمي ... حديثك إيانا فأحمد مرسل',
      'وجبريل يأتيه وميكال معهما ... من الله وحي يشرح الصدر منزل',
      'يفوز به من فاز فيها بتوبة ... ويشقى به العاني الغوي المظلل',
      'فسبحان من تهوى الرياح بأمره ... ومن هو في الأيام ما شاء يفعل',
      'ومن عرشه فوق السماوات كلها ... وأقضاؤه في خلقه لا تبدل'
    ].join('\n'),
    claims: ['sira/verses-waraqah-in-yaku'],
  },
  fields: {},
} satisfies CatalogUtterance;

export default waraqahInYakuHaqqan;

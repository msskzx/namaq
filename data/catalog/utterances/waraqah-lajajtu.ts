import type { CatalogUtterance } from '@/lib/catalog/types';

/**
 * Waraqah ibn Nawfal has no subject in the app yet, so his name is text here.
 * That is a statement about the catalog and not about him: he is all through
 * this chapter, and an entry of his own would move both his poems onto a link.
 */
const waraqahLajajtu = {
  kind: 'UTTERANCE',
  slug: 'waraqah-lajajtu',
  utteranceKind: 'POETRY',
  subject: 'prophet-muhammad',
  textArabic: {
    value: [
      'لججت وكنت في الذكرى لجوجا ... لهم طالما بعث النشيجا',
      'ووصف من خديجة بعد وصف ... فقد طال انتظاري يا خديجا',
      'ببطن المكتين على رجائي ... حديثك أن أرى منه خروجا',
      'بما خبرتا من قول قس ... من الرهبان أكره أن يعوجا',
      'بأن محمدا سيسود قوما ... ويخصم من يكون له حجيجا',
      'ويظهر في البلاد ضياء نور ... يقيم به البرية أن تموجا',
      'فيلقى من يحاربه خسارا ... ويلقى من يسالمه فلوجا',
      'فيا ليتني إذا ما كنت ذاكم ... شهدت فكنت أولهم ولوجا',
      'فإن يبقوا وأبق تكن أمور ... يضج الكافرون لا ضجيجا'
    ].join('\n'),
    claims: ['sira/verses-waraqah-lajajtu'],
  },
  fields: {
    speakerName: { value: 'ورقة بن نوفل', claims: ['sira/verses-waraqah-lajajtu'] },
    occasion: {
      value: 'قالها وهو يستبطئ الأمر بعد أن حدثته خديجة بقول الراهب وإظلال الملكين.',
      claims: ['sira/verses-waraqah-lajajtu'],
    },
  },
} satisfies CatalogUtterance;

export default waraqahLajajtu;

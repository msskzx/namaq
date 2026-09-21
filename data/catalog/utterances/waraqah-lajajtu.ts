import type { CatalogUtterance } from '@/lib/catalog/types';

/**
 * Waraqah has a subject now, so the speaker is a link rather than a name. He
 * had been text here only because nothing in the catalog held him.
 */
const waraqahLajajtu = {
  kind: 'UTTERANCE',
  slug: 'waraqah-lajajtu',
  utteranceKind: 'POETRY',
  speaker: 'waraqah-ibn-nawfal',
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
    occasion: {
      value: 'قالها وهو يستبطئ الأمر بعد أن حدثته خديجة بقول الراهب وإظلال الملكين.',
      claims: ['sira/verses-waraqah-lajajtu'],
    },
  },
} satisfies CatalogUtterance;

export default waraqahLajajtu;

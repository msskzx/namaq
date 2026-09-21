import type { CatalogUtterance } from '@/lib/catalog/types';

// Said after Ibn Ishaq counts the whole company at Abyssinia, eighty-three men.
// It is not tied to either crossing, so it carries no event: the chapter gives
// it for the emigration as a whole.
const abdullahIbnAlHarithYaRakiban = {
  kind: 'UTTERANCE',
  slug: 'abdullah-ibn-al-harith-ya-rakiban',
  utteranceKind: 'POETRY',
  textArabic: {
    value: [
      'يا راكبا بلغن عني مغلغلة ... من كان يرجو بلاغ الله والدين',
      'كل امرئ من عباد الله مضطهد ... ببطن مكة مقهور ومفتون',
      'أنا وجدنا بلاد الله واسعة ... تنجي من الذل والمخزاة والهون',
      'فلا تقيموا على ذل الحياة وخز ... ي في الممات وعيب غير مأمون',
      'إنا تبعنا نبي الله واطرحوا ... قول النبي وعالوا في الموازين',
      'فاجعل عذابك في القوم الذي بغوا ... وعائذ بك أن يعلوا فيطغوني',
    ].join('\n'),
    claims: ['sira/verses-ibn-al-harith-habashah'],
  },
  fields: {
    speakerName: { value: 'عبد الله بن الحارث بن قيس السهمي', claims: ['sira/verses-ibn-al-harith-habashah'] },
    occasion: { value: 'قالها وقد لحق بأرض الحبشة من لحق، فعبدوا الله وحمدوا جوار النجاشي.', claims: ['sira/verses-ibn-al-harith-habashah'] },
  },
} satisfies CatalogUtterance;

export default abdullahIbnAlHarithYaRakiban;

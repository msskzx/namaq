import type { CatalogUtterance } from '@/lib/catalog/types';

/**
 * The first thing he said openly against the Prophet after coming back from
 * Mecca, which is why the chapter quotes it where it does: the killing is the
 * next section. Recorded as what he said, not as anything the app holds about
 * the woman it names.
 */
const kaabIbnAlAshrafADhahibunAnta = {
  kind: 'UTTERANCE',
  slug: 'kaab-ibn-al-ashraf-a-dhahibun-anta',
  utteranceKind: 'POETRY',
  event: 'killing-of-kaab-ibn-al-ashraf',
  textArabic: {
    value: [
      'أذاهب أنت لم تحلل بمنقبة ... وتارك أنت أم الفضل بالحرم',
      'صفراء رادعة لو تعصر انعصرت ... من ذي البوارير والحناء والكتم',
      'إحدى بني عامر هام الفؤاد بها ... ولو تشاء شفت كعبا من السقم',
      '. . . لم أر شمسا قبل طلع ... حتى تبدت لنا في ليلة الظلم',
    ].join('\n'),
    claims: ['sira/verses-kaab-ibn-al-ashraf'],
  },
  fields: {
    speakerName: { value: 'كعب بن الأشرف', claims: ['sira/verses-kaab-ibn-al-ashraf'] },
    occasion: { value: 'أول ما خرج منه حين قدم المدينة معلنا بمعاداة النبي صلى الله عليه وسلم وهجائه.', claims: ['sira/verses-kaab-ibn-al-ashraf'] },
  },
} satisfies CatalogUtterance;

export default kaabIbnAlAshrafADhahibunAnta;

import { seg, type Story, type StoryEvent } from './story';

// The Quran does not retell his life as one story: it speaks to him as events happen.
// Events and their ayat follow the sirah and asbab al-nuzul; disputed ones are listed in
// /mnt/project-files/compare-refine/prophet-muhammad-draft.md for the owner's review.
const events: StoryEvent[] = [
  { phase: 0, title: 'بدء الوحي', segments: [seg(96, 1, 5), seg(74, 1, 7)] },
  { phase: 0, title: 'رؤية جبريل بالأفق', segments: [seg(53, 1, 12), seg(81, 19, 25)] },
  { phase: 0, title: 'فتور الوحي', segments: [seg(93, 1, 11)] },
  { phase: 0, title: 'إنذار عشيرته والجهر بالدعوة', segments: [seg(26, 214, 216), seg(15, 94, 95)] },
  { phase: 0, title: 'أبو لهب وامرأته', segments: [seg(111, 1, 5)] },
  { phase: 0, title: 'عبس وتولى', segments: [seg(80, 1, 10)] },
  { phase: 0, title: 'سؤالهم الآيات', segments: [seg(17, 90, 93), seg(25, 7, 8), seg(11, 12), seg(6, 8, 9)] },
  { phase: 0, title: 'انشقاق القمر', segments: [seg(54, 1, 3)] },
  { phase: 0, title: 'موت أبي طالب', segments: [seg(28, 56), seg(9, 113)] },
  { phase: 0, title: 'استماع الجن', segments: [seg(46, 29, 32), seg(72, 1, 19)] },
  { phase: 0, title: 'الإسراء والمعراج', segments: [seg(17, 1), seg(17, 60), seg(53, 13, 18)] },
  { phase: 1, title: 'مكرهم به ليخرجوه', segments: [seg(8, 30), seg(17, 76), seg(47, 13)] },
  { phase: 1, title: 'الغار والوعد بالعودة', segments: [seg(9, 40), seg(17, 80), seg(28, 85)] },
  { phase: 2, title: 'سرية نخلة', segments: [seg(2, 217)] },
  { phase: 2, title: 'بدر', segments: [seg(8, 1, 19), seg(8, 41, 51), seg(8, 67, 71), seg(3, 13), seg(3, 123, 127), seg(22, 19), seg(54, 45)] },
  { phase: 2, title: 'أحد', segments: [seg(3, 121, 122), seg(3, 128, 171), seg(4, 88)] },
  { phase: 2, title: 'حمراء الأسد', segments: [seg(3, 172, 175)] },
  { phase: 2, title: 'بنو النضير', segments: [seg(59, 1, 17), seg(5, 11)] },
  { phase: 2, title: 'الأحزاب', segments: [seg(33, 9, 25)] },
  { phase: 2, title: 'بنو قريظة', segments: [seg(33, 26, 27)] },
  { phase: 2, title: 'بنو المصطلق وقول ابن أبي', segments: [seg(63, 1, 8)] },
  { phase: 2, title: 'الحديبية', segments: [seg(48, 1, 29), seg(2, 196), seg(60, 10, 11)] },
  { phase: 2, title: 'فتح مكة', segments: [seg(110, 1, 3), seg(60, 1, 3), seg(60, 7, 9)] },
  { phase: 2, title: 'حنين', segments: [seg(9, 25, 27)] },
  { phase: 2, title: 'تبوك', segments: [seg(9, 38, 39), seg(9, 41, 66), seg(9, 81, 83), seg(9, 85, 96)] },
  { phase: 2, title: 'مسجد الضرار', segments: [seg(9, 107, 110)] },
  { phase: 2, title: 'الثلاثة الذين خلفوا', segments: [seg(9, 117, 119)] },
  { phase: 3, title: 'تحويل القبلة', segments: [seg(2, 142, 150)] },
  { phase: 3, title: 'المجادلة', segments: [seg(58, 1, 4)] },
  { phase: 3, title: 'حديث الإفك', segments: [seg(24, 11, 26)] },
  { phase: 3, title: 'وفد بني تميم', segments: [seg(49, 1, 5)] },
  { phase: 3, title: 'البراءة من المشركين', segments: [seg(9, 1, 5)] },
  { phase: 3, title: 'موت ابن أبي', segments: [seg(9, 80), seg(9, 84)] },
  { phase: 3, title: 'حجة الوداع', segments: [seg(5, 3)] },
  { phase: 4, title: 'زيد وزينب', segments: [seg(33, 36, 40)] },
  { phase: 4, title: 'أحكام بيته', segments: [seg(33, 6), seg(33, 50, 55)] },
  { phase: 4, title: 'الإيلاء والتخيير', segments: [seg(66, 1, 5), seg(33, 28, 34)] },
  { phase: 4, title: 'اسمه في القرآن', segments: [seg(47, 2)] },
];

export const MUHAMMAD: Story = {
  intro:
    'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. لا يقص القرآن سيرة النبي ﷺ قصةً واحدة، بل يخاطبه وينزل في الأحداث وقت وقوعها، فجمعنا هنا آيات الأحداث التي نزلت فيها على ما في كتب السيرة وأسباب النزول، في خمس مجموعات: البعثة بمكة، والهجرة، والغزوات، وأحداث المدينة، وبيته واسمه. وفيها كل آية ذُكر فيها اسمه محمد ﷺ. وفي نسبة بعض الآيات إلى أحداثها خلاف بين أهل العلم.',
  phases: ['البعثة بمكة', 'الهجرة', 'الغزوات', 'أحداث المدينة', 'بيته واسمه'],
  events,
};

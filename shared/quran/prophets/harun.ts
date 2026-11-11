import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'موسى يسأل ربه أخاه وزيرا', segments: [seg(20, 29, 36), seg(26, 12, 14), seg(28, 33, 35), seg(19, 53), seg(25, 35, 36)] },
  { phase: 1, title: 'اذهبا إلى فرعون', segments: [seg(20, 42, 48), seg(26, 15, 17), seg(23, 45, 48), seg(10, 75)] },
  { phase: 1, title: 'أرجه وأخاه: السحرة يؤمنون', segments: [seg(26, 36), seg(26, 46, 48), seg(7, 111), seg(7, 120, 122), seg(20, 70)] },
  { phase: 1, title: 'بيوت لقومكما بمصر والدعاء', segments: [seg(10, 87, 89)] },
  { phase: 2, title: 'اخلفني في قومي', segments: [seg(7, 142)] },
  { phase: 2, title: 'العجل: يا ابن أم', segments: [seg(20, 90, 94), seg(7, 150, 151)] },
  { phase: 2, title: 'لا أملك إلا نفسي وأخي', segments: [seg(5, 25)] },
  { phase: 2, title: 'التابوت وبقية آل موسى وآل هارون', segments: [seg(2, 248)] },
  { phase: 3, title: 'الفرقان والسلام عليهما', segments: [seg(37, 114, 122), seg(21, 48)] },
  { phase: 3, title: 'في سلسلة الأنبياء', segments: [seg(6, 84), seg(4, 163)] },
];

export const HARUN: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. هارون أخو موسى ووزيره، وأكثر خبره في قصة موسى. هنا كل آية ذُكر فيها هارون، والآيات التي خوطب فيها مع موسى أو ذُكر فيها أخاه. وتقسيم الآيات على الأحداث من عملنا.',
  phases: ['الوزير', 'مع موسى إلى فرعون', 'في بني إسرائيل', 'ذكره بين الأنبياء'],
  events,
};

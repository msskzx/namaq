import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'إني جاعل في الأرض خليفة', segments: [seg(2, 30)] },
  { phase: 0, title: 'خلقه من طين ونفخ الروح', segments: [seg(15, 26, 29), seg(38, 71, 72), seg(32, 7, 9), seg(3, 59)] },
  { phase: 0, title: 'خلق زوجه منه', segments: [seg(4, 1), seg(7, 189), seg(39, 6)] },
  { phase: 0, title: 'تعليمه الأسماء', segments: [seg(2, 31, 33)] },
  { phase: 1, title: 'السجود وإباء إبليس', segments: [seg(2, 34), seg(7, 11, 12), seg(15, 30, 33), seg(17, 61), seg(18, 50), seg(20, 116), seg(38, 73, 76)] },
  { phase: 1, title: 'طرد إبليس وإنظاره ووعيده', segments: [seg(7, 13, 18), seg(15, 34, 44), seg(17, 62, 65), seg(38, 77, 85), seg(34, 20, 21)] },
  { phase: 2, title: 'السكنى والنهي عن الشجرة', segments: [seg(2, 35), seg(7, 19), seg(20, 115), seg(20, 117, 119)] },
  { phase: 2, title: 'الوسوسة والأكل من الشجرة', segments: [seg(2, 36), seg(7, 20, 22), seg(20, 120, 121)] },
  { phase: 3, title: 'التوبة', segments: [seg(2, 37), seg(7, 23), seg(20, 122)] },
  { phase: 3, title: 'الهبوط إلى الأرض والهدى', segments: [seg(2, 38, 39), seg(7, 24, 25), seg(20, 123, 127)] },
  { phase: 4, title: 'ابنا آدم', segments: [seg(5, 27, 31)] },
  { phase: 4, title: 'الميثاق على ذريته', segments: [seg(7, 172, 173)] },
  { phase: 4, title: 'نداء بني آدم', segments: [seg(7, 26, 27), seg(7, 31), seg(7, 35, 36), seg(36, 60, 62), seg(17, 70)] },
  { phase: 4, title: 'اصطفاؤه وذريته', segments: [seg(3, 33, 34), seg(19, 58)] },
];

export const ADAM: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. أحداث القصة في خمس مجموعات: الخلق، والسجود، والجنة، والهبوط، وبنو آدم. وفيها كل آية ذُكر فيها آدم، وكل آية ذُكر فيها إبليس في القصة. وتقسيم الآيات على الأحداث من عملنا، وقد تدخل آية في حدث ولها صلة بغيره.',
  phases: ['الخلق', 'السجود', 'الجنة', 'الهبوط', 'بنو آدم'],
  events,
};

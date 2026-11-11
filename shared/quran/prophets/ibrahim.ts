import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'دعوة أبيه', segments: [seg(19, 41, 48), seg(6, 74), seg(9, 114)] },
  { phase: 0, title: 'الكوكب والقمر والشمس', segments: [seg(6, 75, 83)] },
  { phase: 0, title: 'محاجة قومه في الأصنام', segments: [seg(26, 69, 104), seg(21, 51, 56), seg(37, 83, 87), seg(29, 16, 23)] },
  { phase: 0, title: 'الذي حاجه في ربه', segments: [seg(2, 258)] },
  { phase: 0, title: 'كيف تحيي الموتى', segments: [seg(2, 260)] },
  { phase: 1, title: 'تكسير الأصنام', segments: [seg(21, 57, 67), seg(37, 88, 96)] },
  { phase: 1, title: 'النار بردا وسلاما', segments: [seg(21, 68, 70), seg(37, 97, 98), seg(29, 24, 25)] },
  { phase: 1, title: 'البراءة من قومه', segments: [seg(43, 26, 28), seg(60, 4, 6)] },
  { phase: 1, title: 'الهجرة إلى ربه', segments: [seg(29, 26), seg(21, 71), seg(37, 99, 100)] },
  { phase: 2, title: 'رؤيا الذبح والفداء', segments: [seg(37, 101, 111)] },
  { phase: 2, title: 'ضيف إبراهيم', segments: [seg(51, 24, 27), seg(11, 69, 70), seg(15, 51, 52)] },
  { phase: 2, title: 'البشرى بإسحاق', segments: [seg(11, 71, 73), seg(15, 53, 56), seg(51, 28, 30), seg(37, 112, 113)] },
  { phase: 2, title: 'الجدال في قوم لوط', segments: [seg(11, 74, 76), seg(15, 57, 60), seg(29, 31, 32), seg(51, 31, 34)] },
  { phase: 2, title: 'هبة إسحاق ويعقوب', segments: [seg(19, 49, 50), seg(21, 72, 73), seg(29, 27), seg(6, 84, 87)] },
  { phase: 3, title: 'الابتلاء والإمامة', segments: [seg(2, 124)] },
  { phase: 3, title: 'دعاء البلد الآمن', segments: [seg(14, 35, 41), seg(2, 126)] },
  { phase: 3, title: 'رفع القواعد مع إسماعيل', segments: [seg(2, 127, 129)] },
  { phase: 3, title: 'البيت ومقام إبراهيم', segments: [seg(2, 125), seg(3, 96, 97)] },
  { phase: 3, title: 'الأذان في الناس بالحج', segments: [seg(22, 26, 29)] },
  { phase: 4, title: 'ملة إبراهيم حنيفا', segments: [seg(2, 130, 131), seg(3, 95), seg(4, 125), seg(6, 161), seg(16, 123), seg(22, 78)] },
  { phase: 4, title: 'وصيته بنيه', segments: [seg(2, 132, 134)] },
  { phase: 4, title: 'ما كان يهوديا ولا نصرانيا', segments: [seg(3, 65, 68), seg(2, 135), seg(2, 140, 141)] },
  { phase: 4, title: 'كان أمة قانتا', segments: [seg(16, 120, 122)] },
  { phase: 4, title: 'ما أوحي إليه وصحفه', segments: [seg(2, 136), seg(3, 84), seg(4, 163), seg(42, 13), seg(53, 36, 37), seg(87, 18, 19)] },
  { phase: 4, title: 'إسماعيل صادق الوعد', segments: [seg(19, 54, 55), seg(21, 85, 86), seg(38, 48)] },
  { phase: 4, title: 'اسمه بين الأنبياء', segments: [seg(38, 45, 47), seg(3, 33, 34), seg(4, 54), seg(12, 6), seg(12, 38), seg(19, 58), seg(33, 7), seg(57, 26)] },
  { phase: 4, title: 'قومه بين الأمم المكذبة', segments: [seg(9, 70), seg(22, 43)] },
];

export const IBRAHIM: Story = {
  intro:
    'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. أحداث القصة في خمس مجموعات: دعوته وحجته، والأصنام والنار، والبشرى والذبح، والبيت الحرام، وملته وذريته. وفيها كل آية ذُكر فيها إبراهيم أو ابناه إسماعيل وإسحاق، فخبرهما يأتي في قصة أبيهما. وتقسيم الآيات على الأحداث من عملنا، وقد تدخل آية في حدث ولها صلة بغيره.',
  phases: ['دعوته وحجته', 'الأصنام والنار', 'البشرى والذبح', 'البيت الحرام', 'ملته وذريته'],
  events,
};

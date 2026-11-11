import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'إيمانه وهجرته', segments: [seg(29, 26)] },
  { phase: 0, title: 'النجاة إلى الأرض المباركة', segments: [seg(21, 71)] },
  { phase: 1, title: 'نهيه قومه عن الفاحشة', segments: [seg(26, 160, 166), seg(7, 80, 81), seg(27, 54, 55), seg(29, 28, 29), seg(54, 33), seg(54, 36)] },
  { phase: 1, title: 'جواب قومه: أخرجوهم', segments: [seg(26, 167), seg(7, 82), seg(27, 56)] },
  { phase: 1, title: 'دعاؤه ربه', segments: [seg(26, 168, 169), seg(29, 30)] },
  { phase: 2, title: 'الرسل عند إبراهيم', segments: [seg(11, 69, 76), seg(15, 51, 60), seg(29, 31, 32), seg(51, 24, 34)] },
  { phase: 2, title: 'مجيء الرسل إلى لوط', segments: [seg(11, 77), seg(15, 61, 64), seg(29, 33)] },
  { phase: 2, title: 'قومه يراودونه عن ضيفه', segments: [seg(11, 78, 80), seg(15, 67, 72), seg(54, 37)] },
  { phase: 2, title: 'الأمر بالسرى بأهله', segments: [seg(11, 81), seg(15, 65, 66)] },
  { phase: 3, title: 'نجاته وأهله إلا امرأته', segments: [seg(7, 83), seg(26, 170, 171), seg(27, 57), seg(37, 134, 135), seg(51, 35, 36), seg(54, 34, 35)] },
  { phase: 3, title: 'عاليها سافلها والحجارة', segments: [seg(11, 82, 83), seg(15, 73, 74), seg(7, 84), seg(26, 172, 173), seg(27, 58), seg(29, 34), seg(37, 136), seg(53, 53, 54), seg(54, 38, 39)] },
  { phase: 3, title: 'آية لمن بعدهم', segments: [seg(15, 75, 77), seg(26, 174, 175), seg(29, 35), seg(37, 137, 138), seg(51, 37), seg(25, 40)] },
  { phase: 4, title: 'لوط بين الأنبياء', segments: [seg(21, 74, 75), seg(6, 86), seg(37, 133)] },
  { phase: 4, title: 'قومه بين الأمم المكذبة', segments: [seg(22, 43), seg(38, 13), seg(50, 13), seg(9, 70), seg(69, 9), seg(11, 89)] },
  { phase: 4, title: 'امرأة لوط مثلا', segments: [seg(66, 10)] },
];

export const LUT: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. أحداث القصة في خمس مجموعات: مع إبراهيم، ودعوة قومه، والرسل، والنجاة والهلاك، والعبرة. وفيها كل آية ذُكر فيها لوط أو قومه أو المؤتفكات. وتقسيم الآيات على الأحداث من عملنا، وقد تدخل آية في حدث ولها صلة بغيره.',
  phases: ['مع إبراهيم', 'دعوة قومه', 'الرسل', 'النجاة والهلاك', 'العبرة'],
  events,
};

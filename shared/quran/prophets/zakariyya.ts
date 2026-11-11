import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'كفالة مريم والرزق في المحراب', segments: [seg(3, 37), seg(3, 44)] },
  { phase: 1, title: 'دعاؤه بالولد', segments: [seg(19, 2, 6), seg(3, 38), seg(21, 89)] },
  { phase: 1, title: 'البشارة بيحيى', segments: [seg(19, 7), seg(3, 39), seg(21, 90)] },
  { phase: 1, title: 'عجبه من الولد', segments: [seg(19, 8, 9), seg(3, 40)] },
  { phase: 1, title: 'آيته: ألا يكلم الناس', segments: [seg(19, 10, 11), seg(3, 41)] },
  { phase: 2, title: 'اسمه بين الأنبياء', segments: [seg(6, 85)] },
];

export const ZAKARIYYA: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. أحداث القصة في ثلاث مجموعات: كفالة مريم، والدعاء والبشارة بيحيى، واسمه بين الأنبياء. وفيها كل آية ذُكر فيها زكريا. وتقسيم الآيات على الأحداث من عملنا، وقد تدخل آية في حدث ولها صلة بغيره.',
  phases: ['كفالة مريم', 'الدعاء والبشارة', 'بين الأنبياء'],
  events,
};

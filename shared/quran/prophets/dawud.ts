import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'الملأ يطلبون ملكا', segments: [seg(2, 246, 248)] },
  { phase: 0, title: 'النهر والفئة القليلة', segments: [seg(2, 249, 250)] },
  { phase: 0, title: 'داود يقتل جالوت', segments: [seg(2, 251, 252)] },
  { phase: 1, title: 'الجبال والطير يسبحن معه', segments: [seg(38, 17, 19), seg(34, 10)] },
  { phase: 1, title: 'إلانة الحديد وصنعة الدروع', segments: [seg(34, 11), seg(21, 80)] },
  { phase: 1, title: 'شد الملك والحكمة', segments: [seg(38, 20)] },
  { phase: 1, title: 'الزبور', segments: [seg(4, 163), seg(17, 55)] },
  { phase: 1, title: 'العلم والشكر', segments: [seg(27, 15), seg(34, 13)] },
  { phase: 2, title: 'الخصمان في المحراب', segments: [seg(38, 21, 25)] },
  { phase: 2, title: 'خليفة في الأرض', segments: [seg(38, 26)] },
  { phase: 2, title: 'الحكم في الحرث', segments: [seg(21, 78, 79)] },
  { phase: 3, title: 'وهبنا لداود سليمان', segments: [seg(38, 30), seg(27, 16)] },
  { phase: 3, title: 'بين الأنبياء', segments: [seg(6, 84)] },
  { phase: 3, title: 'لعن الكافرين على لسانه', segments: [seg(5, 78)] },
];

export const DAWUD: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. أحداث القصة في أربع مجموعات: طالوت وجالوت، وما آتاه الله، وحكمه بين الناس، وذريته وذكره. وفيها كل آية ذُكر فيها داود. وتقسيم الآيات على الأحداث من عملنا، وقد تدخل آية في حدث ولها صلة بغيره.',
  phases: ['طالوت وجالوت', 'ما آتاه الله', 'حكمه بين الناس', 'ذريته وذكره'],
  events,
};

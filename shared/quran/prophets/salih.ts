import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'إرساله إلى ثمود', segments: [seg(11, 61), seg(7, 73), seg(26, 141, 145), seg(27, 45)] },
  { phase: 0, title: 'تذكيرهم بالنعم', segments: [seg(26, 146, 152), seg(7, 74), seg(15, 82), seg(89, 9)] },
  { phase: 1, title: 'تكذيبه واتهامه', segments: [seg(11, 62, 63), seg(26, 153, 154), seg(54, 23, 26), seg(15, 80, 81), seg(91, 11)] },
  { phase: 1, title: 'المستكبرون والمؤمنون', segments: [seg(7, 75, 76)] },
  { phase: 1, title: 'التطير به وبمن معه', segments: [seg(27, 46, 47)] },
  { phase: 1, title: 'التسعة رهط ومكرهم', segments: [seg(27, 48, 50)] },
  { phase: 2, title: 'ناقة الله آية', segments: [seg(11, 64), seg(26, 155, 156), seg(54, 27, 28), seg(91, 13), seg(17, 59)] },
  { phase: 2, title: 'عقر الناقة', segments: [seg(11, 65), seg(7, 77), seg(26, 157), seg(54, 29), seg(91, 12), seg(91, 14), seg(51, 43, 44)] },
  { phase: 3, title: 'الصيحة والرجفة', segments: [seg(11, 67, 68), seg(7, 78), seg(26, 158, 159), seg(27, 51), seg(54, 30, 31), seg(15, 83, 84), seg(41, 17), seg(51, 45), seg(69, 5), seg(91, 15)] },
  { phase: 3, title: 'نجاة صالح والذين آمنوا', segments: [seg(11, 66), seg(27, 53), seg(41, 18)] },
  { phase: 3, title: 'توليه عنهم', segments: [seg(7, 79)] },
  { phase: 3, title: 'مساكنهم الخاوية', segments: [seg(27, 52), seg(29, 38)] },
  {
    phase: 4,
    title: 'ثمود بين الأمم المكذبة',
    segments: [seg(9, 70), seg(11, 89), seg(11, 95), seg(14, 9), seg(22, 42), seg(25, 38), seg(38, 13), seg(40, 31), seg(41, 13), seg(50, 12), seg(53, 51), seg(69, 4), seg(85, 17, 18)],
  },
];

export const SALIH: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. أحداث القصة في خمس مجموعات: الدعوة، والتكذيب والمكر، والناقة، والهلاك والنجاة، وثمود بين الأمم. وفيها كل آية ذُكر فيها صالح أو ثمود أو أصحاب الحجر. وتقسيم الآيات على الأحداث من عملنا، وقد تدخل آية في حدث ولها صلة بغيره.',
  phases: ['الدعوة', 'التكذيب والمكر', 'الناقة', 'الهلاك والنجاة', 'ثمود بين الأمم'],
  events,
};

import { seg, type Story, type StoryEvent } from './story';

// In surah Yusuf only the ayat where Yaqub is present; the whole telling is in yusuf.ts.
const events: StoryEvent[] = [
  { phase: 0, title: 'البشرى به', segments: [seg(11, 71)] },
  { phase: 0, title: 'هبة لإبراهيم', segments: [seg(21, 72), seg(19, 49), seg(29, 27), seg(6, 84)] },
  { phase: 1, title: 'رؤيا يوسف', segments: [seg(12, 4, 6)] },
  { phase: 1, title: 'استئذان بنيه', segments: [seg(12, 11, 14)] },
  { phase: 1, title: 'الدم الكذب والصبر', segments: [seg(12, 16, 18)] },
  { phase: 2, title: 'إرسال أخيه معهم', segments: [seg(12, 63, 68)] },
  { phase: 2, title: 'حزنه على يوسف وأخيه', segments: [seg(12, 81, 87)] },
  { phase: 3, title: 'ريح يوسف وارتداد البصر', segments: [seg(12, 93, 98)] },
  { phase: 3, title: 'دخوله على يوسف', segments: [seg(12, 99, 100)] },
  { phase: 4, title: 'وصيته لبنيه', segments: [seg(2, 132, 133)] },
  { phase: 4, title: 'ما حرّم إسرائيل على نفسه', segments: [seg(3, 93)] },
  { phase: 4, title: 'اسمه بين الأنبياء', segments: [seg(38, 45, 47), seg(2, 136), seg(2, 140), seg(3, 84), seg(4, 163), seg(12, 38)] },
  { phase: 4, title: 'ذريته وآله', segments: [seg(19, 58), seg(19, 6)] },
];

export const YAQUB: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. أكثر خبر يعقوب في سورة يوسف، وهنا منها الآيات التي يحضر فيها فقط، وتمامها في قصة يوسف. ويُسمّى إسرائيل في موضعين. وتقسيم الآيات على الأحداث من عملنا.',
  phases: ['هبة لإبراهيم', 'فقد يوسف', 'فقد أخيه', 'اللقاء', 'وصيته وذكره'],
  events,
};

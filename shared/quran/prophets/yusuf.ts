import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'الرؤيا', segments: [seg(12, 4, 6)] },
  { phase: 0, title: 'كيد إخوته', segments: [seg(12, 7, 10)] },
  { phase: 0, title: 'استئذان أبيه', segments: [seg(12, 11, 14)] },
  { phase: 0, title: 'في غيابة الجب', segments: [seg(12, 15, 18)] },
  { phase: 0, title: 'السيارة وبيعه', segments: [seg(12, 19, 20)] },
  { phase: 1, title: 'في بيت العزيز', segments: [seg(12, 21, 22)] },
  { phase: 1, title: 'المراودة وقدّ القميص', segments: [seg(12, 23, 29)] },
  { phase: 1, title: 'نسوة المدينة', segments: [seg(12, 30, 34)] },
  { phase: 1, title: 'السجن والفتيان', segments: [seg(12, 35, 42)] },
  { phase: 1, title: 'رؤيا الملك', segments: [seg(12, 43, 49)] },
  { phase: 1, title: 'براءته', segments: [seg(12, 50, 53)] },
  { phase: 2, title: 'على خزائن الأرض', segments: [seg(12, 54, 57)] },
  { phase: 2, title: 'مجيء إخوته', segments: [seg(12, 58, 62)] },
  { phase: 2, title: 'العودة بأخيه', segments: [seg(12, 63, 68)] },
  { phase: 2, title: 'السقاية في رحل أخيه', segments: [seg(12, 69, 79)] },
  { phase: 2, title: 'رجوعهم إلى أبيهم', segments: [seg(12, 80, 87)] },
  { phase: 3, title: 'أنا يوسف', segments: [seg(12, 88, 92)] },
  { phase: 3, title: 'القميص وارتداد البصر', segments: [seg(12, 93, 98)] },
  { phase: 3, title: 'تأويل الرؤيا', segments: [seg(12, 99, 101)] },
  { phase: 4, title: 'أحسن القصص', segments: [seg(12, 3), seg(12, 102)] },
  { phase: 4, title: 'اسمه بين الأنبياء', segments: [seg(6, 84)] },
  { phase: 4, title: 'بيّناته لأهل مصر', segments: [seg(40, 34)] },
];

export const YUSUF: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. قصة يوسف كلها في سورته متتابعة، وفي غيرها ذكر اسمه فقط. أحداثها في خمس مجموعات: الرؤيا والجب، وبيت العزيز والسجن، وخزائن الأرض وإخوته، واللقاء، وذكره في القرآن. وتقسيم الآيات على الأحداث من عملنا.',
  phases: ['الرؤيا والجب', 'بيت العزيز والسجن', 'خزائن الأرض وإخوته', 'اللقاء', 'ذكره في القرآن'],
  events,
};

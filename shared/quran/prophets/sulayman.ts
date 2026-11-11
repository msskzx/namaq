import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'وهبه الله لداود', segments: [seg(38, 30)] },
  { phase: 0, title: 'الحكم في الحرث', segments: [seg(21, 78, 79)] },
  { phase: 0, title: 'ورث داود ومنطق الطير', segments: [seg(27, 15, 16)] },
  { phase: 1, title: 'الصافنات الجياد', segments: [seg(38, 31, 33)] },
  { phase: 1, title: 'الفتنة والدعاء بالملك', segments: [seg(38, 34, 35)] },
  { phase: 2, title: 'الريح وعين القطر', segments: [seg(38, 36), seg(21, 81), seg(34, 12)] },
  { phase: 2, title: 'الشياطين يعملون له', segments: [seg(38, 37, 40), seg(21, 82), seg(34, 13)] },
  { phase: 3, title: 'وادي النمل', segments: [seg(27, 17, 19)] },
  { phase: 3, title: 'الهدهد ونبأ سبأ', segments: [seg(27, 20, 26)] },
  { phase: 3, title: 'الكتاب إلى الملكة', segments: [seg(27, 27, 31)] },
  { phase: 3, title: 'المشورة والهدية', segments: [seg(27, 32, 37)] },
  { phase: 3, title: 'العرش قبل ارتداد الطرف', segments: [seg(27, 38, 40)] },
  { phase: 3, title: 'الصرح وإسلام الملكة', segments: [seg(27, 41, 44)] },
  { phase: 4, title: 'موته ومنسأته', segments: [seg(34, 14)] },
  { phase: 4, title: 'وما كفر سليمان', segments: [seg(2, 102)] },
  { phase: 4, title: 'اسمه بين الأنبياء', segments: [seg(4, 163), seg(6, 84)] },
];

export const SULAYMAN: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. أحداث القصة في خمس مجموعات: ميراثه من داود، وفتنته ودعاؤه، وما سخّر الله له، والنمل وملكة سبأ، وموته وذكره. وفيها كل آية ذُكر فيها سليمان. وتقسيم الآيات على الأحداث من عملنا، وقد تدخل آية في حدث ولها صلة بغيره.',
  phases: ['ميراثه من داود', 'فتنته ودعاؤه', 'ما سخّر له', 'النمل وملكة سبأ', 'موته وذكره'],
  events,
};

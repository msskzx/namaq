import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'امرأة عمران ونذرها', segments: [seg(3, 33, 37)] },
  { phase: 0, title: 'اصطفاء مريم', segments: [seg(3, 42, 44)] },
  { phase: 1, title: 'البشارة بكلمة من الله', segments: [seg(19, 16, 21), seg(3, 45, 47), seg(21, 91), seg(66, 12)] },
  { phase: 1, title: 'المخاض وجذع النخلة', segments: [seg(19, 22, 26)] },
  { phase: 1, title: 'اتهام قومها وكلامه في المهد', segments: [seg(19, 27, 33), seg(4, 156)] },
  { phase: 1, title: 'آية وإيواء إلى ربوة', segments: [seg(23, 50)] },
  { phase: 2, title: 'رسول إلى بني إسرائيل وآياته', segments: [seg(3, 48, 51), seg(5, 110), seg(43, 63, 64), seg(2, 87), seg(2, 253), seg(5, 78)] },
  { phase: 2, title: 'الإنجيل', segments: [seg(5, 46, 47), seg(57, 27)] },
  { phase: 2, title: 'مبشرا برسول اسمه أحمد', segments: [seg(61, 6)] },
  { phase: 2, title: 'الحواريون أنصار الله', segments: [seg(3, 52, 53), seg(5, 111), seg(61, 14)] },
  { phase: 2, title: 'المائدة', segments: [seg(5, 112, 115)] },
  { phase: 3, title: 'مكروا به فرفعه الله', segments: [seg(3, 54, 58), seg(4, 157, 158)] },
  { phase: 3, title: 'علم للساعة', segments: [seg(43, 61, 62), seg(4, 159)] },
  { phase: 3, title: 'اختلاف الأحزاب فيه', segments: [seg(19, 37, 40), seg(43, 65)] },
  { phase: 3, title: 'سؤاله يوم القيامة', segments: [seg(5, 116, 119), seg(5, 109)] },
  { phase: 4, title: 'مثله كمثل آدم', segments: [seg(3, 59, 63)] },
  { phase: 4, title: 'قول الحق فيه', segments: [seg(19, 34, 36)] },
  { phase: 4, title: 'ما المسيح إلا رسول', segments: [seg(5, 72, 77), seg(4, 171, 172), seg(5, 17), seg(9, 30, 31)] },
  { phase: 4, title: 'ضُرب ابن مريم مثلا', segments: [seg(43, 57, 60)] },
  { phase: 4, title: 'ذكره مع الأنبياء', segments: [seg(2, 136), seg(3, 84), seg(4, 163), seg(6, 85), seg(33, 7), seg(42, 13)] },
];

export const ISA: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. أحداث القصة في خمس مجموعات: أمه مريم، والمولد، والرسالة، والرفع وما بعده، وعبد الله ورسوله. وفيها كل آية ذُكر فيها عيسى أو المسيح أو مريم. وتقسيم الآيات على الأحداث من عملنا، وقد تدخل آية في حدث ولها صلة بغيره.',
  phases: ['أمه مريم', 'المولد', 'الرسالة', 'الرفع وما بعده', 'عبد الله ورسوله'],
  events,
};

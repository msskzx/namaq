import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'نداؤه: مسّني الضر', segments: [seg(21, 83), seg(38, 41)] },
  { phase: 0, title: 'الاستجابة وأهله ومثلهم معهم', segments: [seg(21, 84), seg(38, 42, 43)] },
  { phase: 0, title: 'الضغث: نعم العبد', segments: [seg(38, 44)] },
  { phase: 1, title: 'في سلسلة الأنبياء', segments: [seg(6, 84), seg(4, 163)] },
];

export const AYYUB: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. ذُكر أيوب في أربع سور، وخبره في الأنبياء وص: مسّه الضر فنادى ربه فاستجاب له. وفيها كل آية ذُكر فيها أيوب. وتقسيم الآيات على الأحداث من عملنا.',
  phases: ['بلاؤه ودعاؤه', 'ذكره بين الأنبياء'],
  events,
};

import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'دعوته قومه: أتدعون بعلا', segments: [seg(37, 123, 126)] },
  { phase: 0, title: 'تكذيب قومه', segments: [seg(37, 127, 128)] },
  { phase: 0, title: 'سلام على إل ياسين', segments: [seg(37, 129, 132)] },
  { phase: 1, title: 'في سلسلة الأنبياء', segments: [seg(6, 85)] },
];

export const ILYAS: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. ذُكر إلياس في سورتين: في الصافات دعوته قومه إلى ترك عبادة بعل، وفي الأنعام اسمه بين الأنبياء. وفيها كل آية ذُكر فيها إلياس. وتقسيم الآيات على الأحداث من عملنا.',
  phases: ['دعوته', 'ذكره بين الأنبياء'],
  events,
};

import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'كل من الصابرين', segments: [seg(21, 85, 86)] },
  { phase: 0, title: 'وكل من الأخيار', segments: [seg(38, 48)] },
];

export const DHUL_KIFL: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. ذُكر ذو الكفل في موضعين، كلاهما في ذكر جماعة من الأنبياء، ولم يُقصّ من خبره شيء. وفيها كل آية ذُكر فيها ذو الكفل.',
  phases: ['ذكره بين الأنبياء'],
  events,
};

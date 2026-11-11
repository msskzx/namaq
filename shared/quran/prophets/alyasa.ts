import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'وكلا فضلنا على العالمين', segments: [seg(6, 86)] },
  { phase: 0, title: 'وكل من الأخيار', segments: [seg(38, 48)] },
];

export const ALYASA: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. ذُكر اليسع في موضعين، كلاهما في ذكر جماعة من الأنبياء، ولم يُقصّ من خبره شيء. وفيها كل آية ذُكر فيها اليسع.',
  phases: ['ذكره بين الأنبياء'],
  events,
};

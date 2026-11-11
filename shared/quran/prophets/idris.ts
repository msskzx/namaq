import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'صديقا نبيا رُفع مكانا عليا', segments: [seg(19, 56, 57)] },
  { phase: 0, title: 'من الصابرين', segments: [seg(21, 85, 86)] },
];

export const IDRIS: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. ذُكر إدريس في القرآن مرتين، في سورتي مريم والأنبياء، ثناءً عليه دون قصة.',
  phases: ['ثناء الله عليه'],
  events,
};

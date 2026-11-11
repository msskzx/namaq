import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'أبق إلى الفلك المشحون', segments: [seg(37, 139, 140)] },
  { phase: 0, title: 'القرعة على الفلك', segments: [seg(37, 141)] },
  { phase: 1, title: 'التقمه الحوت', segments: [seg(37, 142)] },
  { phase: 1, title: 'النداء في الظلمات', segments: [seg(21, 87), seg(37, 143, 144), seg(68, 48)] },
  { phase: 2, title: 'الاستجابة والنبذ بالعراء', segments: [seg(37, 145), seg(21, 88), seg(68, 49)] },
  { phase: 2, title: 'شجرة من يقطين', segments: [seg(37, 146)] },
  { phase: 2, title: 'اجتباه ربه', segments: [seg(68, 50)] },
  { phase: 3, title: 'مائة ألف آمنوا فمتعوا', segments: [seg(37, 147, 148), seg(10, 98)] },
  { phase: 4, title: 'اسمه بين الأنبياء', segments: [seg(4, 163), seg(6, 86)] },
];

export const YUNUS: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. قصة يونس في الصافات، ومنها مواضع في الأنبياء (ذو النون) والقلم (صاحب الحوت) ويونس. وفيها كل آية ذُكر فيها يونس أو ذو النون أو صاحب الحوت. وتقسيم الآيات على الأحداث من عملنا، وقد تدخل آية في حدث ولها صلة بغيره، كآية الأنبياء التي تذكر ذهابه مغاضبًا ونداءه معًا.',
  phases: ['على الفلك', 'الحوت', 'النجاة', 'قومه', 'بين الأنبياء'],
  events,
};

import { seg, type Story, type StoryEvent } from './story';

// docs/plans/quran-prophet-timelines.md (Hud)
const events: StoryEvent[] = [
  { phase: 0, title: 'أخوهم هود: اعبدوا الله', segments: [seg(7, 65), seg(11, 50), seg(26, 123, 126), seg(46, 21)] },
  { phase: 0, title: 'لا أسألكم عليه أجرا', segments: [seg(11, 51), seg(26, 127)] },
  { phase: 0, title: 'استغفروا ربكم', segments: [seg(11, 52)] },
  { phase: 0, title: 'البناء والبطش', segments: [seg(26, 128, 131)] },
  { phase: 0, title: 'التذكير بنعم الله', segments: [seg(26, 132, 135), seg(7, 69)] },
  { phase: 1, title: 'إنا لنراك في سفاهة', segments: [seg(7, 66, 68)] },
  { phase: 1, title: 'ما جئتنا ببينة', segments: [seg(11, 53, 57)] },
  { phase: 1, title: 'سواء علينا أوعظت', segments: [seg(26, 136, 138)] },
  { phase: 1, title: 'من أشد منا قوة', segments: [seg(41, 15)] },
  { phase: 1, title: 'فأتنا بما تعدنا', segments: [seg(7, 70, 71), seg(46, 22, 23)] },
  { phase: 2, title: 'هذا عارض ممطرنا', segments: [seg(46, 24, 25)] },
  { phase: 2, title: 'الريح الصرصر', segments: [seg(69, 6, 8), seg(54, 18, 21), seg(41, 16), seg(51, 41, 42)] },
  { phase: 2, title: 'نجاة هود والذين آمنوا', segments: [seg(11, 58), seg(7, 72)] },
  { phase: 2, title: 'وتلك عاد', segments: [seg(11, 59, 60), seg(26, 139, 140), seg(46, 26)] },
  { phase: 3, title: 'إرم ذات العماد', segments: [seg(89, 6, 8)] },
  {
    phase: 3,
    title: 'عاد بين الأمم المكذبة',
    segments: [seg(9, 70), seg(11, 89), seg(14, 9), seg(22, 42), seg(25, 38), seg(29, 38), seg(38, 12), seg(40, 31), seg(41, 13, 14), seg(50, 13), seg(53, 50), seg(69, 4)],
  },
];

export const HUD: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. أحداث القصة في أربع مجموعات: الدعوة، وجواب قومه، والعذاب، وعاد بين الأمم. وفيها كل آية ذُكر فيها هود أو قومه عاد، إلا آية الأعراف ٧٤ فهي في قصة صالح. وتقسيم الآيات على الأحداث من عملنا، وقد تدخل آية في حدث ولها صلة بغيره.',
  phases: ['الدعوة', 'جواب قومه', 'العذاب', 'عاد بين الأمم'],
  events,
};

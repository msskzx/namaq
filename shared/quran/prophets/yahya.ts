import { seg, type Story, type StoryEvent } from './story';

const events: StoryEvent[] = [
  { phase: 0, title: 'دعاء أبيه زكريا', segments: [seg(19, 2, 6), seg(3, 38), seg(21, 89)] },
  { phase: 0, title: 'البشارة به', segments: [seg(19, 7), seg(3, 39), seg(21, 90)] },
  { phase: 0, title: 'عجب أبيه والآية', segments: [seg(19, 8, 11), seg(3, 40, 41)] },
  { phase: 1, title: 'الكتاب والحكم صبيًّا', segments: [seg(19, 12, 14)] },
  { phase: 1, title: 'السلام عليه', segments: [seg(19, 15)] },
  { phase: 2, title: 'اسمه بين الأنبياء', segments: [seg(6, 85)] },
];

export const YAHYA: Story = {
  intro: 'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. أحداث القصة في ثلاث مجموعات: مولده، وصفاته، واسمه بين الأنبياء. وفيها كل آية ذُكر فيها يحيى. وتقسيم الآيات على الأحداث من عملنا، وقد تدخل آية في حدث ولها صلة بغيره.',
  phases: ['مولده', 'صفاته', 'بين الأنبياء'],
  events,
};

export type Prophet = { slug: string; name: string; nameEn: string; /** The name after «قصة» where it changes case: ذو → ذي. */ of?: string };

export const PROPHETS: Prophet[] = [
  { slug: 'adam', name: 'آدم', nameEn: 'Adam' },
  { slug: 'ibrahim', name: 'إبراهيم', nameEn: 'Ibrahim' },
  { slug: 'yaqub', name: 'يعقوب', nameEn: 'Yaqub' },
  { slug: 'yusuf', name: 'يوسف', nameEn: 'Yusuf' },
  { slug: 'ayyub', name: 'أيوب', nameEn: 'Ayyub' },
  { slug: 'salih', name: 'صالح', nameEn: 'Salih' },
  { slug: 'shuayb', name: 'شعيب', nameEn: 'Shuayb' },
  { slug: 'musa', name: 'موسى', nameEn: 'Musa' },
  { slug: 'harun', name: 'هارون', nameEn: 'Harun' },
  { slug: 'dhul-kifl', name: 'ذو الكفل', nameEn: 'Dhul-Kifl', of: 'ذي الكفل' },
  { slug: 'dawud', name: 'داود', nameEn: 'Dawud' },
  { slug: 'sulayman', name: 'سليمان', nameEn: 'Sulayman' },
  { slug: 'ilyas', name: 'إلياس', nameEn: 'Ilyas' },
  { slug: 'alyasa', name: 'اليسع', nameEn: 'Alyasa' },
  { slug: 'zakariyya', name: 'زكريا', nameEn: 'Zakariyya' },
  { slug: 'yahya', name: 'يحيى', nameEn: 'Yahya' },
  { slug: 'yunus', name: 'يونس', nameEn: 'Yunus' },
];

export const findProphet = (slug: string) => PROPHETS.find(p => p.slug === slug);

/** The story page's heading. */
export const storyTitle = (prophet: Prophet) => `قصة ${prophet.of ?? prophet.name} عليه السلام في القرآن`;

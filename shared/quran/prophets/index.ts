export type Prophet = { slug: string; name: string; nameEn: string; /** The name after «قصة» where it changes case: ذو → ذي. */ of?: string; /** The page heading, where «قصة … عليه السلام» does not fit. */ title?: string };

export const PROPHETS: Prophet[] = [
  { slug: 'adam', name: 'آدم', nameEn: 'Adam' },
  { slug: 'idris', name: 'إدريس', nameEn: 'Idris' },
  { slug: 'nuh', name: 'نوح', nameEn: 'Nuh' },
  { slug: 'hud', name: 'هود', nameEn: 'Hud' },
  { slug: 'ibrahim', name: 'إبراهيم', nameEn: 'Ibrahim' },
  { slug: 'yaqub', name: 'يعقوب', nameEn: 'Yaqub' },
  { slug: 'yusuf', name: 'يوسف', nameEn: 'Yusuf' },
  { slug: 'ayyub', name: 'أيوب', nameEn: 'Ayyub' },
  { slug: 'salih', name: 'صالح', nameEn: 'Salih' },
  { slug: 'lut', name: 'لوط', nameEn: 'Lut' },
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
  { slug: 'isa', name: 'عيسى', nameEn: 'Isa' },
  { slug: 'yunus', name: 'يونس', nameEn: 'Yunus' },
  { slug: 'muhammad', name: 'محمد ﷺ', nameEn: 'Muhammad', title: 'سيرة النبي ﷺ في القرآن' },
];

export const findProphet = (slug: string) => PROPHETS.find(p => p.slug === slug);

/** The story page's heading. */
export const storyTitle = (prophet: Prophet) => prophet.title ?? `قصة ${prophet.of ?? prophet.name} عليه السلام في القرآن`;

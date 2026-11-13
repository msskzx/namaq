export type Prophet = { slug: string; name: string; nameEn: string; /** The name after «قصة» where it changes case: ذو → ذي. */ of?: string; /** The page heading, where «قصة … عليه السلام» does not fit. */ title?: string; /** Said after the name, «عليه السلام» unless given. */ honor?: string };

export const PROPHETS: Prophet[] = [
  // Ibn Kathir's order in Qisas al-Anbiya (Yunus, Ilyas and al-Yasa' are dated differently by others).
  { slug: 'adam', name: 'آدم', nameEn: 'Adam' },
  { slug: 'idris', name: 'إدريس', nameEn: 'Idris' },
  { slug: 'nuh', name: 'نوح', nameEn: 'Nuh' },
  { slug: 'hud', name: 'هود', nameEn: 'Hud' },
  { slug: 'salih', name: 'صالح', nameEn: 'Salih' },
  { slug: 'ibrahim', name: 'إبراهيم', nameEn: 'Ibrahim' },
  { slug: 'lut', name: 'لوط', nameEn: 'Lut' },
  { slug: 'shuayb', name: 'شعيب', nameEn: 'Shuayb' },
  { slug: 'yaqub', name: 'يعقوب', nameEn: 'Yaqub' },
  { slug: 'yusuf', name: 'يوسف', nameEn: 'Yusuf' },
  { slug: 'ayyub', name: 'أيوب', nameEn: 'Ayyub' },
  { slug: 'dhul-kifl', name: 'ذو الكفل', nameEn: 'Dhul-Kifl', of: 'ذي الكفل' },
  { slug: 'yunus', name: 'يونس', nameEn: 'Yunus' },
  { slug: 'musa', name: 'موسى', nameEn: 'Musa' },
  { slug: 'harun', name: 'هارون', nameEn: 'Harun' },
  { slug: 'ilyas', name: 'إلياس', nameEn: 'Ilyas' },
  { slug: 'alyasa', name: 'اليسع', nameEn: 'Alyasa' },
  { slug: 'dawud', name: 'داود', nameEn: 'Dawud' },
  { slug: 'sulayman', name: 'سليمان', nameEn: 'Sulayman' },
  { slug: 'zakariyya', name: 'زكريا', nameEn: 'Zakariyya' },
  { slug: 'yahya', name: 'يحيى', nameEn: 'Yahya' },
  { slug: 'isa', name: 'عيسى', nameEn: 'Isa' },
  { slug: 'muhammad', name: 'محمد', honor: 'ﷺ', nameEn: 'Muhammad', title: 'سيرة النبي ﷺ في القرآن' },
];

/** The name as lists and pickers show it, with «عليه السلام», or ﷺ for the Prophet. */
export const prophetName = (prophet: Prophet) => `${prophet.name} ${prophet.honor ?? 'عليه السلام'}`;

export const findProphet = (slug: string) => PROPHETS.find(p => p.slug === slug);

/** The story page's heading. */
export const storyTitle = (prophet: Prophet) => prophet.title ?? `قصة ${prophet.of ?? prophet.name} عليه السلام في القرآن`;

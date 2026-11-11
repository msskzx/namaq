export type Prophet = { slug: string; name: string; nameEn: string; /** The name after «قصة» where it changes case: ذو → ذي. */ of?: string };

export const PROPHETS: Prophet[] = [
  { slug: 'ibrahim', name: 'إبراهيم', nameEn: 'Ibrahim' },
  { slug: 'ayyub', name: 'أيوب', nameEn: 'Ayyub' },
  { slug: 'shuayb', name: 'شعيب', nameEn: 'Shuayb' },
  { slug: 'musa', name: 'موسى', nameEn: 'Musa' },
  { slug: 'harun', name: 'هارون', nameEn: 'Harun' },
  { slug: 'dhul-kifl', name: 'ذو الكفل', nameEn: 'Dhul-Kifl', of: 'ذي الكفل' },
  { slug: 'ilyas', name: 'إلياس', nameEn: 'Ilyas' },
  { slug: 'alyasa', name: 'اليسع', nameEn: 'Alyasa' },
  { slug: 'zakariyya', name: 'زكريا', nameEn: 'Zakariyya' },
  { slug: 'yahya', name: 'يحيى', nameEn: 'Yahya' },
];

export const findProphet = (slug: string) => PROPHETS.find(p => p.slug === slug);

/** The story page's heading. */
export const storyTitle = (prophet: Prophet) => `قصة ${prophet.of ?? prophet.name} عليه السلام في القرآن`;

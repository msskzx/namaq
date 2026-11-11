export const PROPHETS = [
  { slug: 'ayyub', name: 'أيوب', nameEn: 'Ayyub' },
  { slug: 'shuayb', name: 'شعيب', nameEn: 'Shuayb' },
  { slug: 'musa', name: 'موسى', nameEn: 'Musa' },
  { slug: 'harun', name: 'هارون', nameEn: 'Harun' },
  { slug: 'dhul-kifl', name: 'ذو الكفل', nameEn: 'Dhul-Kifl' },
  { slug: 'ilyas', name: 'إلياس', nameEn: 'Ilyas' },
  { slug: 'alyasa', name: 'اليسع', nameEn: 'Alyasa' },
];

export const findProphet = (slug: string) => PROPHETS.find(p => p.slug === slug);

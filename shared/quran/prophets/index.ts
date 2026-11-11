export const PROPHETS = [
  { slug: 'musa', name: 'موسى', nameEn: 'Musa' },
  { slug: 'shuayb', name: 'شعيب', nameEn: 'Shuayb' },
];

export const findProphet = (slug: string) => PROPHETS.find(p => p.slug === slug);

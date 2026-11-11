export const PROPHETS = [
  { slug: 'musa', name: 'موسى', nameEn: 'Musa' },
  { slug: 'ibrahim', name: 'إبراهيم', nameEn: 'Ibrahim' },
];

export const findProphet = (slug: string) => PROPHETS.find(p => p.slug === slug);

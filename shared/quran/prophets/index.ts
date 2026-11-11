export const PROPHETS = [
  { slug: 'musa', name: 'موسى', nameEn: 'Musa' },
  { slug: 'nuh', name: 'نوح', nameEn: 'Nuh' },
  { slug: 'idris', name: 'إدريس', nameEn: 'Idris' },
];

export const findProphet = (slug: string) => PROPHETS.find(p => p.slug === slug);

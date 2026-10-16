export const PROPHETS = [{ slug: 'musa', name: 'موسى', nameEn: 'Musa' }];

export const findProphet = (slug: string) => PROPHETS.find(p => p.slug === slug);

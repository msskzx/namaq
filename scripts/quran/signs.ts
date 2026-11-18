/** The blessings and praises Shamela writes as one sign, spelled out. */
export const SIGNS: Record<string, string> = {
  'ﷺ': 'صلى الله عليه وسلم', '﵇': 'عليه السلام', '﵊': 'عليه الصلاة والسلام', '﵀': 'رحمه الله', '﵁': 'رضي الله عنه',
  '﵂': 'رضي الله عنها', '﵃': 'رضي الله عنهم', '﵄': 'رضي الله عنهما', '﷿': 'عز وجل', 'ﷻ': 'جل جلاله', '﵎': 'تبارك وتعالى',
  '﵈': 'عليهم السلام', '﵉': 'عليهما السلام', '﵍': 'عليها السلام', '﷾': 'سبحانه وتعالى',
};

/** A book's text with every sign but ﷺ spelled out, since the text font draws most of them as an unreadable mark. */
export const spellSigns = (text: string) => text.replace(/[\uFD40-\uFD4F\uFDFB\uFDFE\uFDFF]/g, sign => SIGNS[sign] ? ` ${SIGNS[sign]}` : sign).replace(/ {2,}/g, ' ');

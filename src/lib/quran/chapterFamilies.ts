import type { BranchAyah, Opening } from './branches';

const FAMILIES = [
  { id: 'hawamim', text: 'الحواميم', textEn: 'Hawamim', chapters: [40, 41, 42, 43, 44, 45, 46] },
  { id: 'tawasin', text: 'الطواسين', textEn: 'Tawasin', chapters: [26, 27, 28] },
  { id: 'mimat', text: 'الميمات', textEn: 'Mimat', chapters: [2, 3, 29, 30, 31, 32] },
  { id: 'raat', text: 'الراءات', textEn: 'Raat', chapters: [10, 11, 12, 13, 14, 15] },
  { id: 'hamidat', text: 'الحامدات', textEn: 'Hamidat', chapters: [1, 6, 18, 34, 35] },
  { id: 'musabbihat', text: 'المسبحات', textEn: 'Musabbihat', chapters: [17, 57, 59, 61, 62, 64, 87] },
  { id: 'alif-lam-mim', text: 'الم · المص · المر', textEn: 'Alif lam mim · alif lam mim sad · alif lam mim ra', chapters: [2, 3, 7, 13, 29, 30, 31, 32] },
];

export type ChapterFamily = Opening & { textEn: string; keys: string[] };

export function chapterFamilies(ayat: BranchAyah[]): ChapterFamily[] {
  const available = new Set(ayat.map(ayah => ayah.key));
  return FAMILIES.map(family => {
    const keys = family.chapters.map(chapter => `${chapter}:${chapter === 1 ? 2 : 1}`).filter(key => available.has(key));
    return { id: `family:${family.id}`, text: family.text, textEn: family.textEn, count: keys.length, keys };
  }).filter(family => family.count >= 2);
}

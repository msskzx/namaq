// The «قصص السيرة» chapters (owner, 2026-11-23): each story under the chapter al-Bukhari files it in, in his order. His
// headings come from the app's Sahih al-Bukhari (shared/data/hadith/bukhari.json, the Sultaniyya's own headings).
import { readFileSync } from 'node:fs';
import type { CatalogReportSource } from './types';
import { isHadithSource } from './types';
import { plainName } from '@shared/quran/normalize';
import { CHAPTER_BATTLE } from '@shared/stories/chapterBattles';

type Bab = { title: string; from: number; to: number };
type Kitab = { n: number; title: string; from: number; to: number; babs: Bab[] };

/** The two books of al-Bukhari's Sahih that tell the sira: «مناقب الأنصار» (63) and «المغازي» (64). */
const SIRA_KITABS = [63, 64];

/** A heading with no words of its own («باب حدثني خليفة») goes with the titled heading before it, as a section of it. */
const UNTITLED = /^باب (حدثني|حدثنا|وقال|قال)|^باب:?$/;

const plain = plainName;

/**
 * Our name for each run of al-Bukhari's headings, and the words in a heading that put it there. The first that matches
 * wins, so a narrower heading («زمن الفتح», «في مرضه الذي») comes before a wider one («بمكة», «مرض»).
 */
export const CHAPTERS: { name: string; in: string[] }[] = [
  { name: 'مبعثه ﷺ', in: ['مبعث'] },
  { name: 'مقدمه ﷺ المدينة', in: ['أمض', 'مقدم', 'إقامة المهاجر', 'التاريخ', 'إتيان اليهود'] },
  { name: 'فتح مكة', in: ['زمن الفتح', 'الفتح', 'أعلى مكة'] },
  { name: 'أذى المشركين بمكة', in: ['بمكة', 'تقاسم'] },
  { name: 'من أسلم بمكة', in: ['إسلام أبي بكر', 'سعد بن أبي وقاص', 'أبي ذر', 'سعيد بن زيد', 'عمر بن الخطاب'] },
  { name: 'الجن', in: ['الجن'] },
  { name: 'انشقاق القمر', in: ['القمر'] },
  { name: 'الهجرة إلى الحبشة', in: ['الحبشة', 'النجاشي'] },
  { name: 'وفاة أبي طالب', in: ['قصة أبي طالب'] },
  { name: 'الإسراء والمعراج', in: ['المعراج', 'الإسراء'] },
  { name: 'بيعة العقبة', in: ['العقبة'] },
  { name: 'زواجه ﷺ بعائشة', in: ['عائشة'] },
  { name: 'الهجرة إلى المدينة', in: ['إلى المدينة'] },
  { name: 'المؤاخاة', in: ['آخى'] },
  { name: 'إسلام سلمان', in: ['سلمان'] },
  { name: 'غزوة العشيرة', in: ['العشيرة'] },
  { name: 'غزوة بدر', in: ['بدر', 'تستغيثون', 'أبي جهل', 'كفار قريش'] },
  { name: 'بنو النضير', in: ['النضير'] },
  { name: 'قتل كعب بن الأشرف', in: ['الأشرف'] },
  { name: 'قتل أبي رافع', in: ['أبي رافع'] },
  { name: 'غزوة أحد', in: ['أحد', 'طائفتان', 'تولوا', 'ليس لك', 'سليط', 'حمزة', 'استجابوا', 'نعاسا'] },
  { name: 'الرجيع وبئر معونة', in: ['معونة'] },
  { name: 'غزوة الخندق', in: ['الخندق'] },
  { name: 'بنو قريظة', in: ['مرجع'] },
  { name: 'ذات الرقاع', in: ['الرقاع'] },
  { name: 'غزوة بني المصطلق', in: ['المصطلق'] },
  { name: 'غزوة أنمار', in: ['أنمار'] },
  { name: 'حديث الإفك', in: ['الإفك'] },
  { name: 'الحديبية', in: ['الحديبية'] },
  { name: 'عكل وعرينة', in: ['عرينة'] },
  { name: 'غزوة ذي قرد', in: ['ذي قرد'] },
  { name: 'غزوة خيبر', in: ['خيبر'] },
  { name: 'عمرة القضاء', in: ['القضاء'] },
  { name: 'غزوة مؤتة', in: ['مؤتة'] },
  { name: 'غزوة حنين', in: ['حنين', 'أوطاس'] },
  { name: 'غزوة الطائف', in: ['الطائف'] },
  { name: 'البعوث', in: ['الحرقات', 'جذيمة', 'حذافة', 'إلى اليمن', 'الخلصة', 'السلاسل', 'سيف البحر', 'زيد بن حارثة', 'قبل نجد'] },
  { name: 'حج أبي بكر سنة تسع', in: ['حج أبي بكر'] },
  { name: 'الوفود', in: ['عيينة', 'وفد', 'نجران', 'عمان', 'الأشعريين', 'دوس', 'العنسي'] },
  { name: 'حجة الوداع', in: ['الوداع'] },
  { name: 'غزوة تبوك', in: ['تبوك', 'الثلاثة', 'الحجر'] },
  { name: 'كتبه ﷺ إلى الملوك', in: ['كسرى'] },
  { name: 'مرضه ﷺ ووفاته', in: ['في مرضه الذي', 'مرض', 'آخر ما تكلم', 'وفاة النبي'] },
  { name: 'عدد غزواته ﷺ', in: ['كم غزا'] },
];

/** Where a story whose reports are all outside al-Bukhari's sira books goes, when its own words name the event. */
export const CHAPTER_OF_STORY: Record<string, string> = {
  'al-walid-hears-the-quran': 'أذى المشركين بمكة',
  'utbah-offers-and-hears-fussilat': 'أذى المشركين بمكة',
  'journey-to-taif': 'أذى المشركين بمكة',
  'the-jinn-hear-the-quran': 'الجن',
  'islam-of-dimad': 'من أسلم بمكة',
  'the-consultation-before-badr': 'غزوة بدر',
  'hudhayfah-and-his-father-before-badr': 'غزوة بدر',
  'the-seven-of-the-ansar-at-uhud': 'غزوة أحد',
  'hudhayfah-on-the-night-of-the-confederates': 'غزوة الخندق',
  'the-ansar-on-the-day-of-the-conquest': 'فتح مكة',
  'umm-sulayms-dagger': 'غزوة حنين',
  'salamah-and-the-spy': 'غزوة حنين',
  'abu-sufyan-before-heraclius': 'كتبه ﷺ إلى الملوك',
};

/** The chapter for a story none of the above places. */
export const OTHER_CHAPTER = 'قصص أخرى';

let kitabs: Kitab[] | undefined;
const bukhari = () => (kitabs ??= (JSON.parse(readFileSync('shared/data/hadith/bukhari.json', 'utf8')) as { kitabs: Kitab[] }).kitabs);

/** al-Bukhari's titled heading over a hadith in his sira books, with its place in his order; none outside them. */
export function siraBab(hadith: number): { title: string; at: number } | undefined {
  for (const kitab of bukhari()) {
    if (!SIRA_KITABS.includes(kitab.n) || hadith < kitab.from || hadith > kitab.to) continue;
    let titled: Bab | undefined;
    // «مناقب الأنصار» opens with the Ansar's virtues and the days of the Jahiliyyah; the sira begins at «باب مبعث النبي ﷺ».
    const start = kitab.n === 63 ? kitab.babs.find(bab => plain(bab.title).includes('مبعث'))?.from ?? kitab.to + 1 : kitab.from;
    if (hadith < start) return undefined;
    for (const bab of kitab.babs) {
      if (!UNTITLED.test(plain(bab.title))) titled = bab;
      if (hadith >= bab.from && hadith <= bab.to) return titled && { title: titled.title, at: titled.from };
    }
  }
  return undefined;
}

/** Our chapter for one of al-Bukhari's headings. */
export function chapterOfBab(title: string): string {
  const words = plain(title);
  const chapter = CHAPTERS.find(each => each.in.some(word => words.includes(word)));
  if (!chapter) throw new Error(`No chapter for al-Bukhari's heading «${title}»`);
  return chapter.name;
}

/**
 * A story's chapter and its place in the list: a story set in a battle with a chapter goes under it (al-Bukhari files Ibn
 * Umar's «عام الفتح» under «حجة الوداع»), after his own stories there; else the first of its reports in al-Bukhari's sira
 * books gives the heading, in his order; else the chapter its own words name (after his, in that chapter); else «قصص أخرى», last.
 */
export function storyChapter(slug: string, sources: CatalogReportSource[], battle?: string): { chapter: string; at: number } {
  let his: { chapter: string; at: number } | undefined;
  for (const source of sources) {
    if (!isHadithSource(source) || source.slug !== 'sahih-al-bukhari') continue;
    const bab = siraBab(source.hadith);
    if (bab) { his = { chapter: chapterOfBab(bab.title), at: source.hadith }; break; }
  }
  const battleChapter = Object.keys(CHAPTER_BATTLE).find(name => CHAPTER_BATTLE[name] === battle);
  if (battleChapter && his?.chapter !== battleChapter) return { chapter: battleChapter, at: Number.MAX_SAFE_INTEGER };
  if (his) return his;
  const named = CHAPTER_OF_STORY[slug];
  return { chapter: named ?? OTHER_CHAPTER, at: Number.MAX_SAFE_INTEGER };
}

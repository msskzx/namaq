import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { noteLines, parseSurahTopics, rangeGaps, type Section, type SurahTopics } from './surahTopicsParse';

// docs/plans/surah-topics.md: each surah's sections from Quranpedia's surahs dump, where the note cites al-Tafsir
// al-Mawdu'i li-Suwar al-Quran al-Karim (University of Sharjah). Writes shared/data/quran/surahTopics.json and prints
// the ranges the source leaves out or counts twice.
const VERSION = '2026-11-14';
const URL = 'https://quranpedia.net/dumps/surahs.json.gz';
const DATA = join(__dirname, '../../shared/data/quran');

const dumpPath = join(tmpdir(), `quranpedia-surahs-${VERSION}.json`);
if (!existsSync(dumpPath)) execFileSync('sh', ['-c', `curl -sSf "${URL}" | gunzip > "${dumpPath}"`]);
const dump = JSON.parse(readFileSync(dumpPath, 'utf8')) as { license: { version: string }; data: { surah: number; information: { topics?: { value?: string | null } } }[] };
if (dump.license.version !== VERSION) throw new Error(`dump version ${dump.license.version}, expected ${VERSION}`);
const counts = JSON.parse(readFileSync(join(DATA, 'surahs.json'), 'utf8')) as { number: number; numberOfAyat: number }[];

// Surahs the dump leaves empty, read by hand from the same book's printed headings (vol. 7; the archive.org scan
// https://archive.org/details/20260607_20260607_1233, PDF pages 3771-3864). Each range is the one the book's running
// head gives for the pages under that heading. Al-Fatiha's are the book's «موضوعات سورة الفاتحة» (vol. 1 pp. 12-14),
// seven topics each taken from the words it names, so ayat 5 and 7 hold two and the basmala none.
const PRINTED: Record<number, SurahTopics> = {
  1: { volume: 1, page: 12, sections: [
    { title: 'الألوهية', from: 2, to: 3 },
    { title: 'اليوم الآخر', from: 4, to: 4 },
    { title: 'عبادة الله سبحانه وتعالى، والإخلاص لله تعالى فيها', from: 5, to: 5 },
    { title: 'الاستعانة بالله وحده', from: 5, to: 5 },
    { title: 'الالتزام بالصراط المستقيم', from: 6, to: 6 },
    { title: 'صراط المنعم عليهم', from: 7, to: 7 },
    { title: 'تجنب صراط المغضوب عليهم والضالين', from: 7, to: 7 },
  ] },
  42: { volume: 7, page: 61, sections: [
    { title: 'تنزيل الوحي وبيان جلال الله تعالى وعظمته', from: 1, to: 6 },
    { title: 'مقاصد الوحي الإلهي', from: 7, to: 12 },
    { title: 'وحدة الأديان في أصولها', from: 13, to: 14 },
    { title: 'الأمر بالدعوة والاستقامة، وإبطال حجج المعاندين', from: 15, to: 19 },
    { title: 'حتمية الجزاء للمؤمنين والظالمين، وقبول التوبة', from: 20, to: 26 },
    { title: 'مظاهر حكمة الله، وآياته الدالة على قدرته', from: 27, to: 35 },
    { title: 'صفات المؤمنين المستقيمين', from: 36, to: 43 },
    { title: 'مشهد يصور حال أهل النار', from: 44, to: 46 },
    { title: 'الأمر بالاستجابة لله والاستسلام لحكمته', from: 47, to: 50 },
    { title: 'الوحي وأقسامه', from: 51, to: 53 },
  ] },
  44: { volume: 7, page: 140, sections: [
    { title: 'إعجاز القرآن وإنزاله في ليلة مباركة', from: 1, to: 9 },
    { title: 'تهديد المشركين بالعذاب', from: 10, to: 16 },
    { title: 'تذكيرهم بقوم فرعون', from: 17, to: 33 },
    { title: 'إنكار المشركين البعث', from: 34, to: 39 },
    { title: 'الترهيب من مصير الفجار والمنكرين', from: 40, to: 50 },
    { title: 'الترغيب بما يلقاه المؤمنون', from: 51, to: 59 },
  ] },
};

// Ranges the dump mistypes, checked against the printed book. Each keeps what the dump says, so a later dump that
// fixes it (or changes it) stops the build instead of being overwritten.
const CORRECTED: { surah: number; title: string; dump: [number, number]; printed: [number, number]; where: string }[] = [
  // The dump's «(١٠٧-١٢١)» in a surah of 112. The section's page has the running head «سورة الأنبياء/١٠٧-١١٢» and quotes
  // 21:107-112 (vol. 5 p. 72; archive.org scan PDF page 2560).
  { surah: 21, title: 'ختام سلسلة الأنبياء رحمةٌ مهداة', dump: [107, 121], printed: [107, 112], where: 'vol. 5 p. 72' },
];

function correct(number: number, topics: SurahTopics): SurahTopics {
  const sections = JSON.parse(JSON.stringify(topics.sections)) as Section[];
  for (const fix of CORRECTED.filter(c => c.surah === number)) {
    const all = (list: Section[]): Section[] => list.flatMap(s => [s, ...all(s.parts ?? [])]);
    const found = all(sections).find(s => s.title === fix.title);
    if (!found || found.from !== fix.dump[0] || found.to !== fix.dump[1]) {
      throw new Error(`${number}: «${fix.title}» is no longer ${fix.dump.join('-')} in the dump; check the correction against the book`);
    }
    [found.from, found.to] = fix.printed;
  }
  return { ...topics, sections };
}

/** Every range must be one that can exist: whole numbers, from ≤ to, inside the surah. */
function impossible(number: number, numberOfAyat: number, list: Section[]): string[] {
  return list.flatMap(s => [
    ...(s.from === undefined ? [] : !Number.isInteger(s.from) || !Number.isInteger(s.to) || s.from < 1 || s.to! < s.from || s.to! > numberOfAyat
      ? [`${number}: «${s.title}» ${s.from}-${s.to} cannot exist in a surah of ${numberOfAyat} ayat`] : []),
    ...impossible(number, numberOfAyat, s.parts ?? []),
  ]);
}

const surahs: Record<number, SurahTopics> = {};
const errors: string[] = [];
const report: string[] = [];
for (const { number, numberOfAyat } of counts) {
  const note = dump.data.find(row => row.surah === number)?.information.topics?.value ?? '';
  const topics = parseSurahTopics(note) ?? PRINTED[number] ?? null;
  if (topics && PRINTED[number] && topics !== PRINTED[number]) throw new Error(`${number}: the dump now has a list; drop the printed one`);
  if (!topics) { report.push(`${number}: no Sharjah list${noteLines(note).length ? ' (the note cites another book)' : ' (empty note)'}`); continue; }
  if (!topics.sections.length) throw new Error(`${number}: cites the book but no heading parsed`);
  const fixed = correct(number, topics);
  errors.push(...impossible(number, numberOfAyat, fixed.sections));
  surahs[number] = fixed;
  report.push(...rangeGaps(fixed.sections, 1, numberOfAyat).map(gap => `${number}: ${gap}`));
}
// A range that cannot exist is never published: check it in the printed book and add it to CORRECTED.
if (errors.length) throw new Error(`impossible ranges:\n${errors.join('\n')}`);
writeFileSync(join(DATA, 'surahTopics.json'), `${JSON.stringify({ version: dump.license.version, surahs })}\n`);
console.log(`Wrote ${Object.keys(surahs).length} surahs.\n${report.join('\n')}`);

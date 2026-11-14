import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { noteLines, parseSurahTopics, rangeGaps, type SurahTopics } from './surahTopicsParse';

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
// head gives for the pages under that heading. Al-Fatiha stays out: the book treats it by aims, not by ranges of ayat.
const PRINTED: Record<number, SurahTopics> = {
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

const surahs: Record<number, SurahTopics> = {};
const report: string[] = [];
for (const { number, numberOfAyat } of counts) {
  const note = dump.data.find(row => row.surah === number)?.information.topics?.value ?? '';
  const topics = parseSurahTopics(note) ?? PRINTED[number] ?? null;
  if (!topics) { report.push(`${number}: no Sharjah list${noteLines(note).length ? ' (the note cites another book)' : ' (empty note)'}`); continue; }
  if (!topics.sections.length) throw new Error(`${number}: cites the book but no heading parsed`);
  const outside = JSON.stringify(topics).match(/"to":(\d+)/g)?.map(m => Number(m.slice(5))).filter(n => n > numberOfAyat);
  // Kept as the source has it (21 ends «١٠٧-١٢١» in a surah of 112), listed for the owner rather than repaired.
  if (outside?.length) report.push(`${number}: a range runs to ${outside.join(', ')}, past the last ayah ${numberOfAyat}`);
  surahs[number] = topics;
  report.push(...rangeGaps(topics.sections, 1, Math.max(numberOfAyat, ...(outside ?? []))).map(gap => `${number}: ${gap}`));
}
writeFileSync(join(DATA, 'surahTopics.json'), `${JSON.stringify({ version: dump.license.version, surahs })}\n`);
console.log(`Wrote ${Object.keys(surahs).length} surahs.\n${report.join('\n')}`);

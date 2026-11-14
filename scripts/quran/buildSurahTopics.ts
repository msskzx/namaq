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

const surahs: Record<number, SurahTopics> = {};
const report: string[] = [];
for (const { number, numberOfAyat } of counts) {
  const note = dump.data.find(row => row.surah === number)?.information.topics?.value ?? '';
  const topics = parseSurahTopics(note);
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

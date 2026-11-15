import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { readUkbari, matchHeading, type UkbariEntry } from './irabUkbari';

// docs/plans/irab.md: the reader's i'rab sheet. Two files come out of Quranpedia's dumps:
// - shared/data/quran/irab.json, built into the app: every word's role (the Quranic Treebank) and its morphology line
//   (the Quranic Arabic Corpus, in Arabic as Quranpedia gives it).
// - shared/data/quran/irabUkbari.json, a book the phone downloads: al-'Ukbari's al-Tibyan cut at the words he discusses.
const DUMPS = 'https://quranpedia.net/dumps';
const VERSIONS = { morphology: '2026-11-14', syntax: '2026-11-14', 'e3rab-book-309': '2026-08-10' } as const;
const OUT = join(__dirname, '../../shared/data/quran');

// As JSON both files are too large for TypeScript to infer a type from (like compareCards.js), so each is a module
// that parses its JSON, with a declaration beside it.
function writeData(name: string, type: string, data: unknown) {
  writeFileSync(join(OUT, `${name}.js`), `export default JSON.parse(${JSON.stringify(JSON.stringify(data))});\n`);
  writeFileSync(join(OUT, `${name}.d.ts`), `// Generated next to this file by \`npm run quran:irab\`.\nimport type { ${type} } from '../../quran/irab';\ndeclare const data: ${type};\nexport default data;\n`);
}

function dump<T>(name: keyof typeof VERSIONS): T & { license: { version: string } } {
  const path = join(tmpdir(), `quranpedia-${name}-${VERSIONS[name]}.json`);
  if (!existsSync(path)) execFileSync('sh', ['-c', `curl -sSf "${DUMPS}/${name}.json.gz" | gunzip > "${path}"`]);
  const data = JSON.parse(readFileSync(path, 'utf8'));
  if (data.license.version !== VERSIONS[name]) throw new Error(`${name} is version ${data.license.version}, expected ${VERSIONS[name]}`);
  return data;
}

type Segment = { description: string };
type MorphWord = { number: number; text: string; segments: Segment[] };
type Token = { rel_ar: string | null; head: { surah: number; ayah: number; word: number } | null };
type SyntaxWord = { number: number; tokens: Token[] };
const morphology = dump<{ data: { surah: number; ayah: number; morphology: { words: MorphWord[] } }[] }>('morphology').data;
const syntax = dump<{ data: { surah: number; ayah: number; syntax: { sentences: { words: SyntaxWord[] }[] } }[] }>('syntax').data;

const strings: string[] = [];
const stringIds = new Map<string, number>();
const intern = (text: string) => {
  let id = stringIds.get(text);
  if (id === undefined) { id = strings.length; strings.push(text); stringIds.set(text, id); }
  return id;
};

// Per ayah, per corpus word: [role, morphology, head]. The role is the treebank's Arabic relations of the word's tokens
// ("خبر يكن"); the head is the word (from 0) the role points at in the same ayah, or -1.
const rolesOf = new Map<string, Map<number, SyntaxWord>>();
for (const row of syntax) {
  const words = new Map<number, SyntaxWord>();
  for (const sentence of row.syntax.sentences) for (const word of sentence.words) if (!words.has(word.number)) words.set(word.number, word);
  rolesOf.set(`${row.surah}:${row.ayah}`, words);
}
// Ayat in mushaf order (shared/quran/irab.ts finds an ayah from the surahs' lengths): an array keeps the JSON cheap for TypeScript.
const ayat: number[][][] = [];
const uthmani: Record<string, string[]> = {};
let words = 0;
let withRole = 0;
for (const row of [...morphology].sort((x, y) => x.surah - y.surah || x.ayah - y.ayah)) {
  const key = `${row.surah}:${row.ayah}`;
  const roles = rolesOf.get(key);
  uthmani[key] = row.morphology.words.map(word => word.text);
  ayat.push(row.morphology.words.map(word => {
    words++;
    const tokens = roles?.get(word.number)?.tokens ?? [];
    const named = tokens.filter(token => token.rel_ar);
    const role = [...new Set(named.map(token => token.rel_ar!))].join('، ');
    if (role) withRole++;
    const head = named.map(token => token.head).find(at => at && at.surah === row.surah && at.ayah === row.ayah && at.word !== word.number);
    const morph = word.segments.map(segment => segment.description).join(' · ');
    return [role ? intern(role) : -1, intern(morph), head ? head.word - 1 : -1];
  }));
}
if (ayat.length !== 6236) throw new Error(`expected 6,236 ayat, got ${ayat.length}`);
if (words !== 77429) throw new Error(`expected the corpus's 77,429 words, got ${words}`);
writeData('irab', 'IrabData', { source: { morphology: VERSIONS.morphology, syntax: VERSIONS.syntax }, strings, ayat });
console.log(`irab: ${words} words, ${withRole} with a role, ${strings.length} strings`);

const book = dump<Parameters<typeof readUkbari>[0]>('e3rab-book-309');
const { entries: read, unplaced } = readUkbari(book, (key, heading) => matchHeading(uthmani[key] ?? [], heading));
// A passage the reading left on an ayah its surah does not have (a count run past the last quote) is dropped.
const entries = read.filter(entry => uthmani[`${entry[0]}:${entry[1]}`]);
if (read.length - entries.length > 20) throw new Error(`${read.length - entries.length} passages on no ayah`);
// The book runs in mushaf order, so a passage on an ayah well before the one ahead of it is likely misplaced. Fourteen
// remain on 2026-11-15, some of them al-'Ukbari's own look back; more means the reading went wrong.
const backwards = entries.filter((entry, i) => i > 0 && entry[0] === entries[i - 1][0] && entry[1] < entries[i - 1][1] - 1).length;
if (backwards > 20) throw new Error(`${backwards} passages run back within their surah`);
const placed = entries.filter((entry: UkbariEntry) => entry[2] >= 0).length;
// The phone downloads this file, so it names Quranpedia and the dump's version as their licence asks of a download.
writeData('irabUkbari', 'UkbariData', { source: { version: VERSIONS['e3rab-book-309'], book: 309, from: 'الموسوعة القرآنية https://quranpedia.net' }, entries });
console.log(`irabUkbari: ${entries.length} passages (${read.length - entries.length} on no ayah dropped), ${placed} on words, ${entries.length - placed} on whole ayat, ${unplaced} headings merged into the passage before`);

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import gharib from '../../shared/data/quran/gharib';
import type { GharibData, GharibWord, GharibWordsData } from '../../shared/quran/gharib';

/**
 * Which word each of Ibn Qutaybah's phrase entries explains (owner, 2026-11-21). Two agents marked every entry quoting more
 * than one word, blind of each other (gharibWords/passA.jsonl, passB.jsonl; their brief in gharibWords/README.md): the words
 * he explains, "phrase" when he explains it as a whole, or "unclear". A mark both gave alike is kept (phrase and unclear
 * alike, as neither puts the entry on a page). The owner's answer (gharibWords/owner.json: the word ids, or [] for none)
 * decides any entry, and where the two differed with no answer yet the entry stays off the word pages. The marks are
 * entry indexes of the gharib.js built from the book named in gharibWords/source.json.
 */
type Mark = { at: number; mark: 'words' | 'phrase' | 'unclear'; words?: string[] };
const DIR = join(__dirname, 'gharibWords');
const data = gharib as GharibData;
const source = JSON.parse(readFileSync(join(DIR, 'source.json'), 'utf8')) as GharibData['source'];
if (source.sha !== data.source.sha) throw new Error(`the marks were made on gharib ${source.sha}, not ${data.source.sha}: mark again`);

const quotedOf = (at: number) => new Set(data.entries[at][4].flatMap(([ayah, from, to]) => Array.from({ length: to - from + 1 }, (_, i) => `${ayah}:${from + i}`)));
const phrases = new Set(data.entries.flatMap((_, at) => (quotedOf(at).size > 1 ? [at] : [])));
function read(name: string) {
  const marks = new Map<number, Mark>();
  for (const line of readFileSync(join(DIR, name), 'utf8').split('\n').filter(Boolean)) {
    const mark = JSON.parse(line) as Mark;
    if (marks.has(mark.at)) throw new Error(`${name}: entry ${mark.at} twice`);
    if (!phrases.has(mark.at)) throw new Error(`${name}: entry ${mark.at} quotes no phrase`);
    if (!['words', 'phrase', 'unclear'].includes(mark.mark)) throw new Error(`${name}: entry ${mark.at} has mark ${mark.mark}`);
    if (mark.mark === 'words' && !mark.words?.length) throw new Error(`${name}: entry ${mark.at} marks no word`);
    marks.set(mark.at, mark);
  }
  if (marks.size !== phrases.size) throw new Error(`${name}: ${phrases.size - marks.size} phrase entries unmarked`);
  return marks;
}
const a = read('passA.jsonl');
const b = read('passB.jsonl');
const owner: Record<string, string[]> = existsSync(join(DIR, 'owner.json')) ? JSON.parse(readFileSync(join(DIR, 'owner.json'), 'utf8')) : {};
const ids = (mark: Mark) => [...(mark.words ?? [])].sort().join(' ');
const off = (mark: Mark) => mark.mark !== 'words';

const words: Record<string, GharibWord[]> = {};
let agreed = 0;
let answered = 0;
let open = 0;
for (const at of phrases) {
  const [first, second] = [a.get(at)!, b.get(at)!];
  let chosen: string[] | null = null;
  if (owner[at]) { answered++; chosen = owner[at]; }
  else if (off(first) && off(second)) { agreed++; chosen = []; }
  else if (first.mark === second.mark && ids(first) === ids(second)) { agreed++; chosen = first.words!; }
  else open++;
  if (!chosen?.length) continue;
  const quoted = quotedOf(at);
  for (const id of chosen) if (!quoted.has(id)) throw new Error(`entry ${at}: ${id} is not a word it quotes`);
  words[at] = chosen.map(id => id.split(':').map(Number) as GharibWord);
}
for (const at of Object.keys(owner)) if (!phrases.has(Number(at))) throw new Error(`owner.json: entry ${at} quotes no phrase`);
const out: GharibWordsData = { source, words };
writeFileSync(join(__dirname, '../../shared/data/quran/gharibWords.json'), `${JSON.stringify(out)}\n`);
console.log(`gharib words: ${phrases.size} phrase entries, ${agreed} marked alike, ${answered} answered by the owner, ${open} open; ${Object.keys(words).length} explain a word`);

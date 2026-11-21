import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import gharib from '../../shared/data/quran/gharib';
import type { GharibData, GharibWord, GharibWordsData } from '../../shared/quran/gharib';

/**
 * Which word each of Ibn Qutaybah's phrase entries explains (owner, 2026-11-21). Two agents marked every entry quoting more
 * than one word, blind of each other (gharibWords/passA.jsonl, passB.jsonl; their brief in gharibWords/README.md): the words
 * he explains, "phrase" when he explains it as a whole, or "unclear". A mark both gave alike is kept (phrase and unclear alike, as
 * neither puts the entry on a page); where they differed,
 * the owner's answer (gharibWords/owner.json: the word ids, or [] for none) decides, and with no answer yet the entry
 * stays off the word pages.
 */
type Mark = { at: number; mark: 'words' | 'phrase' | 'unclear'; words?: string[] };
const DIR = join(__dirname, 'gharibWords');
const read = (name: string) => new Map(readFileSync(join(DIR, name), 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line) as Mark).map(mark => [mark.at, mark]));
const a = read('passA.jsonl');
const b = read('passB.jsonl');
const owner: Record<string, string[]> = existsSync(join(DIR, 'owner.json')) ? JSON.parse(readFileSync(join(DIR, 'owner.json'), 'utf8')) : {};
const ids = (mark: Mark) => [...(mark.words ?? [])].sort().join(' ');
const toWords = (list: string[]): GharibWord[] => list.map(id => id.split(':').map(Number) as GharibWord);

const data = gharib as GharibData;
const words: Record<string, GharibWord[]> = {};
let agreed = 0;
let answered = 0;
let open = 0;
for (const [at, first] of a) {
  const second = b.get(at);
  if (!second) throw new Error(`entry ${at}: only one marker`);
  const places = data.entries[at][4];
  const quoted = new Set(places.flatMap(([ayah, from, to]) => Array.from({ length: to - from + 1 }, (_, i) => `${ayah}:${from + i}`)));
  let chosen: string[] | null = null;
  // "phrase" and "unclear" both keep an entry off the word pages, so they agree as well.
  const off = (mark: Mark) => mark.mark !== 'words';
  if (off(first) && off(second)) { agreed++; chosen = []; }
  else if (first.mark === second.mark && ids(first) === ids(second)) { agreed++; chosen = first.words!; }
  else if (owner[at]) { answered++; chosen = owner[at]; }
  else open++;
  if (!chosen?.length) continue;
  for (const id of chosen) if (!quoted.has(id)) throw new Error(`entry ${at}: ${id} is not a word it quotes`);
  words[at] = toWords(chosen);
}
const out: GharibWordsData = { source: data.source, words };
writeFileSync(join(__dirname, '../../shared/data/quran/gharibWords.json'), `${JSON.stringify(out)}\n`);
console.log(`gharib words: ${a.size} phrase entries, ${agreed} marked alike, ${answered} answered by the owner, ${open} open; ${Object.keys(words).length} explain a word`);

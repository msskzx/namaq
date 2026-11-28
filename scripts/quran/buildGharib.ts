import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { skeleton } from './irabUkbari';
import { firstWords, gharibEntry, headingsFor, letters, meaningOf, meaningPicks, placeEntry, quotesOf, readGharib, readMufradat, type MushafWord, type TurathPage } from './gharib';
import type { GharibData, GharibPlace, MufradatData } from '../../shared/quran/gharib';

// see docs/plans/alfaz-al-quran.md
const OUT = join(__dirname, '../../shared/data/quran');
const BOOKS = {
  gharib: { id: 3259, sha: '80470a2c1cc8a81fd6d30379ef6901635c3c3c5b399c0b0ebb87675f1159c749' },
  mufradat: { id: 23636, sha: '35d8257c65e9e5fcaf975f7bbdbebf36a3ff2227f5e5d4e9610fe0e0121dc296' },
};
const GHARIB_FIRST = 36;

function load({ id, sha }: { id: number; sha: string }) {
  const path = join(tmpdir(), `turath-${id}.json`);
  if (!existsSync(path)) writeFileSync(path, execFileSync('curl', ['-fsSL', `https://files.turath.io/books-v3/${id}.json`], { maxBuffer: 32 * 1024 * 1024 }));
  const raw = readFileSync(path);
  const got = createHash('sha256').update(raw).digest('hex');
  if (got !== sha) throw new Error(`Turath ${id}: sha ${got}, expected ${sha}`);
  return (JSON.parse(raw.toString('utf8')) as { pages: TurathPage[] }).pages.map((page, i) => ({ ...page, id: i + 1 }));
}

const mushaf: MushafWord[] = [];
const ayahLength = new Map<string, number>();
{
  let surah = 0;
  let next = 1;
  let at = 0;
  for (let page = 1; page <= 604; page++) {
    for (const item of JSON.parse(readFileSync(join(OUT, 'mushaf', `${page}.json`), 'utf8')).items as { surah?: number; line?: (string | number)[] }[]) {
      if (item.surah) [surah, next, at] = [item.surah, 1, 0];
      for (const token of item.line ?? []) {
        if (typeof token === 'number') { ayahLength.set(`${surah}:${token}`, at); [next, at] = [token + 1, 0]; continue; }
        if (token === '۞') continue;
        mushaf.push({ surah, ayah: next, at: at++, skeleton: skeleton(token), text: token });
      }
    }
  }
}
const first = firstWords(mushaf);

const raw = readGharib(load(BOOKS.gharib).filter(page => page.id >= GHARIB_FIRST));
const surahs = new Set(raw.map(entry => entry.surah));
if (surahs.size !== 112 || Math.max(...surahs) !== 112) throw new Error(`gharib: ${surahs.size} surah sections`);
const gharib: GharibData = { source: { book: BOOKS.gharib.id, sha: BOOKS.gharib.sha }, entries: [], questions: [], meanings: {} };
let after = 0;
let unplaced = 0;
for (const entry of raw) {
  if (entry.numbered) after = entry.from;
  const places = placeEntry(entry, mushaf, first, after);
  if (!places.length) { unplaced++; continue; }
  after = Math.max(after, ...places.map(place => place[0]));
  gharib.entries.push(gharibEntry(entry, places));
}

const review = JSON.parse(readFileSync(join(__dirname, 'meaningReview.json'), 'utf8')) as { notMeaning: string[]; apart: [string, string][]; ambiguous: Record<string, string> };
const keyOf = (at: number) => `${gharib.entries[at][2]}:${quotesOf(gharib.entries[at][3])[0] ?? ''}`;
const notMeaning = new Set(review.notMeaning);
const keys = new Set(gharib.entries.map((_, at) => keyOf(at)));
for (const key of [...notMeaning, ...Object.keys(review.ambiguous)]) if (!keys.has(key)) throw new Error(`meaningReview.json: no entry ${key}`);
const byPlace = new Map(mushaf.map(word => [`${word.surah}:${word.ayah}:${word.at}`, word.skeleton]));
const firstPlaced = (surah: number, text: string, [ayah, from, to]: GharibPlace) => {
  if (from < 0) return false;
  const words = Array.from({ length: to - from + 1 }, (_, i) => byPlace.get(`${surah}:${ayah}:${from + i}`) ?? '');
  const spans = words.flatMap((word, i) => [word, word + (words[i + 1] ?? '')]);
  const tokens = (quotesOf(text)[0] ?? '').replace(/[^ء-ۭ\s]/g, ' ').split(/\s+/).filter(Boolean)
    .map(token => skeleton(letters(token).replace(/^(?:وال|فال|بال|ال|و|ف)(?=...)/, '')));
  return tokens.some(Boolean) && tokens.every(token => !token || (token.length < 2 ? words.some(word => word.endsWith(token)) : spans.some(span => span.includes(token))));
};
const trees = JSON.parse(readFileSync(join(OUT, 'trees.json'), 'utf8')) as { ayat: { key: string; roots?: (string | null)[] }[] };
const treeAyat = new Map(trees.ayat.map(ayah => [ayah.key, ayah]));
const rootsOf = (surah: number, [ayah, from, to]: GharibPlace) => {
  const tree = treeAyat.get(`${surah}:${ayah}`);
  return from < 0 || !tree ? [] : [...new Set(Array.from({ length: to - from + 1 }, (_, i) => tree.roots?.[from + i]).filter((root): root is string => !!root))];
};
const candidates = gharib.entries.map(([surah, , , text, places], at) => ({ surah, roots: places.length ? rootsOf(surah, places[0]) : [], text: notMeaning.has(keyOf(at)) || !places.length || !firstPlaced(surah, text, places[0]) ? '' : text, places, quote: quotesOf(text)[0] ?? '' }));
const asked = new Set<string>();
gharib.questions = meaningPicks(candidates, review.apart.map(pair => pair.map(letters) as [string, string]))
  .filter(pick => {
    const same = `${skeleton(candidates[pick.asked].quote)}=${meaningOf(candidates[pick.asked])}`;
    if (asked.has(same)) return false;
    asked.add(same);
    return !review.ambiguous[keyOf(pick.asked)];
  })
  .map(pick => [pick.asked, ...pick.others]);
gharib.meanings = Object.fromEntries([...new Set(gharib.questions.flat())].sort((a, b) => a - b).map(at => [at, meaningOf(candidates[at])!]));

const mufradatEntries = readMufradat(load(BOOKS.mufradat));
const headings = new Map<string, number[]>();
mufradatEntries.forEach(([heading], at) => { const key = letters(heading); headings.set(key, [...(headings.get(key) ?? []), at]); });
const BUCKWALTER: Record<string, string> = {
  "'": 'ء', '>': 'أ', '&': 'ؤ', '<': 'إ', '}': 'ئ', A: 'ا', b: 'ب', p: 'ة', t: 'ت', v: 'ث', j: 'ج', H: 'ح', x: 'خ', d: 'د', '*': 'ذ',
  r: 'ر', z: 'ز', s: 'س', $: 'ش', S: 'ص', D: 'ض', T: 'ط', Z: 'ظ', E: 'ع', g: 'غ', f: 'ف', q: 'ق', k: 'ك', l: 'ل', m: 'م',
  n: 'ن', h: 'ه', w: 'و', Y: 'ى', y: 'ي',
};
const ALIASES: Record<string, string> = {
  جزي: 'جزا', سوي: 'سوا', رضو: 'رضي', غشو: 'غشي', لهو: 'لهى', ضحو: 'ضحى', تسع: 'تسعة', شفي: 'شفا', عثو: 'عثى', خنزر: 'خنزير',
  قصو: 'قصى', لفو: 'لفى', حوط: 'حيط', مطو: 'مطى', سجو: 'سجى', موه: 'ماء', سوع: 'ساعة', خور: 'خوار', حوي: 'حوايا', ارك: 'أريك',
  برهن: 'بره', صلصل: 'صلل', ذبذب: 'ذب', كبكب: 'كب', زحزح: 'زحح', حصحص: 'حصَ', رفرف: 'رف', صفصف: 'صف', تيه: 'التيه', يمم: 'اليم', صلي: 'صلا', زني: 'زنا',
};
const words: Record<string, number[]> = {};
let rooted = 0;
let linked = 0;
const several = new Map<string, number>();
const none = new Map<string, number>();
for (const ayah of trees.ayat) {
  const length = ayahLength.get(ayah.key);
  if (length === undefined) continue;
  const links = Array.from({ length }, (_, at) => {
    const roots = ayah.roots?.[at] ? [ayah.roots[at]!] : [];
    if (roots.length !== 1) return -1;
    rooted++;
    const root = [...roots[0]].map(c => BUCKWALTER[c] ?? c).join('');
    const alias = ALIASES[root];
    const fits = alias ? mufradatEntries.flatMap(([heading], at) => (heading === alias ? [at] : [])) : headingsFor(root, headings);
    if (fits.length === 1) { linked++; return fits[0]; }
    (fits.length ? several : none).set(root, ((fits.length ? several : none).get(root) ?? 0) + 1);
    return -1;
  });
  if (links.some(link => link >= 0)) words[ayah.key] = links;
}
for (const [root, heading] of Object.entries(ALIASES)) if (mufradatEntries.filter(([h]) => h === heading).length !== 1) throw new Error(`alias ${root}: no single heading ${heading}`);
const mufradat: MufradatData = { source: { book: BOOKS.mufradat.id, sha: BOOKS.mufradat.sha }, entries: mufradatEntries, words };

for (const [name, data, type] of [['gharib', gharib, 'GharibData'], ['mufradat', mufradat, 'MufradatData']] as const) {
  writeFileSync(join(OUT, `${name}.js`), `export default JSON.parse(${JSON.stringify(JSON.stringify(data))});\n`);
  writeFileSync(join(OUT, `${name}.d.ts`), `// Generated next to this file by \`npm run quran:gharib\`.\nimport type { ${type} } from '../../quran/gharib';\ndeclare const data: ${type};\nexport default data;\n`);
}

const top = (map: Map<string, number>) => [...map].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([root, count]) => `${root} ${count}`).join('، ');
const ayat = new Set(gharib.entries.flatMap(([surah, , , , places]) => places.map(([ayah]) => `${surah}:${ayah}`)));
console.log(`gharib: ${raw.length} entries, ${gharib.entries.length} placed on ${ayat.size} ayat, ${unplaced} not found in their surah; ${gharib.questions.length} questions`);
console.log(`mufradat: ${mufradatEntries.length} articles; ${rooted} page words with one root, ${linked} linked to one article`);
console.log(`  roots with several headings: ${several.size} (${top(several)})`);
console.log(`  roots with no heading: ${none.size} (${top(none)})`);

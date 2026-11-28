import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import corpus from '../../shared/quran/quranText/corpus';
import type { BranchAyah } from '../../shared/quran/branches';
import itqan from '../../shared/data/quran/itqanBalagha';
import { itqanAt, type ItqanData } from '../../shared/quran/itqanBalagha';
import { singleAyahPassages, tafsirSadiOf } from '../../shared/quran/tafsirSadiData';
import { withoutOpeningQuote } from '../../shared/quran/ayahNotes';
import { irabWordsAt } from '../../shared/quran/irabData';
import { corpusWords } from '../../shared/quran/words';
import { qiraatAyat, qiraatOf } from '../../shared/quran/qiraatData';
import { wholeReaders } from '../../shared/quran/qiraat';
import { normalizeWord } from '../../shared/quran/normalize';
import { seededRandom } from '../../shared/quiz/feedQuiz';
import { shuffle } from '../../shared/quiz/random';
import { quotesOf, stem, stems } from '../../shared/quiz/ayahQuizText';
import type { AyahQuizzes } from '../../shared/quiz/ayahQuizzes';
import { BROAD_TERMS, termOf } from '../../shared/quran/balaghaTerms';

// see docs/feed-cards.md
const OUT = join(__dirname, '../../shared/data/quran/ayahQuizzes.json');
const REVIEW = join(__dirname, 'ayahQuizReview.json');
type Review = { tafsir: Record<string, string>; avoid: Record<string, string[]>; drop: Record<string, string> };
const review: Review = JSON.parse(readFileSync(REVIEW, 'utf8'));
const dropped = (id: string) => id in review.drop;
let random = seededRandom(20261118);
const seedOf = (id: string) => [...id].reduce((hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0, 20261118);
const reseed = (id: string) => { random = seededRandom(seedOf(id)); };

const ayat = corpus.ayat as BranchAyah[];
const byKey = new Map(ayat.map(ayah => [ayah.key, ayah]));
const order = new Map(ayat.map((ayah, i) => [ayah.key, i]));
const surahOf = (key: string) => Number(key.split(':')[0]);

const seen = new Map<string, number>();
for (const ayah of ayat) for (const word of stems(ayah.words)) seen.set(word, (seen.get(word) ?? 0) + 1);
const telling = (words: Set<string>) => new Set([...words].filter(word => (seen.get(word) ?? 0) < ayat.length / 100));

function tafsirBank() {
  const out: AyahQuizzes['tafsir'] = [];
  const candidates: { key: string; text: string; hidden: number[] }[] = [];
  for (const key of singleAyahPassages()) {
    const text = withoutOpeningQuote(tafsirSadiOf(key)!.text);
    const own = stems(byKey.get(key)!.words);
    const hidden = quotesOf(text).flatMap((quote, i) => {
      const words = [...stems(quote)];
      return words.length && words.filter(word => own.has(word)).length * 2 >= words.length ? [i] : [];
    });
    candidates.push({ key, text, hidden });
  }
  for (const { key, text, hidden } of candidates) {
    if (review.tafsir[key] !== 'keep' || dropped(`tafsir:${key}`)) continue;
    if (/:\s*$/.test(text)) continue;
    reseed(`tafsir:${key}`);
    const right = byKey.get(key)!;
    const said = new Set([...stems(text), ...stems(right.words)]);
    const fits = (other: BranchAyah) => other.key !== key && !review.avoid[key]?.includes(other.key) && other.words.length >= right.words.length * 0.6 && other.words.length <= right.words.length * 1.6
      && ![...telling(stems(other.words))].some(word => said.has(word));
    const near = shuffle(ayat.filter(other => Math.abs(surahOf(other.key) - surahOf(key)) <= 3 && fits(other)), random);
    const far = near.length >= 2 ? [] : shuffle(ayat.filter(fits), random);
    const wrong = [...near, ...far].slice(0, 2);
    if (wrong.length < 2) continue;
    out.push([key, wrong[0].key, wrong[1].key, hidden]);
  }
  return { out, candidates };
}

const FAMILY: Record<number, number> = { 53: 52 };
function balaghaBank() {
  const data = itqan as ItqanData;
  const labels: string[] = [];
  const labelOf = (kind: number, heading: string) => {
    const label = termOf(kind, heading);
    if (!label) return -1;
    if (!labels.includes(label)) labels.push(label);
    return labels.indexOf(label);
  };
  const chapterOf = new Map<number, number>();
  const count = new Map<number, number>();
  type Run = { key: string; through: number; entry: number; label: number };
  const runs: Run[] = [];
  data.entries.forEach(([kind, heading, , , , , , places], entry) => {
    const label = labelOf(kind, heading);
    if (label < 0) return;
    chapterOf.set(label, kind);
    const sure = [...new Set(places.filter(place => place[4] === 1).map(([surah, ayah]) => `${surah}:${ayah}`))].sort((a, b) => order.get(a)! - order.get(b)!);
    for (let i = 0; i < sure.length;) {
      let j = i;
      while (j + 1 < sure.length && order.get(sure[j + 1]) === order.get(sure[j])! + 1 && surahOf(sure[j + 1]) === surahOf(sure[i])) j++;
      runs.push({ key: sure[i], through: Number(sure[j].split(':')[1]), entry, label });
      count.set(label, (count.get(label) ?? 0) + 1);
      i = j + 1;
    }
  });
  const family = (label: number) => { const kind = chapterOf.get(label) ?? -1; return FAMILY[kind] ?? kind; };
  const out: AyahQuizzes['balagha']['questions'] = [];
  const asked = new Set<string>();
  const pool = labels.map((_, i) => i);
  for (const run of runs) {
    if (asked.has(run.key) || dropped(`balagha:${run.key}`)) continue;
    asked.add(run.key);
    reseed(`balagha:${run.key}`);
    const [surah, from] = run.key.split(':').map(Number);
    const keys = Array.from({ length: run.through - from + 1 }, (_, i) => `${surah}:${from + i}`);
    const paragraphs = keys.flatMap(key => itqanAt(data, key));
    const cited = new Set(paragraphs.map(p => Number(Object.keys(data.kinds).find(kind => data.kinds[Number(kind)] === p.kind))).map(kind => FAMILY[kind] ?? kind));
    const citedLabels = new Set(paragraphs.map(p => labels.indexOf((p.heading && termOf(0, p.heading)) || '')).filter(i => i >= 0));
    const rightWords = stems(labels[run.label]);
    const avoid = [...(review.avoid[`balagha:${run.key}`] ?? []), ...BROAD_TERMS];
    const ok = (label: number) => label !== run.label && !citedLabels.has(label) && !avoid.includes(labels[label]) && !cited.has(family(label))
      && ![...stems(labels[label])].some(word => rightWords.has(word));
    const weighted = shuffle(pool.filter(ok), random).sort((a, b) => (count.get(b) ?? 0) * random() - (count.get(a) ?? 0) * random());
    const first = weighted[0];
    const second = weighted.find(label => label !== first && family(label) !== family(first)) ?? weighted.find(label => label !== first && ![...stems(labels[label])].some(word => stems(labels[first]).has(word)));
    if (first === undefined || second === undefined) continue;
    out.push([run.key, run.through, run.entry, run.label, first, second]);
  }
  return { labels, questions: out };
}

const CASES: Record<string, 'مرفوع' | 'منصوب' | 'مجرور'> = {
  'فاعل': 'مرفوع', 'نائب فاعل': 'مرفوع', 'خبر إن': 'مرفوع', 'خبر أن': 'مرفوع', 'اسم كان': 'مرفوع',
  'مفعول به': 'منصوب', 'اسم إن': 'منصوب', 'اسم أن': 'منصوب', 'خبر كان': 'منصوب', 'مفعول مطلق': 'منصوب', 'تمييز': 'منصوب',
  'مضاف إليه': 'مجرور',
};
const SAME = [['اسم إن', 'اسم أن'], ['خبر إن', 'خبر أن']];
const PARTNER: Record<string, string> = { 'اسم إن': 'خبر إن', 'خبر إن': 'اسم إن', 'اسم أن': 'خبر أن', 'خبر أن': 'اسم أن', 'اسم كان': 'خبر كان', 'خبر كان': 'اسم كان', 'فاعل': 'مفعول به', 'مفعول به': 'فاعل', 'نائب فاعل': 'فاعل' };
const ADVERBS = new Set(['غير', 'مكان', 'يوم', 'حين', 'قبل', 'بعد', 'وراء', 'دون', 'ساعه', 'ليل', 'نهار', 'غدا', 'امس', 'اخري', 'اخر']);
const NUMBERS = new Set(['ألف', 'مأي', 'ثني', 'ثلث', 'ربع', 'خمس', 'سدس', 'سبع', 'ثمن', 'تسع', 'عشر', 'وحد']);
const SET_PHRASES = new Set(['سبحان', 'سنه', 'وعد', 'صبغه']);
const KANA = /الجذر \((?:كون|ليس|صبح|ظلل|بيت|مسي|صير|زول|برح|فتأ|دوم)\)/;
function settled(ayah: BranchAyah, word: number, role: string, lines: ReturnType<typeof irabWordsAt>): boolean {
  const line = lines[word];
  const head = line.head;
  if ((role === 'فاعل' || role === 'نائب فاعل') && (head === null || head > word || !lines[head]?.morph.startsWith('فعل'))) return false;
  if ((role === 'فاعل' || role === 'نائب فاعل') && head !== null && /\u0651[\u064B-\u0650]*$/.test(ayah.words[head] ?? '')) return false;
  if (/^(?:اسم|خبر) كان$/.test(role) && ayah.words.some(other => stem(other) === 'كيف')) return false;
  if ((role === 'فاعل' || role === 'مفعول به') && lines.some(other => other.morph.startsWith('فعل') && KANA.test(other.morph))) return false;
  const root = (morph: string | undefined) => morph?.match(/الجذر \((.+?)\)/)?.[1];
  const indefinite = !line.morph.includes('أل التعريف') && !/علم/.test(line.morph) && !lines.some(other => other.head === word && /مضاف إليه/.test(other.role ?? ''));
  if (role === 'مفعول به' && (indefinite || /نكرة|مصدر/.test(line.morph))) return false;
  const bare = stem(ayah.words[word] ?? '').replace(/ا$/, '');
  if (role !== 'مضاف إليه' && (ADVERBS.has(bare) || NUMBERS.has(root(line.morph) ?? ''))) return false;
  if (role === 'مفعول مطلق' && !SET_PHRASES.has(bare) && !lines.some(other => other.morph.startsWith('فعل') && root(other.morph) === root(line.morph))) return false;
  if (role === 'مفعول به' && head !== null && /الجذر \((?:دخل|سبق|سكن)\)/.test(lines[head]?.morph ?? '') && !/الوزن \(أَفْعَلَ\)/.test(lines[head]?.morph ?? '')) return false;
  if (role === 'مفعول به' && /الجذر \(ضرب\)/.test(head !== null ? lines[head]?.morph ?? '' : '')) return false;
  if (role === 'نائب فاعل' && head !== null && lines.slice(head + 1, word).some(other => /حرف جر/.test(other.morph))) return false;
  if (role === 'مفعول به' && head !== null && root(line.morph) === root(lines[head]?.morph)) return false;
  const particle = role.match(/^(?:اسم|خبر) (إن|أن)$/)?.[1];
  if (particle) {
    let at = head;
    for (let steps = 0; at !== null && !/الحروف الناسخة/.test(lines[at]?.morph ?? ''); steps++) at = steps < 3 ? lines[at]?.head ?? null : null;
    if (at === null || at > word) return false;
    const written = (ayah.words[at] ?? '').replace(/^[وف]/, '');
    if (!written.startsWith(particle === 'إن' ? 'إ' : 'أ')) return false;
    for (let between = at + 1; between < word; between++) {
      const morph = lines[between]?.morph ?? '';
      if (/ضمير منفصل|ظرف|حرف جر/.test(morph)) return false;
    }
  }
  return true;
}

function irabBank() {
  const roles = Object.keys(CASES);
  const out: AyahQuizzes['irab']['questions'] = [];
  for (const ayah of ayat) {
    const lines = irabWordsAt(ayah.key);
    const fit = ayah.words.flatMap((_, at) => {
      const under = corpusWords(ayah.key, at);
      if (under.length !== 1) return [];
      const line = lines[under[0]];
      if (!line?.role || !(line.role in CASES)) return [];
      const parts = line.morph.split(' · ').filter(part => part !== 'أل التعريف');
      if (parts.length !== 1 || !parts[0].startsWith('اسم') || !parts[0].includes(CASES[line.role])) return [];
      if (!settled(ayah, under[0], line.role, lines)) return [];
      return [{ at, role: line.role }];
    });
    if (!fit.length || dropped(`irab:${ayah.key}`)) continue;
    reseed(`irab:${ayah.key}`);
    const { at, role } = fit[Math.floor(random() * fit.length)];
    const same = SAME.find(pair => pair.includes(role)) ?? [role];
    const others = shuffle(roles.filter(other => !same.includes(other)), random);
    const partner = PARTNER[role] && !same.includes(PARTNER[role]) ? PARTNER[role] : others.find(other => CASES[other] !== CASES[role])!;
    const third = others.find(other => other !== partner && CASES[other] !== CASES[partner] && !SAME.some(pair => pair.includes(other) && pair.includes(partner)))!;
    out.push([ayah.key, at, roles.indexOf(role), roles.indexOf(partner), roles.indexOf(third)]);
  }
  return { roles, questions: out };
}

function distance(a: string, b: string): number {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    row = next;
  }
  return row[b.length];
}

function qiraatBank() {
  const out: AyahQuizzes['qiraat'] = [];
  let mushafTurn = false;
  for (const key of qiraatAyat()) {
    const words = byKey.get(key)?.words ?? [];
    qiraatOf(key).forEach((difference, at) => {
      const { readings } = difference;
      const length = difference.at[1] - difference.at[0] + 1;
      if (dropped(`qiraat:${key}:${at}`)) return;
      if (readings.some(reading => reading.text.trim().split(/\s+/).length !== length)) return;
      const shown = words.slice(difference.at[0], difference.at[1] + 1).map(normalizeWord).join(' ');
      if (readings[0].text.trim().split(/\s+/).map(normalizeWord).join(' ') !== shown) return;
      if (length !== 1) return;
      if (/عليهم|اليهم|لديهم|صرط|صراط|ارايت|اريت|هانتم|ها انتم|اءذا|ائذا|اءنا|ائنا|اءن|ائن/.test(shown)) return;
      if (/^و?انا$/.test(shown)) return;
      const ends = readings.map(reading => reading.text.trim().normalize('NFD').replace(/[\u06D6-\u06ED]+$/, ''));
      const stem = (text: string) => text.replace(/[\u064B-\u0652\u06E1]+$/, '');
      const end = (text: string) => text.slice(stem(text).length).replace(/\u0651/g, '');
      const body = (text: string) => stem(text).replace(/[\u0670\u0652\u06E1]/g, '');
      if (ends.every(text => body(text) === body(ends[0])) && ends.every(text => /^[\u064F\u0650\u0652\u06E1]?$/.test(end(text)))) {
        if (words[difference.at[1] + 1]?.startsWith('ٱ') || /م$/.test(stem(ends[0]))) return;
      }
      if (readings.some(reading => reading.rawis.length === 1)) return;
      const letters = (text: string) => normalizeWord(text).replace(/[^\u0621-\u064A]/g, '');
      const unhamzed = (text: string) => letters(text).replace(/[ءاؤئ]/g, '');
      if (readings.slice(1).some(reading => unhamzed(reading.text) === unhamzed(readings[0].text) && letters(reading.text) !== letters(readings[0].text))) return;
      if (readings.slice(1).some(reading => distance(letters(reading.text), letters(readings[0].text)) > 2)) return;
      if (readings.some(reading => !/[\u064B-\u0652]/.test(reading.text))) return;
      if (new Set(readings.map(reading => reading.text.trim())).size !== readings.length) return;
      const whole = wholeReaders(readings);
      reseed(`qiraat:${key}:${at}`);
      const wanted = whole.filter(({ reading }) => (reading === 0) === mushafTurn);
      const pick = (wanted.length ? wanted : whole)[Math.floor(random() * (wanted.length || whole.length))];
      if (!pick) return;
      mushafTurn = !mushafTurn;
      out.push([key, at, pick.reader]);
    });
  }
  return out;
}

const tafsir = tafsirBank();
const bank: AyahQuizzes = { tafsir: tafsir.out, balagha: balaghaBank(), irab: irabBank(), qiraat: qiraatBank() };
writeFileSync(OUT, JSON.stringify(bank) + '\n');
if (process.argv.includes('--candidates')) {
  writeFileSync(process.argv[process.argv.indexOf('--candidates') + 1], JSON.stringify(tafsir.candidates, null, 1));
}
console.log(`tafsir ${bank.tafsir.length}, balagha ${bank.balagha.questions.length}, irab ${bank.irab.questions.length}, qiraat ${bank.qiraat.length}`);

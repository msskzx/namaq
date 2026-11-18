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
import { READERS, RIWAYAT } from '../../shared/quran/qiraat';
import { normalizeWord } from '../../shared/quran/normalize';
import { seededRandom } from '../../shared/quiz/feedQuiz';
import { shuffle } from '../../shared/quiz/random';
import { quotesOf, stem, stems } from '../../shared/quiz/ayahQuizText';
import type { AyahQuizzes } from '../../shared/quiz/ayahQuizzes';
import { BROAD_TERMS, termOf } from '../../shared/quran/balaghaTerms';

/**
 * The question banks of the four ayah quizzes (owner 2026-11-18, docs/feed-cards.md), built once here and only read by the
 * app and the website (shared/quiz/ayahQuizzes.ts). The bank holds places and ids, never Quran text: the words come from
 * the Madina pages and the books' own data when a question is shown. scripts/quran/ayahQuizReview.json holds the hand
 * review: the tafsir entries kept, and any question dropped.
 */
const OUT = join(__dirname, '../../shared/data/quran/ayahQuizzes.json');
const REVIEW = join(__dirname, 'ayahQuizReview.json');
/** `tafsir`: «keep», or why an entry is not asked; `avoid`: wrong ayat the review found could also fit, never offered for that ayah;
 * `drop`: any other question taken out, by its id, and why. A balagha question's `avoid` (`balagha:<ayah>`) lists headings. */
type Review = { tafsir: Record<string, string>; avoid: Record<string, string[]>; drop: Record<string, string> };
const review: Review = JSON.parse(readFileSync(REVIEW, 'utf8'));
const dropped = (id: string) => id in review.drop;
// Each question draws from its own seed, so a review's change to one question (a wrong choice swapped) leaves the others as read.
let random = seededRandom(20261118);
const seedOf = (id: string) => [...id].reduce((hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0, 20261118);
const reseed = (id: string) => { random = seededRandom(seedOf(id)); };

const ayat = corpus.ayat as BranchAyah[];
const byKey = new Map(ayat.map(ayah => [ayah.key, ayah]));
const order = new Map(ayat.map((ayah, i) => [ayah.key, i]));
const surahOf = (key: string) => Number(key.split(':')[0]);

// Words found in very many ayat (الله، الذين، قال…) say nothing about which ayah a text is on.
const seen = new Map<string, number>();
for (const ayah of ayat) for (const word of stems(ayah.words)) seen.set(word, (seen.get(word) ?? 0) + 1);
const telling = (words: Set<string>) => new Set([...words].filter(word => (seen.get(word) ?? 0) < ayat.length / 100));

// لأي آية هذا التفسير؟ Al-Sa'di's whole comment on one ayah, the ayah's own words hidden, and three whole ayat to pick from.
// Kept only where the hand review says it reads easily in a card (ayahQuizReview.json «tafsir»: keep / why not).
function tafsirBank() {
  const out: AyahQuizzes['tafsir'] = [];
  const candidates: { key: string; text: string; hidden: number[] }[] = [];
  for (const key of singleAyahPassages()) {
    const text = withoutOpeningQuote(tafsirSadiOf(key)!.text);
    const own = stems(byKey.get(key)!.words);
    // A quote whose words are mostly the ayah's own is the ayah itself; quotes of other ayat stay.
    const hidden = quotesOf(text).flatMap((quote, i) => {
      const words = [...stems(quote)];
      return words.length && words.filter(word => own.has(word)).length * 2 >= words.length ? [i] : [];
    });
    candidates.push({ key, text, hidden });
  }
  for (const { key, text, hidden } of candidates) {
    if (review.tafsir[key] !== 'keep' || dropped(`tafsir:${key}`)) continue;
    // A passage that ends leading into the next ayah («ثم قال تعالى:») stops mid-thought in a card.
    if (/:\s*$/.test(text)) continue;
    reseed(`tafsir:${key}`);
    const right = byKey.get(key)!;
    // Wrong ayat say nothing the passage says: none of their telling words is in the passage or in the right ayah.
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

// ما الأسلوب؟ An ayah al-Suyuti cites under one of his headings, surely there (ITQAN RULE): which heading. Wrong headings come
// from his other chapters than any that cites the ayah, and share no word with the right one.
// Headings as a choice are the terms of «مصطلحات البلاغة» (shared/quran/balaghaTerms.ts termOf), so each links to its page.
// Broad kinds found in very many ayat (a metaphor, a مجاز, a dropped word, a حصر): asked as his heading, never offered as a
// wrong one (BROAD_TERMS), since the second agent's reviews found them truly in the ayah again and again.
// Chapters one inside the other: a metaphor is a مجاز, so the two never stand as right and wrong in one question.
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
    // Ayat quoted one after another make one question (الكوثر ١–٢: the turn from «أعطيناك» to «لربك»).
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
    // Every chapter he cites any of these ayat in, sure or not, and every heading he gives them.
    const paragraphs = keys.flatMap(key => itqanAt(data, key));
    const cited = new Set(paragraphs.map(p => Number(Object.keys(data.kinds).find(kind => data.kinds[Number(kind)] === p.kind))).map(kind => FAMILY[kind] ?? kind));
    const citedLabels = new Set(paragraphs.map(p => labels.indexOf((p.heading && termOf(0, p.heading)) || '')).filter(i => i >= 0));
    const rightWords = stems(labels[run.label]);
    const avoid = [...(review.avoid[`balagha:${run.key}`] ?? []), ...BROAD_TERMS];
    const ok = (label: number) => label !== run.label && !citedLabels.has(label) && !avoid.includes(labels[label]) && !cited.has(family(label))
      && ![...stems(labels[label])].some(word => rightWords.has(word));
    // Common headings first, so a wrong choice is a style a reader may know; two different chapters when it can.
    const weighted = shuffle(pool.filter(ok), random).sort((a, b) => (count.get(b) ?? 0) * random() - (count.get(a) ?? 0) * random());
    const first = weighted[0];
    const second = weighted.find(label => label !== first && family(label) !== family(first)) ?? weighted.find(label => label !== first && ![...stems(labels[label])].some(word => stems(labels[first]).has(word)));
    if (first === undefined || second === undefined) continue;
    out.push([run.key, run.through, run.entry, run.label, first, second]);
  }
  return { labels, questions: out };
}

// ما إعرابها؟ A word whose role in the Quranic Treebank is one plain role its case ending shows (فاعل is raised, مفعول به set
// up…), a noun written as one word, so the role is the word's own and not a pronoun joined to it.
const CASES: Record<string, 'مرفوع' | 'منصوب' | 'مجرور'> = {
  'فاعل': 'مرفوع', 'نائب فاعل': 'مرفوع', 'خبر إن': 'مرفوع', 'خبر أن': 'مرفوع', 'اسم كان': 'مرفوع',
  'مفعول به': 'منصوب', 'اسم إن': 'منصوب', 'اسم أن': 'منصوب', 'خبر كان': 'منصوب', 'مفعول مطلق': 'منصوب', 'تمييز': 'منصوب',
  'مضاف إليه': 'مجرور',
};
// Roles that differ only by إنّ or أنّ are one question's right and wrong never.
const SAME = [['اسم إن', 'اسم أن'], ['خبر إن', 'خبر أن']];
// The role a wrong choice is best paired with: the other half of its sentence.
const PARTNER: Record<string, string> = { 'اسم إن': 'خبر إن', 'خبر إن': 'اسم إن', 'اسم أن': 'خبر أن', 'خبر أن': 'اسم أن', 'اسم كان': 'خبر كان', 'خبر كان': 'اسم كان', 'فاعل': 'مفعول به', 'مفعول به': 'فاعل', 'نائب فاعل': 'فاعل' };
const ADVERBS = new Set(['غير', 'مكان', 'يوم', 'حين', 'قبل', 'بعد', 'وراء', 'دون', 'ساعه', 'ليل', 'نهار', 'غدا', 'امس', 'اخري', 'اخر']);
const NUMBERS = new Set(['ألف', 'مأي', 'ثني', 'ثلث', 'ربع', 'خمس', 'سدس', 'سبع', 'ثمن', 'تسع', 'عشر', 'وحد']);
const SET_PHRASES = new Set(['سبحان', 'سنه', 'وعد', 'صبغه']);
// كان and her sisters as verbs: in their ayah a فاعل may be كان's own (كان التامة) and a مفعول به her خبر, so neither is asked.
const KANA = /الجذر \((?:كون|ليس|صبح|ظلل|بيت|مسي|صير|زول|برح|فتأ|دوم)\)/;
/**
 * Whether the treebank's role is the one every grammar book gives (the second agent's sample review, 2026-11-18): a فاعل after
 * its verb (not «إذا السماء انفطرت»), a مفعول به that is not an indefinite accusative (شيئا، عمرا: often مفعول مطلق or ظرف) or
 * the verb's own masdar, no كان in the ayah, and اسم / خبر إنّ or أنّ under the particle the ayah writes, nothing between them.
 */
function settled(ayah: BranchAyah, word: number, role: string, lines: ReturnType<typeof irabWordsAt>): boolean {
  const line = lines[word];
  const head = line.head;
  // A فاعل after its verb, never a participle after a pronoun (وهم … مشفقون is the خبر of هم).
  if ((role === 'فاعل' || role === 'نائب فاعل') && (head === null || head > word || !lines[head]?.morph.startsWith('فعل'))) return false;
  // A doubled verb (لا تضارّ) reads active or passive alike, so its فاعل and نائب فاعل cannot be told apart.
  if ((role === 'فاعل' || role === 'نائب فاعل') && head !== null && /\u0651[\u064B-\u0650]*$/.test(ayah.words[head] ?? '')) return false;
  // After كيف, كان may be تامة, so its اسم and فاعل cannot be told apart.
  if (/^(?:اسم|خبر) كان$/.test(role) && ayah.words.some(other => stem(other) === 'كيف')) return false;
  if ((role === 'فاعل' || role === 'مفعول به') && lines.some(other => other.morph.startsWith('فعل') && KANA.test(other.morph))) return false;
  const root = (morph: string | undefined) => morph?.match(/الجذر \((.+?)\)/)?.[1];
  // Indefinite: no «ال», nothing hanging on it as مضاف إليه, not a name (a sound plural carries no «نكرة» tag: خائبين).
  const indefinite = !line.morph.includes('أل التعريف') && !/علم/.test(line.morph) && !lines.some(other => other.head === word && /مضاف إليه/.test(other.role ?? ''));
  if (role === 'مفعول به' && (indefinite || /نكرة|مصدر/.test(line.morph))) return false;
  // Nouns used as ظروف (مكان، يوم، حين…) and numbers (ألف سنة) are asked only as مضاف إليه; the bank has no ظرف to offer.
  const bare = stem(ayah.words[word] ?? '').replace(/ا$/, '');
  if (role !== 'مضاف إليه' && (ADVERBS.has(bare) || NUMBERS.has(root(line.morph) ?? ''))) return false;
  // A مفعول مطلق is asked only beside a verb of its own root (أنبتكم … نباتا) or in a set phrase (سبحان، وعد الله).
  if (role === 'مفعول مطلق' && !SET_PHRASES.has(bare) && !lines.some(other => other.morph.startsWith('فعل') && root(other.morph) === root(line.morph))) return false;
  // A place after دخل or استبق (ادخلوا الباب): ظرف, نزع الخافض or مفعول به, so not asked; the transitive أدخل is.
  if (role === 'مفعول به' && head !== null && /الجذر \((?:دخل|سبق|سكن)\)/.test(lines[head]?.morph ?? '') && !/الوزن \(أَفْعَلَ\)/.test(lines[head]?.morph ?? '')) return false;
  // The noun after ضرب … مثلا may be the مثل's بدل.
  if (role === 'مفعول به' && /الجذر \(ضرب\)/.test(head !== null ? lines[head]?.morph ?? '' : '')) return false;
  // A نائب فاعل with a جار ومجرور right after its verb, which may be the نائب فاعل itself (نفخ فيه أخرى).
  if (role === 'نائب فاعل' && head !== null && lines.slice(head + 1, word).some(other => /حرف جر/.test(other.morph))) return false;
  if (role === 'مفعول به' && head !== null && root(line.morph) === root(lines[head]?.morph)) return false;
  const particle = role.match(/^(?:اسم|خبر) (إن|أن)$/)?.[1];
  if (particle) {
    // The governing word is the particle (its head for a خبر is the اسم, whose head is the particle).
    let at = head;
    for (let steps = 0; at !== null && !/الحروف الناسخة/.test(lines[at]?.morph ?? ''); steps++) at = steps < 3 ? lines[at]?.head ?? null : null;
    if (at === null || at > word) return false;
    const written = (ayah.words[at] ?? '').replace(/^[وف]/, '');
    if (!written.startsWith(particle === 'إن' ? 'إ' : 'أ')) return false;
    // Nothing standing between but the اسم and words hanging on it: no pronoun (فهو), no ظرف or جار ومجرور put first (عنده أجر).
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

/** How many letters to add, drop or change to turn one word into the other. */
function distance(a: string, b: string): number {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    row = next;
  }
  return row[b.length];
}

// كيف يقرؤها؟ A word the ten readers differ on, and how one of them reads it: a reader both of whose riwayat read alike.
// Half the questions ask a reader who reads as the mushaf does, so the mushaf's reading is not always right or always wrong.
function qiraatBank() {
  const out: AyahQuizzes['qiraat'] = [];
  let mushafTurn = false;
  for (const key of qiraatAyat()) {
    const words = byKey.get(key)?.words ?? [];
    qiraatOf(key).forEach((difference, at) => {
      const { readings } = difference;
      const all = readings.flatMap(reading => reading.rawis);
      const length = difference.at[1] - difference.at[0] + 1;
      if (new Set(all).size !== all.length || dropped(`qiraat:${key}:${at}`)) return;
      // Each reading must be the marked words, read another way: as many words, and the first one the mushaf's own.
      if (readings.some(reading => reading.text.trim().split(/\s+/).length !== length)) return;
      const shown = words.slice(difference.at[0], difference.at[1] + 1).map(normalizeWord).join(' ');
      if (readings[0].text.trim().split(/\s+/).map(normalizeWord).join(' ') !== shown) return;
      // One word only: in a run of words another word may have readings of its own the grouping leaves out (فمن، يضاعف).
      if (length !== 1) return;
      // Words whose readers differ by a rule of pronunciation the grouping does not carry: «عليهُم» of Hamza and Ya'qub,
      // Khalaf's إشمام in صراط, the eased hamza of أرأيت، ها أنتم، أئذا، أئنا (the second agent's sample review).
      if (/عليهم|اليهم|لديهم|صرط|صراط|ارايت|اريت|هانتم|ها انتم|اءذا|ائذا|اءنا|ائنا|اءن|ائن/.test(shown)) return;
      // A reading only one narrator has is most often such a rule too (إمالة، إشمام، إدغام).
      if (readings.some(reading => reading.rawis.length === 1)) return;
      // Readings apart only by how the hamza is said.
      const letters = (text: string) => normalizeWord(text).replace(/[^\u0621-\u064A]/g, '');
      const unhamzed = (text: string) => letters(text).replace(/[ءاؤئ]/g, '');
      if (readings.slice(1).some(reading => unhamzed(reading.text) === unhamzed(readings[0].text) && letters(reading.text) !== letters(readings[0].text))) return;
      // Each reading's letters close to the mushaf's word: a slip in the typed reading (عيهم) is not shown.
      if (readings.slice(1).some(reading => distance(letters(reading.text), letters(readings[0].text)) > 2)) return;
      // A reading told in words («بالسين»، «بإشمام الصاد زايًا») is not one to draw as Quran words.
      if (readings.some(reading => !/[\u064B-\u0652]/.test(reading.text))) return;
      if (new Set(readings.map(reading => reading.text.trim())).size !== readings.length) return;
      const whole = READERS.flatMap((reader, i) => {
        const own = RIWAYAT.flatMap((riwaya, n) => (riwaya.reader === reader.id ? [n + 1] : []));
        const reading = readings.findIndex(r => own.every(n => r.rawis.includes(n)));
        return reading < 0 ? [] : [{ reader: i, reading }];
      });
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

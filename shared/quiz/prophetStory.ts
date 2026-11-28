import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import { filteredAyat } from '../quran/mutashabih/browse';
import { normalizeWord } from '../quran/normalize';
import { PROPHETS, prophetName } from '../quran/prophets';
import { STORIES } from '../quran/prophets/stories';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion, ChoiceScope } from './choiceKinds';
import { mushafSource } from './sources';

export const PROPHET_STORY = 'PROPHET_STORY';
export const PROPHET_STORY_NAME = 'في قصة مَن هذه الآية؟';
const CHOICES = 4;
const MOST_WORDS = 40;
const ALIKE_RUN = 4;

const NAMES: Record<string, string[]> = {
  adam: ['ادم'], idris: ['ادريس'], nuh: ['نوح'], hud: ['هود'], salih: ['صلح', 'صالح'], ibrahim: ['ابرهيم', 'ابرهم', 'ابراهيم'],
  lut: ['لوط'], shuayb: ['شعيب'], yaqub: ['يعقوب', 'اسريل', 'اسرءيل'], yusuf: ['يوسف'], ayyub: ['ايوب'], 'dhul-kifl': ['الكفل'],
  yunus: ['يونس', 'النون', 'الحوت'], musa: ['موسي'], harun: ['هرون', 'هارون'], ilyas: ['الياس', 'الياسين'], alyasa: ['اليسع'],
  dawud: ['داود', 'داوود'], sulayman: ['سليمن', 'سليمان'], zakariyya: ['زكريا'], yahya: ['يحيي'], isa: ['عيسي', 'المسيح'],
};
const ASKED = PROPHETS.filter(prophet => NAMES[prophet.slug] && STORIES[prophet.slug]);

const bare = (word: string) => normalizeWord(word).replace(/[^ء-ي]/g, '').replace(/^[وفبلك](?=ال)/, '');
const names = (word: string, slug: string) => {
  const plain = normalizeWord(word).replace(/[^ء-ي]/g, '');
  return NAMES[slug].some(name => plain.includes(name));
};
const POINTING = ['اسمعيل', 'اسحق', 'اسماعيل', 'اسحاق'];
const TOLD_TOGETHER: Record<string, string> = { musa: 'harun', harun: 'musa' };
const SPOKEN_TO_HIM = new Set(['2:252', '3:60', '5:74']);
const NEAR = 3;
const AROUND = 2;

let ayat: Map<string, BranchAyah> | undefined;
const ayatByKey = () => (ayat ??= new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah])));
const wordsOf = (key: string) => ayatByKey().get(key)?.words ?? [];
const namesAny = (key: string) => wordsOf(key).some(word => ASKED.some(prophet => names(word, prophet.slug)) || POINTING.some(name => normalizeWord(word).includes(name)));

export type ProphetAyah = { key: string; slug: string; event: number; named: string; passage: string[]; nearby: string[] };

function storyAyat() {
  return ASKED.flatMap(prophet => STORIES[prophet.slug].events.flatMap((event, n) => event.segments.flatMap(({ surah, range: [lo, hi] }) => {
    const passage = Array.from({ length: hi - lo + 1 }, (_, k) => `${surah}:${lo + k}`);
    return passage.map(key => ({ key, slug: prophet.slug, event: n, passage }));
  })));
}

const runsOf = (key: string) => {
  const words = wordsOf(key).map(bare);
  return new Set(words.slice(0, words.length - ALIKE_RUN + 1).map((_, i) => words.slice(i, i + ALIKE_RUN).join(' ')));
};

let built: ProphetAyah[] | undefined;
export function prophetAyat(): ProphetAyah[] {
  if (built) return built;
  const all = storyAyat();
  const stories = new Map<string, Set<string>>();
  for (const item of all) stories.set(item.key, (stories.get(item.key) ?? new Set()).add(item.slug));
  const runsBySlug = new Map<string, Set<string>>();
  for (const item of all) for (const run of runsOf(item.key)) runsBySlug.set(run, (runsBySlug.get(run) ?? new Set()).add(item.slug));
  const seen = new Set<string>();
  built = all.flatMap(item => {
    if (seen.has(item.key) || stories.get(item.key)!.size > 1 || SPOKEN_TO_HIM.has(item.key)) return [];
    seen.add(item.key);
    const words = wordsOf(item.key);
    if (!words.length || words.length > MOST_WORDS || namesAny(item.key)) return [];
    if ([...runsOf(item.key)].some(run => runsBySlug.get(run)!.size > 1)) return [];
    const named = [...item.passage].sort((a, b) => Math.abs(item.passage.indexOf(a) - item.passage.indexOf(item.key)) - Math.abs(item.passage.indexOf(b) - item.passage.indexOf(item.key)))
      .find(key => wordsOf(key).some(word => names(word, item.slug)));
    if (!named || Math.abs(item.passage.indexOf(named) - item.passage.indexOf(item.key)) > NEAR) return [];
    const [surah, ayah] = item.key.split(':').map(Number);
    const nearby = new Set<string>();
    for (let k = ayah - AROUND; k <= ayah + AROUND; k++) for (const slug of stories.get(`${surah}:${k}`) ?? []) nearby.add(slug);
    return [{ key: item.key, slug: item.slug, event: item.event, named, passage: item.passage, nearby: [...nearby] }];
  });
  return built;
}

function question(item: ProphetAyah, random: Random): ChoiceQuestion {
  const others = shuffle(ASKED.filter(prophet => prophet.slug !== item.slug && prophet.slug !== TOLD_TOGETHER[item.slug] && !item.nearby.includes(prophet.slug)), random).slice(0, CHOICES - 1);
  const choices = shuffle([ASKED.find(prophet => prophet.slug === item.slug)!, ...others], random);
  const ayah = Number(item.key.split(':')[1]);
  const namedWords = wordsOf(item.named);
  return {
    key: `${PROPHET_STORY}:${item.key}`,
    family: PROPHET_STORY,
    promptArabic: PROPHET_STORY_NAME,
    quran: wordsOf(item.key),
    number: ayah,
    choices: choices.map(prophet => ({ value: prophet.slug, labelArabic: prophetName(prophet) })),
    correctAnswer: item.slug,
    ayahKey: item.key,
    look: { view: 'ayat', keys: item.passage, mark: item.named },
    sources: [{ ...mushafSource(item.named), quote: namedWords.join(' ') }],
    evidence: { claimKeys: [] },
  };
}

const candidates = (scope: ChoiceScope) => {
  const inScope = filteredAyat(ayatByKey(), scope.filters, scope.range);
  return prophetAyat().filter(item => inScope.has(item.key));
};

export const prophetStoryQuiz: ChoiceKind = {
  id: PROPHET_STORY,
  name: PROPHET_STORY_NAME,
  party: true,
  questions: (scope, _difficulty, random, limit = Infinity) => shuffle(candidates(scope), random).slice(0, limit).map(item => question(item, random)),
  count: scope => candidates(scope).length,
};

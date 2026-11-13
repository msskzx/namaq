// The surah openings page (owner, 2026-11-13): every surah under one of the ten kinds of opening that al-Suyuti lists
// in al-Itqan (النوع الستون, after Abu Shama), and cards of surahs whose openings look alike. docs/plans/quran-openings-kinds.md
import { normalizeWord } from './normalize';

export type OpeningKindId = 'praise' | 'letters' | 'call' | 'statement' | 'oath' | 'condition' | 'command' | 'question' | 'prayer' | 'reason';

export const OPENING_KINDS: { id: OpeningKindId; label: string; surahs: number[] }[] = [
  { id: 'praise', label: 'الثناء', surahs: [1, 6, 18, 34, 35, 25, 67, 17, 57, 59, 61, 62, 64, 87] },
  { id: 'letters', label: 'الحروف', surahs: [2, 3, 7, 10, 11, 12, 13, 14, 15, 19, 20, 26, 27, 28, 29, 30, 31, 32, 36, 38, 40, 41, 42, 43, 44, 45, 46, 50, 68] },
  { id: 'call', label: 'النداء', surahs: [33, 65, 66, 73, 74, 4, 5, 22, 49, 60] },
  { id: 'statement', label: 'الخبر', surahs: [8, 9, 16, 21, 23, 24, 39, 47, 48, 54, 55, 58, 69, 70, 71, 75, 90, 80, 97, 98, 101, 102, 108] },
  { id: 'oath', label: 'القسم', surahs: [37, 51, 52, 53, 77, 79, 85, 86, 89, 91, 92, 93, 95, 100, 103] },
  { id: 'condition', label: 'الشرط', surahs: [56, 63, 81, 82, 84, 99, 110] },
  { id: 'command', label: 'الأمر', surahs: [72, 96, 109, 112, 113, 114] },
  { id: 'question', label: 'الاستفهام', surahs: [76, 78, 88, 94, 105, 107] },
  { id: 'prayer', label: 'الدعاء', surahs: [83, 104, 111] },
  { id: 'reason', label: 'التعليل', surahs: [106] },
];

export const ITQAN_SOURCE = { title: 'الإتقان في علوم القرآن للسيوطي، النوع الستون: في فواتح السور', url: 'https://shamela.ws/book/11728/1125' };

/** A card's surahs: its own kind's, then any from another kind whose opening looks like theirs. `alone` holds the rest of a kind. */
type CardDef = { id: string; kind: OpeningKindId; title: string; surahs: number[]; alone?: true };

export const OPENING_CARDS: CardDef[] = [
  { id: 'hamd', kind: 'praise', title: 'الحمد لله', surahs: [1, 6, 18, 34, 35] },
  { id: 'tabarak', kind: 'praise', title: 'تبارك الذي', surahs: [25, 67] },
  { id: 'tasbih', kind: 'praise', title: 'التسبيح', surahs: [17, 57, 59, 61, 62, 64, 87] },
  { id: 'alif-lam-mim', kind: 'letters', title: 'الم', surahs: [2, 3, 29, 30, 31, 32] },
  { id: 'alif-lam-ra', kind: 'letters', title: 'الر', surahs: [10, 11, 12, 13, 14, 15] },
  { id: 'ta-sin', kind: 'letters', title: 'طسم', surahs: [26, 27, 28] },
  { id: 'ha-mim', kind: 'letters', title: 'حم', surahs: [39, 40, 41, 42, 43, 44, 45, 46] },
  { id: 'wal-quran', kind: 'letters', title: 'والقرآن', surahs: [36, 38, 50] },
  { id: 'letters-alone', kind: 'letters', title: 'وحدها', surahs: [7, 19, 20, 68], alone: true },
  { id: 'ya-ayyuha-n-nabi', kind: 'call', title: 'يا أيها النبي', surahs: [33, 65, 66] },
  { id: 'muzzammil', kind: 'call', title: 'المزمل والمدثر', surahs: [73, 74] },
  { id: 'ya-ayyuha-n-nas', kind: 'call', title: 'يا أيها الناس', surahs: [4, 22] },
  { id: 'alladhina-amanu', kind: 'call', title: 'يا أيها الذين آمنوا', surahs: [5, 49, 60] },
  { id: 'inna', kind: 'statement', title: 'إنا', surahs: [48, 71, 97, 108] },
  { id: 'iqtarab', kind: 'statement', title: 'اقترب', surahs: [21, 54] },
  { id: 'qad', kind: 'statement', title: 'قد', surahs: [23, 58] },
  { id: 'la-uqsim', kind: 'statement', title: 'لا أقسم', surahs: [75, 90] },
  { id: 'qariah', kind: 'statement', title: 'الحاقة والقارعة', surahs: [69, 101] },
  { id: 'statement-alone', kind: 'statement', title: 'وحدها', surahs: [8, 9, 16, 24, 47, 55, 70, 80, 98, 102], alone: true },
  { id: 'saffat', kind: 'oath', title: 'صفة ثم مصدرها', surahs: [37, 51, 77, 79, 100] },
  { id: 'idha', kind: 'oath', title: 'والليل إذا', surahs: [53, 92, 93] },
  { id: 'sama', kind: 'oath', title: 'والسماء', surahs: [85, 86] },
  { id: 'oath-alone', kind: 'oath', title: 'وحدها', surahs: [52, 89, 91, 95, 103], alone: true },
  { id: 'idha-sama', kind: 'condition', title: 'إذا السماء', surahs: [81, 82, 84] },
  { id: 'idha-ja', kind: 'condition', title: 'إذا جاء', surahs: [63, 110] },
  { id: 'idha-fil', kind: 'condition', title: 'إذا وقعت', surahs: [56, 99] },
  { id: 'qul', kind: 'command', title: 'قل', surahs: [72, 109, 112, 113, 114] },
  { id: 'command-alone', kind: 'command', title: 'وحدها', surahs: [96], alone: true },
  { id: 'hal', kind: 'question', title: 'هل أتى', surahs: [76, 88] },
  { id: 'alam', kind: 'question', title: 'ألم', surahs: [94, 105] },
  { id: 'question-alone', kind: 'question', title: 'وحدها', surahs: [78, 107], alone: true },
  { id: 'wayl', kind: 'prayer', title: 'ويل', surahs: [83, 104] },
  { id: 'prayer-alone', kind: 'prayer', title: 'وحدها', surahs: [111], alone: true },
  { id: 'reason-alone', kind: 'reason', title: 'وحدها', surahs: [106], alone: true },
];

export const kindOf = (surah: number) => OPENING_KINDS.find(kind => kind.surahs.includes(surah))!.id;

/** The opening a card shows: the first ayah (the Fatiha's after the basmala), and the next one too when the first has two words or fewer. */
export function openingKeys(surah: number, words: (key: string) => string[]): string[] {
  if (surah === 1) return ['1:2'];
  return words(`${surah}:1`).length <= 2 ? [`${surah}:1`, `${surah}:2`] : [`${surah}:1`];
}

/** Rows longer than this show their first SHOWN words; the mushaf has the rest. */
const LONG = 16;
const SHOWN = 12;

export type OpeningWord = { text: string; own: boolean } | { end: number };
export type OpeningRow = { surah: number; guest?: OpeningKindId; words: OpeningWord[]; cut: boolean };
export type OpeningCard = { id: string; kind: OpeningKindId; title: string; alone: boolean; rows: OpeningRow[] };

/**
 * The cards with their rows. A word is `own` when no other row of the card has it (same letters, marks aside),
 * so it marks what sets that surah's opening apart. Cards whose rows share less than a word on average (alike in form, not in
 * wording, like «والصافات صفا» and «والذاريات ذروا») and the cards of surahs that stand alone mark nothing.
 */
export function openingCards(words: (key: string) => string[]): OpeningCard[] {
  return OPENING_CARDS.map(card => {
    const parts = card.surahs.map(surah => openingKeys(surah, words).map(key => ({ key, words: words(key) })));
    const plain = parts.map(ayat => ayat.flatMap(ayah => ayah.words.map(normalizeWord)));
    const sets = plain.map(row => new Set(row));
    const pairs = card.surahs.length * (card.surahs.length - 1);
    const shared = pairs ? sets.reduce((sum, set, r) => sum + sets.reduce((s, other, o) => s + (o === r ? 0 : [...set].filter(w => other.has(w)).length), 0), 0) / pairs : 0;
    const marks = !card.alone && shared >= 1;
    const rows = parts.map((ayat, r): OpeningRow => {
      const surah = card.surahs[r];
      let at = 0;
      const all: OpeningWord[] = ayat.flatMap(ayah => [
        ...ayah.words.map(text => { const word = plain[r][at++]; return { text, own: marks && !sets.some((set, o) => o !== r && set.has(word)) }; }),
        { end: Number(ayah.key.split(':')[1]) },
      ]);
      const count = plain[r].length;
      const cut = count > LONG;
      const guest = kindOf(surah) === card.kind ? undefined : kindOf(surah);
      return { surah, ...(guest ? { guest } : {}), words: cut ? all.filter(word => 'text' in word).slice(0, SHOWN) : all, cut };
    });
    return { id: card.id, kind: card.kind, title: card.title, alone: !!card.alone, rows };
  });
}

/** A kind's cards: its own, and those holding one of its surahs as a guest (الزمر under «الخبر»). */
export const inKind = (card: OpeningCard, kind: OpeningKindId) => card.kind === kind || card.rows.some(row => row.guest === kind);

export const kindLabel = (id: OpeningKindId) => OPENING_KINDS.find(kind => kind.id === id)!.label;

/** The other surahs whose opening is on the same card (none for a surah that stands alone). */
export function openingLike(surah: number): { card: string; kind: OpeningKindId; surahs: number[] } | null {
  const card = OPENING_CARDS.find(c => !c.alone && c.surahs.includes(surah));
  return card ? { card: card.id, kind: card.kind, surahs: card.surahs.filter(s => s !== surah) } : null;
}

export const openingHref = (card: string, kind: OpeningKindId) => `/quran/openings?kind=${kind}#${card}`;

// إذا السماء: the conditions from the first ayah to their answer, as the page showed them before the rework.
export type ConditionRole = 'condition' | 'answer' | 'disputed';

export const CONDITION_SPANS: Record<number, { to: number; answer?: number; sourced?: boolean }> = {
  81: { to: 14, answer: 14, sourced: true },
  82: { to: 5, answer: 5 },
  84: { to: 6 },
};

/** Each ayah of the span with its role; 82's answer is our reading, and 84's is disputed. */
export function conditionLines(surah: number): { key: string; role: ConditionRole; ours: boolean }[] {
  const span = CONDITION_SPANS[surah];
  if (!span) return [];
  return Array.from({ length: span.to }, (_, i) => {
    const ayah = i + 1;
    const role: ConditionRole = span.answer === undefined ? (ayah === span.to ? 'disputed' : 'condition') : ayah === span.answer ? 'answer' : 'condition';
    return { key: `${surah}:${ayah}`, role, ours: role === 'answer' && !span.sourced };
  });
}

export const CONDITION_NOTES = [
  'في التكوير قال الطبري والقرطبي إن «علمت نفس ما أحضرت» جواب «إذا» وما قبلها. ونقرأ «علمت نفس ما قدمت وأخرت» في الانفطار جوابًا على النسق نفسه، وهذه قراءتنا ولم نجد من نص عليها.',
  'وفي الانشقاق اختلف المفسرون في الجواب: محذوف يُفهم من السياق (الطبري والبغوي والقرطبي)، أو «يا أيها الإنسان إنك كادح» (بعض نحويي البصرة)، أو «وأذنت» والواو زائدة (الفراء)، أو «فأما من أوتي كتابه بيمينه» (الكسائي، وقال النحاس: أصح ما قيل فيه).',
];

export const CONDITION_SOURCES = [
  { title: 'الطبري والقرطبي في تفسير التكوير ١٤', url: 'https://quran.ksu.edu.sa/tafseer/ibn-tabary-qortobi-saadi/sura81-aya14.html' },
  { title: 'الطبري والبغوي والقرطبي في تفسير الانشقاق ٥', url: 'https://quran.ksu.edu.sa/tafseer/ibn-baghawy-tabary-qortobi/sura84-aya5.html' },
];

export const OPENINGS_HELP = [
  'افتتح الله سور القرآن بعشرة أنواع من الكلام، لا تخرج سورة عنها: الثناء، وحروف التهجي، والنداء، والجمل الخبرية، والقسم، والشرط، والأمر، والاستفهام، والدعاء، والتعليل. جمعها أبو شامة المقدسي، ونقلها الزركشي في البرهان والسيوطي في الإتقان.',
  'تجمع البطاقة سورًا تتشابه أوائلها، والكلمة الملوّنة تنفرد بها السورة بين سور البطاقة. وقد تضم البطاقة سورة من نوع آخر فتحمل اسم نوعها. تجميع البطاقات من عملنا، والنص برواية حفص، ولم يراجعه أحد من أهل العلم.',
];

// The surah openings page (owner, 2026-11-13): every surah under one of the ten kinds of opening that al-Suyuti lists
// in al-Itqan (النوع الستون, after Abu Shama), and cards of surahs whose openings look alike. docs/plans/quran-openings-kinds.md
import { sharedByAll } from './ayahContext';
import type { BranchAyah } from './branches';
import type { Likeness } from './wordMatch';

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

/**
 * Al-Suyuti's words for each kind, quoted from al-Itqan, ed. Muhammad Abu al-Fadl Ibrahim (al-Hay'a al-Misriyya, 1974),
 * vol. 3 pp. 361-363, linked to the page in the Shamela library. The punctuation is ours.
 */
/** A quote and the page it cites; one with no page is our own note on the quotes above it. */
type Quote = { text: string; cite?: string; url?: string };

const itqan = (page: string, sh: number) => ({ cite: `السيوطي، الإتقان ٣/${page}`, url: `https://shamela.ws/book/11728/${sh}` });

export const ITQAN_OPENING = { text: 'اعلم أن الله افتتح سور القرآن بعشرة أنواع من الكلام لا يخرج شيء من السور عنها', ...itqan('٣٦١', 1125) };

export const ITQAN_QUOTES: { kind: OpeningKindId; text: string; cite: string; url: string }[] = [
  { kind: 'praise', text: 'الثناء عليه تعالى والثناء قسمان: إثبات لصفات المدح ونفي وتنزيه من صفات النقص، فالأول التحميد في خمس سور وتبارك في سورتين، والثاني التسبيح في سبع سور', ...itqan('٣٦١', 1125) },
  { kind: 'letters', text: 'حروف التهجي في تسع وعشرين سورة', ...itqan('٣٦١', 1125) },
  { kind: 'call', text: 'النداء في عشر سور: خمس بنداء الرسول ﷺ: الأحزاب والطلاق والتحريم والمزمل والمدثر، وخمس بنداء الأمة: النساء والمائدة والحج والحجرات والممتحنة', ...itqan('٣٦١', 1125) },
  { kind: 'statement', text: 'الجمل الخبرية نحو: «يسألونك عن الأنفال»، «براءة من الله»، «أتى أمر الله»، «اقترب للناس حسابهم»، «قد أفلح المؤمنون»، «سورة أنزلناها»، «تنزيل الكتاب»، «الذين كفروا»، «إنا فتحنا»، «اقتربت الساعة»، «الرحمن علم»، «قد سمع الله»، «الحاقة»، «سأل سائل»، «إنا أرسلنا نوحا»، «لا أقسم» في موضعين، «عبس»، «إنا أنزلناه»، «لم يكن»، «القارعة»، «ألهاكم»، «إنا أعطيناك»، فتلك ثلاث وعشرون سورة', ...itqan('٣٦٢', 1126) },
  { kind: 'oath', text: 'القسم في خمس عشرة سورة: سورة أقسم فيها بالملائكة وهي «والصافات»، وسورتان بالأفلاك البروج والطارق، وست سور بلوازمها: فالنجم قسم بالثريا، والفجر بمبدأ النهار، والشمس بآية النهار، والليل بشطر الزمان، والضحى بشطر النهار، والعصر بالشطر الآخر أو بجملة الزمان، وسورتان بالهواء الذي هو أحد العناصر: والذاريات والمرسلات، وسورة بالتربة التي هي منها أيضا وهي الطور، وسورة بالنبات وهي والتين، وسورة بالحيوان الناطق وهي والنازعات، وسورة بالبهيم وهي والعاديات', ...itqan('٣٦٢', 1126) },
  { kind: 'condition', text: 'الشرط في سبع سور: الواقعة والمنافقون والتكوير والانفطار والانشقاق والزلزلة والنصر', ...itqan('٣٦٢', 1126) },
  { kind: 'command', text: 'الأمر في ست سور: «قل أوحي»، «اقرأ»، «قل يا أيها الكافرون»، «قل هو الله أحد»، «قل أعوذ» المعوذتين', ...itqan('٣٦٢', 1126) },
  { kind: 'question', text: 'الاستفهام في ست سور: «عم يتساءلون»، «هل أتاك»، «ألم نشرح»، «ألم تر»، «أرأيت»', ...itqan('٣٦٢', 1126) },
  { kind: 'prayer', text: 'الدعاء في ثلاث: «ويل للمطففين»، «ويل لكل همزة»، «تبت»', ...itqan('٣٦٣', 1127) },
  { kind: 'reason', text: 'التعليل في «لإيلاف قريش»', ...itqan('٣٦٣', 1127) },
];


/** Under each kind's quote: what al-Suyuti leaves unnamed and how the page fills it in, and the remarks he quotes about that kind. */
export const ITQAN_KIND_NOTES: Partial<Record<OpeningKindId, Quote[]>> = {
  praise: [{ text: 'لم يسمّ سور التحميد وتبارك، فهي التي تبدأ بهما. وسمّى الكرماني فيما نقله ستًّا من سبع سور للتسبيح، والسابعة الصف.' }],
  letters: [{ text: 'لم يسمّها، فهي السور التي تبدأ بحروف التهجي.' }],
  question: [{ text: 'عدّها ستًا وسمّى خمسًا، والسادسة «هل أتى على الإنسان».' }],
  prayer: [{ text: 'هكذا جمع أبو شامة، قال: وما ذكرناه في الدعاء يجوز أن يذكر مع الخبر، وكذا الثناء كله خبر إلا «سبح» فإنه في قسم الأمر، و«سبحان» يحتمل الأمر الدعاء والخبر', ...itqan('٣٦٣', 1127) }],
};


/**
 * Al-Suyuti on surahs whose openings go together, from Tanasuq al-Durar (Dar al-Fadila, 2002), linked to the page in the
 * Shamela library. His own words with the editor's footnote marks left out;
 * words in [] are ours, naming the surah he means, and so is the punctuation.
 */
const tanasuq = (page: string, sh: number) => ({ cite: `السيوطي، تناسق الدرر ص${page}`, url: `https://shamela.ws/book/9992/${sh}` });

/**
 * A card's surahs, under the kind most of them share. `parts` splits a card whose surahs open with two kinds (الزمر and
 * الحواميم). `refs` quote the book that puts the surahs together; a card with none is our own grouping. `alone` holds the
 * rest of a kind.
 */
type CardDef = { id: string; kind: OpeningKindId; title: string; surahs: number[]; alone?: true; parts?: { label: string; surahs: number[] }[]; refs?: Quote[] };

export const OPENING_CARDS: CardDef[] = [
  { id: 'hamd', kind: 'praise', title: 'الحمد لله', surahs: [1, 6, 18, 34, 35], refs: [
    { text: 'كل ربع من القرآن افتتح بسورة أولها الحمد: [فأول القرآن سورة الحمد]، وهذه [الأنعام] للربع الثاني، والكهف للربع الثالث، وسبأ وفاطر للربع الرابع', ...tanasuq('٨٤', 82) },
    { text: 'مناسبة وضعها [فاطر] بعد سبأ تآخيهما في الافتتاح بالحمد، مع تناسبهما في المقدار', ...tanasuq('١٢٥', 125) },
  ] },
  { id: 'tabarak', kind: 'praise', title: 'تبارك الذي', surahs: [25, 67], refs: [{ text: 'فالأول التحميد في خمس سور وتبارك في سورتين', ...itqan('٣٦١', 1125) }] },
  { id: 'tasbih', kind: 'praise', title: 'المسبحات', surahs: [17, 57, 59, 61, 62, 64, 87], refs: [
    { text: 'قال الكرماني في متشابه القرآن: التسبيح كلمة استأثر الله بها، فبدأ بالمصدر في بني إسرائيل لأنه الأصل، ثم بالماضي في الحديد والحشر لأنه أسبق الزمانين، ثم بالمضارع في الجمعة والتغابن، ثم بالأمر في الأعلى', ...itqan('٣٦١', 1125) },
    { text: 'وبذلك تعرف الحكمة في الفصل بها [المجادلة] بين الحديد والحشر، مع تآخيهما في الافتتاح بـ«سبح»', ...tanasuq('١٣٨', 143) },
    { text: 'ولذلك فصل بها [الممتحنة] بين الحشر والصف، مع تآخيهما في الافتتاح بـ«سبح»', ...tanasuq('١٤٠', 145) },
  ] },
  { id: 'alif-lam-mim', kind: 'letters', title: 'الم', surahs: [2, 3, 29, 30, 31, 32], refs: [
    { text: 'وما تقدم من تقديم آل عمران على النساء وإن كانت أقصر منها لمناسبة البقرة في الافتتاح بـ«الم»، وتوالي الطواسين والحواميم، وتوالي العنكبوت والروم ولقمان والسجدة', ...tanasuq('٩٢', 90) },
  ] },
  { id: 'alif-lam-ra', kind: 'letters', title: 'ذوات الر', surahs: [10, 11, 12, 13, 14, 15], refs: [
    { text: 'فإن الأولى بسورة يونس أن تولى بالسور الخمس التي بعدها، لما اشتركت فيه من الاشتمال على القصص، ومن الافتتاح بـ«الر»، وبذكر الكتاب، ومن كونها مكيات', ...tanasuq('٩١', 89) },
  ] },
  { id: 'ta-sin', kind: 'letters', title: 'الطواسين', surahs: [26, 27, 28], refs: [
    { text: 'وتقديم «طس» على القصص، مفصولا بها بين النظيرتين [طسم الشعراء وطسم القصص] في المطلع والطول', ...tanasuq('٤٧', 45) },
  ] },
  { id: 'ha-mim', kind: 'letters', title: 'الزمر والحواميم', surahs: [39, 40, 41, 42, 43, 44, 45, 46], parts: [{ label: 'الخبر', surahs: [39] }, { label: 'الحواميم', surahs: [40, 41, 42, 43, 44, 45, 46] }], refs: [
    { text: 'وجه إيلاء الحواميم السبع سورة الزمر: تآخي المطالع في الافتتاح بتنزيل الكتاب', ...tanasuq('١٢٩', 130) },
    { text: 'فإن مطلع غافر مناسب لمطلع الزمر، ومطلع فصلت التي هي ثانية الحواميم مناسب لمطلع هود التي هي ثانية ذوات «الر»، ومطلع الزخرف مؤاخ لمطلع الدخان، وكذا مطلع الجاثية لمطلع الأحقاف', ...tanasuq('١٣١', 132) },
  ] },
  { id: 'maryam-taha', kind: 'letters', title: 'مريم وطه', surahs: [19, 20], refs: [
    { text: 'وسائر السور المفتتحة بالحروف المقطعة كلها مقترنة؛ كيونس وتواليها، ومريم وطه، والطواسين، و«الم» العنكبوت وتواليها، والحواميم', ...tanasuq('٧٤', 72) },
  ] },
  { id: 'letters-alone', kind: 'letters', title: 'وحدها', surahs: [7, 36, 38, 50, 68], alone: true },
  { id: 'nabi', kind: 'call', title: 'نداء الرسول ﷺ', surahs: [33, 65, 66, 73, 74], refs: [
    { text: 'خمس بنداء الرسول ﷺ: الأحزاب والطلاق والتحريم والمزمل والمدثر', ...itqan('٣٦١', 1125) },
    { text: 'هذه السورة [التحريم] متآخية مع التي قبلها في الافتتاح بخطاب النبي ﷺ', ...tanasuq('١٤٤', 149) },
    { text: 'هذه [المدثر] متآخية مع السورة التي قبلها في الافتتاح بخطاب النبي ﷺ، وصدر كليهما نازل في قصة واحدة', ...tanasuq('١٤٩', 154) },
  ] },
  { id: 'umma', kind: 'call', title: 'نداء الأمة', surahs: [4, 5, 22, 49, 60], refs: [
    { text: 'وخمس بنداء الأمة: النساء والمائدة والحج والحجرات والممتحنة', ...itqan('٣٦١', 1125) },
  ] },
  { id: 'statement', kind: 'statement', title: 'الجمل الخبرية', surahs: [8, 9, 16, 21, 23, 24, 47, 48, 54, 55, 58, 69, 70, 71, 75, 90, 80, 97, 98, 101, 102, 108] },
  { id: 'aflak', kind: 'oath', title: 'بالأفلاك', surahs: [85, 86], refs: [
    { text: 'وسورتان بالأفلاك: البروج والطارق', ...itqan('٣٦٢', 1126) },
    { text: 'هما [البروج والطارق] متآخيتان فقرنتا، وقدمت الأولى لطولها، وذكرا بعد الانشقاق للمؤاخاة في الافتتاح بذكر السماء', ...tanasuq('١٥٦', 162) },
  ] },
  { id: 'lawazim', kind: 'oath', title: 'بلوازم الأفلاك', surahs: [53, 89, 91, 92, 93, 103], refs: [
    { text: 'وست سور بلوازمها: فالنجم قسم بالثريا، والفجر بمبدأ النهار، والشمس بآية النهار، والليل بشطر الزمان، والضحى بشطر النهار، والعصر بالشطر الآخر أو بجملة الزمان', ...itqan('٣٦٢', 1126) },
  ] },
  { id: 'hawa', kind: 'oath', title: 'بالهواء', surahs: [51, 77], refs: [
    { text: 'وسورتان بالهواء الذي هو أحد العناصر: والذاريات والمرسلات', ...itqan('٣٦٢', 1126) },
  ] },
  { id: 'oath-alone', kind: 'oath', title: 'وحدها', surahs: [37, 52, 95, 79, 100], alone: true, parts: [
    { label: 'بالملائكة', surahs: [37] }, { label: 'بالتربة', surahs: [52] }, { label: 'بالنبات', surahs: [95] }, { label: 'بالحيوان الناطق', surahs: [79] }, { label: 'بالبهيم', surahs: [100] },
  ], refs: [
    { text: 'سورة أقسم فيها بالملائكة وهي «والصافات»… وسورة بالتربة التي هي منها أيضا وهي الطور، وسورة بالنبات وهي والتين، وسورة بالحيوان الناطق وهي والنازعات، وسورة بالبهيم وهي والعاديات', ...itqan('٣٦٢', 1126) },
  ] },
  { id: 'condition', kind: 'condition', title: 'الشرط', surahs: [56, 63, 81, 82, 84, 99, 110], refs: [
    { text: 'وكذلك الفصل بين الانفطار والانشقاق بالمطففين، وهما نظيرتان في المطلع والمقصد', ...tanasuq('٤٧', 45) },
  ] },
  { id: 'command', kind: 'command', title: 'الأمر', surahs: [72, 96, 109, 112, 113, 114], refs: [
    { text: 'هاتان السورتان [الفلق والناس] نزلتا معا… فلذلك قرنتا، مع ما اشتركتا فيه من التسمية بالمعوذتين، ومن الافتتاح بـ«قل أعوذ»', ...tanasuq('١٧٣', 180) },
  ] },
  { id: 'question', kind: 'question', title: 'الاستفهام', surahs: [78, 88, 94, 105, 107, 76] },
  { id: 'prayer', kind: 'prayer', title: 'الدعاء', surahs: [83, 104, 111] },
  { id: 'reason', kind: 'reason', title: 'التعليل', surahs: [106], alone: true },
];

export const kindOf = (surah: number) => OPENING_KINDS.find(kind => kind.surahs.includes(surah))!.id;

/** A kind's cards: its own, and a card with a part of that kind (الزمر under «الخبر»). */
/** A card that is its kind's only card: the kind heading above already names it, so the page shows no card title (the share image keeps it). */
export const soleCard = (card: { kind: OpeningKindId }) => OPENING_CARDS.filter(def => def.kind === card.kind).length === 1;

export const inKind = (card: OpeningCard, kind: OpeningKindId) => card.kind === kind || card.rows.some(row => kindOf(row.surah) === kind);

/** The opening a card shows: the first ayah (the Fatiha's after the basmala), and the next one too when the first has two words or fewer. */
export function openingKeys(surah: number, words: (key: string) => string[]): string[] {
  if (surah === 1) return ['1:2'];
  return words(`${surah}:1`).length <= 2 ? [`${surah}:1`, `${surah}:2`] : [`${surah}:1`];
}

/** Rows longer than this show their first SHOWN words; the mushaf has the rest. */
const LONG = 16;
const SHOWN = 12;

/** A word's colour, by the rule every view uses (shared/quran/wordMatch.ts): how alike, and whether only `some` rows share it. */
export type OpeningMark = { kind: Likeness; some: boolean };
export type OpeningWord = { text: string; mark?: OpeningMark } | { end: number };
export type OpeningRow = { surah: number; words: OpeningWord[]; cut: boolean };
export type OpeningCard = { id: string; kind: OpeningKindId; title: string; alone: boolean; rows: OpeningRow[]; parts?: { label: string; surahs: number[] }[]; refs?: Quote[] };

/**
 * The cards with their rows. Words the rows share are lined up and coloured as in the matrix (`sharedByAll`), one row being
 * a surah's opening; the cards of surahs that stand alone colour nothing.
 */
export function openingCards(ayahOf: (key: string) => BranchAyah | undefined): OpeningCard[] {
  const words = (key: string) => ayahOf(key)?.words ?? [];
  return OPENING_CARDS.map(card => {
    const parts = card.surahs.map(surah => openingKeys(surah, words).map(key => ({ key, words: words(key) })));
    const marks = card.alone ? null : sharedByAll(parts.map((ayat, r) => {
      const known = ayat.map(ayah => ayahOf(ayah.key));
      const each = (pick: 'roots' | 'lemmas') => known.flatMap((ayah, n) => ayah?.[pick] ?? ayat[n].words.map(() => null));
      return { ayah: { key: `${card.surahs[r]}:1`, page: 0, words: ayat.flatMap(ayah => ayah.words), roots: each('roots'), lemmas: each('lemmas') }, before: null, after: null };
    }));
    const rows = parts.map((ayat, r): OpeningRow => {
      const surah = card.surahs[r];
      let at = 0;
      const all: OpeningWord[] = ayat.flatMap(ayah => [
        ...ayah.words.map(text => {
          const link = marks?.[r].match?.links?.[at];
          at++;
          return link ? { text, mark: { kind: link.kind, some: link.rows < card.surahs.length } } : { text };
        }),
        { end: Number(ayah.key.split(':')[1]) },
      ]);
      const cut = at > LONG;
      return { surah, words: cut ? all.filter(word => 'text' in word).slice(0, SHOWN) : all, cut };
    });
    return { id: card.id, kind: card.kind, title: card.title, alone: !!card.alone, rows, ...(card.parts ? { parts: card.parts } : {}), ...(card.refs ? { refs: card.refs } : {}) };
  });
}


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

export const OPENINGS_LEGEND = 'الكلمة الملوّنة تشترك فيها كل سور البطاقة، والباهتة يشترك فيها بعضها، كما في المصفوفة. والبطاقات على ما جمعه السيوطي، ونصه تحت عنوان النوع أو البطاقة. والنص برواية حفص.';

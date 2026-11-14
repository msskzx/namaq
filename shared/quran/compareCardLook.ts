import { num } from './arabicNumber';
import type { CardAyah, MarkKind, PairCard } from './compareCards';
import { isRefrain } from './readPlan';

/**
 * How a compare card is drawn, in the app's points. The app's CompareCard lays itself out with these,
 * and the compare video draws the same card from them, scaled up to the story frame, so the two cannot drift apart.
 */
export const COMPARE_CARD = {
  /** The page around the cards (ComparePager's padding) and the phone width the video copies. */
  page: 12,
  phone: 390,
  /** The card box: one round radius on every card (theme CARD), a hairline border, its padding and the gap between its parts. */
  radius: 14,
  border: 1,
  padding: 12,
  gap: 10,
  /** The gap between a side's name and its ayat. */
  sideGap: 2,
  /** The ayat in the Quran font: size and line height. */
  ayahSize: 22,
  ayahLine: 44,
  /** A side's name, the note «قبلُ في السورة», and a stretch's ayat on its dotted rule, in the interface font (before UI_SCALE). */
  labelSize: 14,
  noteSize: 12,
  /** One-to-many: the picked ayah's bar on its right and the space after it. */
  pickBar: 3,
  pickPad: 8,
  /** The space between the partners of a one-to-many side. */
  optionsGap: 6,
  /** The studio's progress bars under the card, one per ayah read. */
  bar: { height: 4, radius: 2, gap: 4 },
  /** The pair's name at the top of the compare tab: its rounded frame. */
  title: { size: 15, radius: 10, padX: 10, padY: 7 },
} as const;

/** Amiri draws smaller than a system font at the same size, so interface sizes grow by this much (the app's Text and the website's type scale). */
export const UI_SCALE = 1.12;
export const uiSize = (size: number) => Math.round(size * UI_SCALE);

/** Halfway between two colours (hex), weighted towards the first. */
export function blend(a: string, b: string, weight: number) {
  const parts = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const [x, y] = [parts(a), parts(b)];
  return `#${x.map((value, i) => Math.round(value * weight + y[i] * (1 - weight)).toString(16).padStart(2, '0')).join('')}`;
}

export type MarkColours = { accent: string; root: string; muted: string };

/** A marked word's colour: the same word in the accent, the same root in purple, a related word in a faded purple; none for a plain word. */
export function markColour(kind: MarkKind | undefined, colours: MarkColours): string | undefined {
  if (kind === 'root') return colours.root;
  if (kind === 'related') return blend(colours.root, colours.muted, 0.45);
  return kind ? colours.accent : undefined;
}

/** Ayah numbers in order as unbroken runs: «٣٠–٣٣ · ٣٥» for 30, 31, 32, 33, 35. */
export function runsLabel(numbers: number[]) {
  const runs = numbers.reduce<[number, number][]>((list, n) => {
    const last = list[list.length - 1];
    if (last && n === last[1] + 1) last[1] = n;
    else list.push([n, n]);
    return list;
  }, []);
  return runs.map(([from, to]) => `${num(from)}${to > from ? `–${num(to)}` : ''}`).join(' · ');
}

/**
 * What one side of a compare card shows, top to bottom, in the matrix view (and in the studio, which always shows it).
 * The app's CompareCard renders these pieces and the compare video draws the same pieces, so both lay a card out alike.
 * - `ayat`: running text of one or more ayat; `plain` muted without marks (a partner not picked), `picked` with the bar on its right;
 *   `before`/`after` where the ayah around the side joins, when the surrounding switch is on.
 * - `part`: a story part's top rule (dotted, the ayat named in its middle when folded or skipping); `gap`: a dotted rule naming a further stretch;
 *   `range`: the first stretch's ayat in small type; `dash`: a dashed rule between partners; `silent`: a part this surah does not tell;
 *   `around`: a one-to-many side's ayah before or after, alone on its line.
 */
export type CardPiece =
  | { kind: 'ayat'; ayat: CardAyah[]; plain?: boolean; picked?: boolean; option?: number; before?: boolean; after?: boolean }
  | { kind: 'part'; row: number; label?: string; folded: boolean }
  | { kind: 'gap'; label: string }
  | { kind: 'range'; label: string }
  | { kind: 'dash' }
  | { kind: 'silent'; surah: number }
  | { kind: 'around'; which: 'before' | 'after' };

/** A side's name: its surah and its ayat, either as runs («١٥–١٧») or, for the partners of a one-to-many card, listed («١٥ · ١٩٨»). */
export type SideName = { surah: number; numbers: number[]; listed?: boolean };
export type SideView = { name: SideName; back: boolean; refrain: boolean; pieces: CardPiece[] };

/** Ayat in unbroken stretches: where a story part skips ayat, each further stretch opens on a dotted rule naming its ayat. */
function stretches(ayat: CardAyah[], named: boolean, around: { before: boolean; after: boolean }): CardPiece[] {
  const runs = ayat.reduce<CardAyah[][]>((list, ayah, i) => {
    if (i > 0 && ayah.number === ayat[i - 1].number + 1) list[list.length - 1].push(ayah);
    else list.push([ayah]);
    return list;
  }, []);
  if (runs.length < 2) return [{ kind: 'ayat', ayat, before: around.before, after: around.after }];
  const range = (run: CardAyah[]) => runsLabel(run.map(ayah => ayah.number));
  return runs.flatMap((run, k): CardPiece[] => [
    ...(k > 0 ? [{ kind: 'gap', label: range(run) } as const] : named ? [] : [{ kind: 'range', label: range(run) } as const]),
    { kind: 'ayat', ayat: run, before: k === 0 && around.before, after: k === runs.length - 1 && around.after },
  ]);
}

/** One side of a card as its pieces, with the partner `selected` picked and the story parts in `folded` closed. */
export function sideView(card: PairCard, i: 0 | 1, selected = 0, folded: number[] = []): SideView {
  const side = card.sides[i];
  const many = card.many;
  if (many && many.side === i) {
    const name = { surah: side.surah, numbers: many.options.map(item => item.ayah.number), listed: true };
    if (isRefrain(many.options)) return { name, back: false, refrain: true, pieces: [{ kind: 'ayat', ayat: [many.options[0].ayah], before: true, after: true }] };
    return {
      name, back: false, refrain: false,
      pieces: [
        { kind: 'around', which: 'before' },
        ...many.options.flatMap((item, row): CardPiece[] => [...(row > 0 ? [{ kind: 'dash' } as const] : []),
          { kind: 'ayat', ayat: [item.ayah], option: row, picked: row === selected, ...(row === selected ? {} : { plain: true }) }]),
        { kind: 'around', which: 'after' },
      ],
    };
  }
  const option = many?.options[selected];
  const ayat = option ? [option.shared] : side.ayat;
  const name = { surah: side.surah, numbers: side.ayat.map(ayah => ayah.number) };
  // A story card lines its parts up in rows; any part folds to its ayah range.
  const rows = many ? undefined : side.rows;
  if (!rows) return { name, back: !!side.back, refrain: false, pieces: stretches(ayat, false, { before: true, after: true }) };
  return {
    name, back: !!side.back, refrain: false,
    pieces: rows.flatMap((numbers, row): CardPiece[] => {
      const closed = folded.includes(row);
      const shown = ayat.filter(ayah => numbers.includes(ayah.number));
      const broken = shown.findIndex((ayah, k) => k > 0 && ayah.number !== shown[k - 1].number + 1);
      const first = broken < 0 ? shown : shown.slice(0, broken);
      const label = numbers.length ? runsLabel((closed ? shown : first).map(ayah => ayah.number)) : undefined;
      return [
        { kind: 'part', row, folded: closed, ...(label ? { label } : {}) },
        ...(closed ? [] : shown.length ? stretches(shown, true, { before: false, after: false }) : [{ kind: 'silent', surah: side.surah } as const]),
      ];
    }),
  };
}

/** A side's name as the card heads it: «البقرة ٢٥٥–٢٦٠», or «آل عمران ١٥ · ١٩٨» for the partners of a one-to-many card. */
export const sideTitle = ({ surah, numbers, listed }: SideName, surahName: (surah: number) => string) =>
  `${surahName(surah)} ${listed ? numbers.map(n => num(n)).join(' · ') : runsLabel(numbers)}`.trim();

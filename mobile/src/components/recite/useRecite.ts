import { useMemo, useRef, useState } from 'react';
import { markForgotten, readDueMarks, rememberAyah, wordMarkKey } from '@shared/ayahMarks';
import { atStart, revealAyah, stepBack, type RecitePosition } from '@shared/quran/recite';
import { reciteView, type PageModel } from '@shared/quran/recitePage';
import { penTargets, type PenRule } from '@shared/quran/writeAyah';
import { blankBoxes, blankText, boxesOf, type WriteBlank } from '@shared/quiz/writeBlanks';
import { ayahCounts } from '@/lib/mushaf';
import { useWriteBoxes, type Graded } from '@/lib/useWriteBoxes';
import type { Checked } from '../MushafPageView';
import { useOnChange } from '@/lib/hooks/useOnChange';

export function useRecite({ model, position, setPosition, writing, pen, until = null, floor = 0, onPastEnd, onWritten, onSubmit, autoFocus = false }: {
  model: PageModel | null; position: RecitePosition | null; setPosition: (position: RecitePosition) => void;
  writing: boolean; pen: PenRule; until?: string | null;
  floor?: number; onPastEnd?: () => void;
  onWritten?: (key: string, graded: Graded) => void; autoFocus?: boolean;
  onSubmit?: (key: string, typed: Record<number, string>) => void;
}) {
  const view = useMemo(() => (model && position ? reciteView(model, position) : null), [model, position]);
  const done = !!until && position?.shown === until;
  const gap = view?.gap ?? null;
  const writeKey = writing && view?.upcoming && !done && (!position?.gaps || gap) ? view.upcoming : null;
  const words = useMemo(() => (writeKey && model ? model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === writeKey).map(group => group.word!) ?? []) : []), [writeKey, model]);
  const offset = writeKey?.endsWith(':1') ? view?.titled.get(Number(writeKey.split(':')[0])) ?? 0 : 0;
  const asked = writeKey && view ? (gap ? [gap.at] : penTargets(words, pen)).filter(at => view.hidden(writeKey, at + offset)) : [];
  const [checked, setChecked] = useState<Checked | null>(null);
  useOnChange([position?.start, position?.gaps], () => setChecked(null));
  const boxes = useWriteBoxes({ ayah: writeKey && gap ? wordMarkKey(writeKey, gap.place) : writeKey, words, asked, autoFocus, onDone: (graded, typed) => {
    if (!writeKey || !position) return;
    if (onSubmit) { onSubmit(writeKey, typed); return; }
    setChecked(was => (gap && was?.key === writeKey
      ? { key: writeKey, right: [...was.right.filter(at => !asked.includes(at)), ...graded.right], wrong: [...was.wrong.filter(at => !asked.includes(at)), ...graded.wrong], typed: { ...was.typed, ...graded.typed } }
      : { key: writeKey, ...graded }));
    const key = gap ? wordMarkKey(writeKey, gap.place) : writeKey;
    if (graded.wrong.length) markForgotten(key);
    else if (readDueMarks()[key]) rememberAyah(key);
    setPosition((gap && view?.nextAyah()) || revealAyah(position, writeKey));
    onWritten?.(writeKey, graded);
  } });
  const nextAyah = () => {
    if (!position || !view || onSubmit) return;
    const next = !done && view.nextAyah();
    if (next) setPosition(next);
    else onPastEnd?.();
  };
  const nextWord = () => {
    if (!position || !view) return;
    const next = !done && view.nextWord();
    if (onSubmit && next && next.shown) return;
    if (next) setPosition(next);
    else nextAyah();
  };
  const first = !position || (atStart(position) || (position.shown === null && position.words <= floor));
  const back = () => {
    if (onSubmit) { boxes.clearLast(); return; }
    if (!position || first) return;
    const before = stepBack(position, ayahCounts);
    setPosition(before.shown === null && before.words < floor ? { ...before, words: floor } : before);
    setChecked(null);
  };
  return {
    view, done, pen, checked, setChecked, boxes, nextAyah, nextWord, back,
    atStart: onSubmit ? !Object.values(boxes.typed).some(Boolean) : first,
    party: !!onSubmit,
    write: writeKey ? { key: writeKey, targets: asked, typed: boxes.typed, current: boxes.current, onBox: boxes.pick } : null,
  };
}

export type Recite = ReturnType<typeof useRecite>;

export function useWriteBlanks({ id, blanks, texts, onType }: { id: string; blanks: WriteBlank[]; texts: string[]; onType: (blank: number, text: string) => void }) {
  const layout = useMemo(() => blankBoxes(blanks), [blanks]);
  const incoming = blanks.map(blank => texts[blank.id] ?? '');
  const boxes = useWriteBoxes({ ayah: id, words: layout.words, asked: layout.asked, start: boxesOf(blanks, layout.first, incoming), onDone: () => boxes.blur() });
  const written = blanks.map((blank, index) => blankText(blank, layout.first[index], boxes.typed));
  const last = useRef({ id, written, incoming });
  useOnChange([id, written.join('\u0000'), incoming.join('\u0000')], () => {
    const before = last.current;
    last.current = { id, written, incoming };
    if (before.id !== id || before.written.length !== written.length) return;
    if (incoming.some((text, index) => text !== before.incoming[index] && text !== written[index])) {
      boxes.load(boxesOf(blanks, layout.first, incoming));
      return;
    }
    blanks.forEach((blank, index) => { if (written[index] !== before.written[index] && written[index] !== incoming[index]) onType(blank.id, written[index]); });
  });
  return {
    field: boxes.field,
    box: (index: number, at: number) => {
      const slot = layout.first[index] + at;
      return { typed: boxes.typed[slot] ?? '', active: boxes.current === slot, pick: () => boxes.pick(slot) };
    },
  };
}

export type WriteBlanks = ReturnType<typeof useWriteBlanks>;

'use client';

import { useMemo, useState } from 'react';
import { markForgotten } from '@shared/ayahMarks';
import { atStart, revealAyah, stepBack, type RecitePosition } from '@shared/quran/recite';
import { reciteView, type PageModel } from '@shared/quran/recitePage';
import { penTargets, type PenRule } from '@shared/quran/writeAyah';
import { ayahCounts } from '@/lib/listen';
import { useWriteBoxes, type Graded } from '@/app/quran/read/useWriteBoxes';
import type { Checked } from '@/app/quran/read/MushafPage';

/**
 * Recite mode (تسميع), the one way every place recites (owner, 2026-11-17; the app's mobile/src/components/recite/useRecite.ts):
 * the mushaf, the home recall card and the quiz page. It holds no place of its own; `position` is the caller's, so the
 * reader can keep it in its link. `model` is the page shown (joinModels for a spread). The next word, the next ayah and a
 * step back move it; with `writing` on, the next ayah's words the pen asks (`pen`) are boxes, and the last box shows the
 * ayah with the written words coloured, a mistake putting it on the forgotten shelf. `until`: the last ayah this place
 * asks; once it shows, nothing more is written and the next-ayah button calls `onPastEnd` (the reader's next forgotten
 * ayah). `onPastEnd` also runs when the page has no more ayat (the reader turns the page).
 */
export function useRecite({ model, position, setPosition, writing, pen, until = null, floor = 0, onPastEnd, onWritten, autoFocus = false }: {
  model: PageModel | null; position: RecitePosition | null; setPosition: (position: RecitePosition) => void;
  writing: boolean; pen: PenRule; until?: string | null;
  /** Words of the start ayah the place shows from the outset (a quiz's prompt): a step back never hides them. */
  floor?: number; onPastEnd?: () => void;
  onWritten?: (key: string, graded: Graded) => void; autoFocus?: boolean;
}) {
  const view = useMemo(() => (model && position ? reciteView(model, position) : null), [model, position]);
  const done = !!until && position?.shown === until;
  const writeKey = writing && view?.upcoming && !done ? view.upcoming : null;
  const words = useMemo(() => (writeKey && model ? model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === writeKey).map(group => group.word!) ?? []) : []), [writeKey, model]);
  const offset = writeKey?.endsWith(':1') ? view?.titled.get(Number(writeKey.split(':')[0])) ?? 0 : 0;
  // Words already shown (by the next-word button) are not asked.
  const asked = writeKey && view ? penTargets(words, pen).filter(at => view.hidden(writeKey, at + offset)) : [];
  const [checked, setChecked] = useState<Omit<Checked, 'before'> | null>(null);
  const boxes = useWriteBoxes({ ayah: writeKey, words, asked, autoFocus, onDone: graded => {
    if (!writeKey || !position) return;
    setChecked({ key: writeKey, ...graded });
    if (graded.wrong.length) markForgotten(writeKey);
    setPosition(revealAyah(position, writeKey));
    onWritten?.(writeKey, graded);
  } });
  const nextAyah = () => {
    if (!position || !view) return;
    const next = !done && view.nextAyah();
    if (next) setPosition(next);
    else onPastEnd?.();
  };
  const nextWord = () => {
    if (!position || !view) return;
    const next = !done && view.nextWord();
    if (next) setPosition(next);
    else nextAyah();
  };
  const first = !position || (atStart(position) || (position.shown === null && position.words <= floor));
  const back = () => {
    if (!position || first) return;
    const before = stepBack(position, ayahCounts);
    setPosition(before.shown === null && before.words < floor ? { ...before, words: floor } : before);
    setChecked(null);
  };
  return {
    view, done, pen, checked, setChecked, boxes, nextAyah, nextWord, back,
    atStart: first,
    /** The boxes as MushafPage takes them (with the words of the ayah on earlier pages as `before`), when the pen is writing. */
    write: writeKey ? { key: writeKey, targets: asked, typed: boxes.typed, current: boxes.current, onBox: boxes.pick } : null,
  };
}

export type Recite = ReturnType<typeof useRecite>;

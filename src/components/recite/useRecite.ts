'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { markForgotten, readDueMarks, rememberAyah, wordMarkKey } from '@shared/ayahMarks';
import { atStart, revealAyah, stepBack, type RecitePosition } from '@shared/quran/recite';
import { reciteView, type PageModel } from '@shared/quran/recitePage';
import { penTargets, type PenRule } from '@shared/quran/writeAyah';
import { blankBoxes, blankText, boxesOf, type WriteBlank } from '@shared/quiz/writeBlanks';
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
export function useRecite({ model, position, setPosition, writing, pen, until = null, floor = 0, onPastEnd, onWritten, onSubmit, autoFocus = false }: {
  model: PageModel | null; position: RecitePosition | null; setPosition: (position: RecitePosition) => void;
  writing: boolean; pen: PenRule; until?: string | null;
  /** Words of the start ayah the place shows from the outset (a quiz's prompt): a step back never hides them. */
  floor?: number; onPastEnd?: () => void;
  onWritten?: (key: string, graded: Graded) => void; autoFocus?: boolean;
  /**
   * A party (owner, 2026-11-17): the last box hands what was written over (`typed`, by word place) instead of grading it,
   * the ayah stays hidden until the party reveals it, the next ayah waits, and a step back empties the last box written.
   */
  onSubmit?: (key: string, typed: Record<number, string>) => void;
}) {
  const view = useMemo(() => (model && position ? reciteView(model, position) : null), [model, position]);
  const done = !!until && position?.shown === until;
  const writeKey = writing && view?.upcoming && !done ? view.upcoming : null;
  const words = useMemo(() => (writeKey && model ? model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === writeKey).map(group => group.word!) ?? []) : []), [writeKey, model]);
  const offset = writeKey?.endsWith(':1') ? view?.titled.get(Number(writeKey.split(':')[0])) ?? 0 : 0;
  // Words already shown (by the next-word button) are not asked.
  // A forgotten word under review is the one word asked, whatever the pen asks of a whole ayah.
  const asked = writeKey && view ? (position?.word === undefined ? penTargets(words, pen) : words.map((_, at) => at)).filter(at => view.hidden(writeKey, at + offset)) : [];
  const [checked, setChecked] = useState<Omit<Checked, 'before'> | null>(null);
  useEffect(() => setChecked(null), [position?.start, position?.word]);
  const boxes = useWriteBoxes({ ayah: writeKey && position?.word !== undefined ? wordMarkKey(writeKey, position.word) : writeKey, words, asked, autoFocus, onDone: (graded, typed) => {
    if (!writeKey || !position) return;
    if (onSubmit) { onSubmit(writeKey, typed); return; }
    setChecked({ key: writeKey, ...graded });
    // A word under review is marked, or rested, as the word; a whole ayah as the ayah.
    const key = position.word === undefined ? writeKey : wordMarkKey(writeKey, position.word);
    if (graded.wrong.length) markForgotten(key);
    // A right answer rests a mark only when it is due, so a resting one is not pushed further by recitations between reviews.
    else if (readDueMarks()[key]) rememberAyah(key);
    setPosition(revealAyah(position, writeKey));
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
    // In a party a word shown is a hint, never the whole ayah: the party shows it once everyone has written.
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
    /** The boxes as MushafPage takes them (with the words of the ayah on earlier pages as `before`), when the pen is writing. */
    write: writeKey ? { key: writeKey, targets: asked, typed: boxes.typed, current: boxes.current, onBox: boxes.pick } : null,
  };
}

export type Recite = ReturnType<typeof useRecite>;

/**
 * The written quizzes' blanks (متشابهات and the compare quiz) in recite mode's boxes (owner, 2026-11-19): every word to write
 * is a WriteBox, typed through the one hidden field, a space or a full box moving on to the next. The quiz keeps one text a
 * blank (`texts`, by blank id), so its grading is unchanged: `onType` hands back the blank the reader changed, one at a time,
 * and answers changed from outside (cleared, a party's copy) go back into the boxes. A saved answer is never rewritten
 * until its own boxes are typed in. `onEnd`: Enter on the last box (the quiz's check).
 */
export function useWriteBlanks({ id, blanks, texts, onType, onEnd }: { id: string; blanks: WriteBlank[]; texts: string[]; onType: (blank: number, text: string) => void; onEnd?: () => void }) {
  const layout = useMemo(() => blankBoxes(blanks), [blanks]);
  const incoming = blanks.map(blank => texts[blank.id] ?? '');
  const boxes = useWriteBoxes({ ayah: id, words: layout.words, asked: layout.asked, start: boxesOf(blanks, layout.first, incoming), onDone: () => boxes.blur(), onEnter: onEnd });
  const written = blanks.map((blank, index) => blankText(blank, layout.first[index], boxes.typed));
  // The last render of this question: what changed since, and who changed it.
  const last = useRef({ id, written, incoming });
  useEffect(() => {
    const before = last.current;
    last.current = { id, written, incoming };
    // A new question: its own saved answers stand.
    if (before.id !== id || before.written.length !== written.length) return;
    // From outside: an answer that changed to something the boxes don't hold.
    if (incoming.some((text, index) => text !== before.incoming[index] && text !== written[index])) {
      boxes.load(boxesOf(blanks, layout.first, incoming));
      return;
    }
    // From the boxes: the blank the reader is writing.
    blanks.forEach((blank, index) => { if (written[index] !== before.written[index] && written[index] !== incoming[index]) onType(blank.id, written[index]); });
  });
  return {
    field: boxes.field,
    /** The box of a blank's word (by its place among the blank's written words), as WriteBox takes it. */
    box: (index: number, at: number) => {
      const slot = layout.first[index] + at;
      return { typed: boxes.typed[slot] ?? '', active: boxes.current === slot, pick: () => boxes.pick(slot) };
    },
  };
}

export type WriteBlanks = ReturnType<typeof useWriteBlanks>;

import { useEffect, useRef, useState } from 'react';
import { freshBoxes, gradeWritten, nextBox, previousBox, typeInBox, type Boxes } from '@shared/quran/writeAyah';

export type Graded = ReturnType<typeof gradeWritten>;

/**
 * The write quiz's boxes (the reader's write mode and the home recall card), as the app's lib/useWriteBoxes: what each box
 * holds, the box being written, and the out-of-sight field the keyboard types into. `onDone` gets the grade once the last
 * box is written.
 */
export function useWriteBoxes({ ayah, words, asked, autoFocus = false, onDone }: { ayah: string | null; words: string[]; asked: number[]; autoFocus?: boolean; onDone: (graded: Graded) => void }) {
  const [boxes, setBoxes] = useState<Boxes>(() => freshBoxes(asked));
  const input = useRef<HTMLInputElement>(null);
  // A new ayah starts with empty boxes at once, so letters typed quickly after the last box go into its first box.
  const [writeFor, setWriteFor] = useState(ayah);
  if (writeFor !== ayah) {
    setWriteFor(ayah);
    setBoxes(freshBoxes(asked));
  } else if (boxes.current !== null && asked.length && !asked.includes(boxes.current)) {
    // A word revealed by the next-word button while its box was being written has no box any more.
    setBoxes({ ...boxes, current: asked[0] });
  }
  useEffect(() => { if (ayah && autoFocus) input.current?.focus({ preventScroll: true }); }, [ayah, autoFocus]);
  const step = ({ boxes: next, finished }: { boxes: Boxes; finished: boolean }) => {
    setBoxes(next);
    if (finished) onDone(gradeWritten(asked, next.typed, words));
  };
  const back = () => {
    const previous = previousBox(boxes, asked);
    if (previous) setBoxes(previous);
    return !!previous;
  };
  const empty = boxes.current !== null && !boxes.typed[boxes.current];
  const field = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input ref={input} value={boxes.current === null ? '' : boxes.typed[boxes.current] ?? ''}
      onChange={event => step(typeInBox(boxes, asked, words, event.target.value, (event.nativeEvent as InputEvent).isComposing))}
      onCompositionEnd={event => step(typeInBox(boxes, asked, words, event.currentTarget.value))}
      onKeyDown={event => {
        if (event.key === 'Enter') { event.preventDefault(); step(nextBox(boxes, asked)); return; }
        if (event.key === 'Backspace' && empty && back()) event.preventDefault();
      }}
      // Android keyboards often send no Backspace key for an empty field, only a delete input.
      onBeforeInput={event => { if ((event.nativeEvent as InputEvent).inputType === 'deleteContentBackward' && empty && back()) event.preventDefault(); }}
      dir="rtl" lang="ar" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} enterKeyHint="next"
      className="fixed left-0 top-0 h-px w-px text-[16px] opacity-0" {...props} />
  );
  return {
    typed: boxes.typed,
    current: boxes.current,
    /** A click on a box: write it. */
    pick: (at: number) => { setBoxes(current => ({ ...current, current: at })); input.current?.focus({ preventScroll: true }); },
    focus: () => input.current?.focus({ preventScroll: true }),
    blur: () => input.current?.blur(),
    input,
    field,
  };
}

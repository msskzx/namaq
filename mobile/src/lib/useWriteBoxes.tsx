import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { TextInput } from 'react-native';
import { clearLastBox, freshBoxes, gradeWritten, nextBox, previousBox, typeInBox, type Boxes } from '@shared/quran/writeAyah';

export type Graded = ReturnType<typeof gradeWritten>;

/**
 * The write quiz's boxes (the reader's write mode and the home recall card): what each box holds, the box being
 * written, and the out-of-sight field the keyboard types into. `onDone` gets the grade once the last box is written.
 */
export function useWriteBoxes({ ayah, words, asked, autoFocus = false, start, onDone }: { ayah: string | null; words: string[]; asked: number[]; autoFocus?: boolean;
  /** What the boxes hold when they open (a quiz's saved answer); empty when left out. */
  start?: Record<number, string>;
  onDone: (graded: Graded, typed: Record<number, string>) => void }) {
  const [boxes, setBoxes] = useState<Boxes>(() => ({ ...freshBoxes(asked), typed: start ?? {} }));
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  useEffect(() => {
    setBoxes({ ...freshBoxes(asked), typed: start ?? {} });
    if (ayah && autoFocus) setTimeout(() => input.current?.focus(), 50);
  }, [ayah]); // eslint-disable-line react-hooks/exhaustive-deps
  const step = ({ boxes: next, finished }: { boxes: Boxes; finished: boolean }) => {
    setBoxes(next);
    if (finished) onDone(gradeWritten(asked, next.typed, words), next.typed);
  };
  const onKey = (key: string) => {
    if (key !== 'Backspace' || boxes.current === null || boxes.typed[boxes.current]) return;
    const back = previousBox(boxes, asked);
    if (back) setBoxes(back);
  };
  const field = ayah ? (
    <TextInput ref={input} value={boxes.current === null ? '' : boxes.typed[boxes.current] ?? ''} onChangeText={text => step(typeInBox(boxes, asked, words, text))}
      onKeyPress={event => onKey(event.nativeEvent.key)} onSubmitEditing={() => step(nextBox(boxes, asked))}
      autoCorrect={false} autoCapitalize="none" spellCheck={false} autoComplete="off" blurOnSubmit={false}
      accessibilityLabel="اكتب الكلمة" style={{ position: 'absolute', opacity: 0, width: 1, height: 1, top: 0, left: 0 }} />
  ) : null;
  return {
    typed: boxes.typed,
    current: boxes.current,
    /** Empties the last box written and writes it again; false when none is written. */
    clearLast: () => { const cleared = clearLastBox(boxes, asked); if (cleared) { setBoxes(cleared); input.current?.focus(); } return !!cleared; },
    /** Puts these words in the boxes, writing the first (a quiz's answers cleared or loaded). */
    load: (typed: Record<number, string>) => setBoxes({ ...freshBoxes(asked), typed }),
    /** A tap on a box: write it. */
    pick: (at: number) => { setBoxes(current => ({ ...current, current: at })); input.current?.focus(); },
    focus: () => input.current?.focus(),
    blur: () => input.current?.blur(),
    /** The field the keyboard writes into; render it once, anywhere. */
    field,
  };
}

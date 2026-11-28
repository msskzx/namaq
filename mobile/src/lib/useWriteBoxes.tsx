import { useRef, useState, type ComponentRef } from 'react';
import { TextInput } from 'react-native';
import { clearLastBox, freshBoxes, gradeWritten, nextBox, previousBox, typeInBox, type Boxes } from '@shared/quran/writeAyah';
import { useLater } from './hooks/useLater';
import { useAdjustOn } from './hooks/useAdjustOn';
import { useOnChange } from './hooks/useOnChange';

export type Graded = ReturnType<typeof gradeWritten>;

export function useWriteBoxes({ ayah, words, asked, autoFocus = false, start, onDone }: { ayah: string | null; words: string[]; asked: number[]; autoFocus?: boolean;
  start?: Record<number, string>;
  onDone: (graded: Graded, typed: Record<number, string>) => void }) {
  const [boxes, setBoxes] = useState<Boxes>(() => ({ ...freshBoxes(asked), typed: start ?? {} }));
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  const focus = useLater();
  useAdjustOn([ayah], () => setBoxes({ ...freshBoxes(asked), typed: start ?? {} }));
  useOnChange([ayah], () => { if (ayah && autoFocus) focus.after(50, () => input.current?.focus()); });
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
    clearLast: () => { const cleared = clearLastBox(boxes, asked); if (cleared) { setBoxes(cleared); input.current?.focus(); } return !!cleared; },
    load: (typed: Record<number, string>) => setBoxes({ ...freshBoxes(asked), typed }),
    pick: (at: number) => { setBoxes(current => ({ ...current, current: at })); input.current?.focus(); },
    focus: () => input.current?.focus(),
    blur: () => input.current?.blur(),
    field,
  };
}

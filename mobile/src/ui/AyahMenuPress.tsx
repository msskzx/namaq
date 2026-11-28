import { useContext, useMemo, type ReactElement } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { AyahMenuContext } from './ayahMenuContext';
import { buzz } from '@/lib/haptics';

export type AyahMenuKeys = string | readonly string[] | false;

export function AyahMenuPress({ menu, children }: { menu: AyahMenuKeys; children: ReactElement }) {
  const open = useContext(AyahMenuContext);
  const keys = useMemo(() => (menu === false ? [] : typeof menu === 'string' ? [menu] : [...menu]), [menu]);
  const press = useMemo(() => (keys.length && open
    ? Gesture.LongPress().runOnJS(true).onStart(event => { buzz(); open(keys, { x: event.absoluteX, y: event.absoluteY }); })
    : null), [keys, open]);
  return press ? <GestureDetector gesture={press}>{children}</GestureDetector> : children;
}

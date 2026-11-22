import { useContext, useMemo, type ReactElement } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { AyahMenuContext } from './ayahMenuContext';
import { buzz } from '@/lib/haptics';

/** The ayah (or ayat, in order) a view's long press opens the reader's menu on, or false where it opens nothing. */
export type AyahMenuKeys = string | readonly string[] | false;

/**
 * A long press on an ayah view opens the reader's menu on `menu` (owner, 2026-11-22); a view of several ayat lets the menu
 * ask which. A tap still reaches the card or button around it. With `menu` false, inside a sheet, or where no host is drawn
 * (a share image, a test), it adds nothing.
 */
export function AyahMenuPress({ menu, children }: { menu: AyahMenuKeys; children: ReactElement }) {
  const open = useContext(AyahMenuContext);
  const keys = useMemo(() => (menu === false ? [] : typeof menu === 'string' ? [menu] : [...menu]), [menu]);
  const press = useMemo(() => (keys.length && open
    ? Gesture.LongPress().runOnJS(true).onStart(event => { buzz(); open(keys, { x: event.absoluteX, y: event.absoluteY }); })
    : null), [keys, open]);
  return press ? <GestureDetector gesture={press}>{children}</GestureDetector> : children;
}

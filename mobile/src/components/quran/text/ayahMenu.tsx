import { createContext, useContext, useMemo, type ReactElement } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { MenuAt } from '@/ui/FloatingMenu';
import { buzz } from '@/lib/haptics';

/** Opens the reader's long-press menu on an ayah where the finger pressed (components/AyahMenuHost.tsx draws it). */
export type OpenAyahMenu = (key: string, at: MenuAt) => void;

export const AyahMenuContext = createContext<OpenAyahMenu | null>(null);

/**
 * A long press on an ayah view opens the reader's menu on `menu`, the ayah's key (owner, 2026-11-22). A tap still reaches
 * the card or button around it. With `menu` false, or where no host is drawn (a share image, a test), it adds nothing.
 */
export function AyahMenuPress({ menu, children }: { menu: string | false; children: ReactElement }) {
  const open = useContext(AyahMenuContext);
  const press = useMemo(() => (menu && open
    ? Gesture.LongPress().runOnJS(true).onStart(event => { buzz(); open(menu, { x: event.absoluteX, y: event.absoluteY }); })
    : null), [menu, open]);
  return press ? <GestureDetector gesture={press}>{children}</GestureDetector> : children;
}

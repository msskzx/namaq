/** What a tap, double tap and long press do on the Quran reader's page, chosen per mode in the settings sheet. Kept in this browser. */
export type ReaderMode = 'read' | 'recite';
export type Gesture = 'tap' | 'double' | 'long';
export type GestureAction = 'tools' | 'next-ayah' | 'next-word' | 'back' | 'actions' | 'forgot' | 'save' | 'none';
export type ReaderGestures = Record<ReaderMode, Record<Gesture, GestureAction>>;

export const GESTURES: Gesture[] = ['tap', 'double', 'long'];

/** The actions each mode offers: revealing and stepping back only mean something while reciting. */
export const MODE_ACTIONS: Record<ReaderMode, GestureAction[]> = {
  read: ['tools', 'actions', 'forgot', 'save', 'none'],
  recite: ['next-ayah', 'next-word', 'back', 'actions', 'forgot', 'save', 'tools', 'none'],
};

export const DEFAULT_GESTURES: ReaderGestures = {
  read: { tap: 'tools', double: 'save', long: 'actions' },
  recite: { tap: 'next-ayah', double: 'next-word', long: 'actions' },
};

/** Actions that work on the ayah under the finger; the rest act on the page. */
export const AYAH_ACTIONS: ReadonlySet<GestureAction> = new Set(['actions', 'forgot', 'save']);

const KEY = 'reader-gestures';
const listeners = new Set<() => void>();
let cache: { raw: string | null; gestures: ReaderGestures } = { raw: null, gestures: DEFAULT_GESTURES };

export function parseGestures(raw: string | null): ReaderGestures {
  let parsed: unknown = null;
  try { parsed = raw ? JSON.parse(raw) : null; } catch {}
  const stored = (parsed && typeof parsed === 'object' ? parsed : {}) as Partial<Record<ReaderMode, Partial<Record<Gesture, string>>>>;
  const pick = (mode: ReaderMode, gesture: Gesture): GestureAction => {
    const value = stored[mode]?.[gesture] as GestureAction | undefined;
    return value && MODE_ACTIONS[mode].includes(value) ? value : DEFAULT_GESTURES[mode][gesture];
  };
  return {
    read: { tap: pick('read', 'tap'), double: pick('read', 'double'), long: pick('read', 'long') },
    recite: { tap: pick('recite', 'tap'), double: pick('recite', 'double'), long: pick('recite', 'long') },
  };
}

export function readGestures(): ReaderGestures {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch {}
  if (raw !== cache.raw) cache = { raw, gestures: parseGestures(raw) };
  return cache.gestures;
}

export function setGesture(mode: ReaderMode, gesture: Gesture, action: GestureAction) {
  const next = readGestures();
  const updated = { ...next, [mode]: { ...next[mode], [gesture]: action } };
  try { localStorage.setItem(KEY, JSON.stringify(updated)); } catch {}
  listeners.forEach(listener => listener());
}

export function resetGestures() {
  try { localStorage.removeItem(KEY); } catch {}
  listeners.forEach(listener => listener());
}

export function subscribeGestures(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => { listeners.delete(listener); window.removeEventListener('storage', listener); };
}

export const serverGestures = () => DEFAULT_GESTURES;

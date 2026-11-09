import { keyStore } from './storage';

/** What a tap, double tap and long press do on the Quran reader's page, chosen per mode in the settings sheet. Kept on this device. */
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

const store = keyStore('reader-gestures', parseGestures);

export const readGestures = store.read;

export function setGesture(mode: ReaderMode, gesture: Gesture, action: GestureAction) {
  const next = readGestures();
  store.write(JSON.stringify({ ...next, [mode]: { ...next[mode], [gesture]: action } }));
}

export const resetGestures = () => store.write('');

export const subscribeGestures = store.subscribe;

export const serverGestures = () => DEFAULT_GESTURES;

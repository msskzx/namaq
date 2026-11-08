/** Ayat a reader marked while reading or reciting: how often they forgot each one, and which they saved. Kept in this browser for now. */
export type AyahMark = { forgot?: number; saved?: boolean; at: number };
export type AyahMarks = Record<string, AyahMark>;

const KEY = 'ayah-marks';
const listeners = new Set<() => void>();
let cache: { raw: string | null; marks: AyahMarks } = { raw: null, marks: {} };

export function readAyahMarks(): AyahMarks {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch {}
  if (raw === cache.raw) return cache.marks;
  let marks: AyahMarks = {};
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) marks = parsed;
  } catch {}
  cache = { raw, marks };
  return marks;
}

function write(marks: AyahMarks) {
  try { localStorage.setItem(KEY, JSON.stringify(marks)); } catch {}
  listeners.forEach(listener => listener());
}

function update(key: string, change: (mark: AyahMark) => AyahMark) {
  const marks = { ...readAyahMarks() };
  const next = change({ ...(marks[key] ?? { at: 0 }), at: Date.now() });
  if (!next.forgot && !next.saved) delete marks[key];
  else marks[key] = next;
  write(marks);
}

export const markForgotten = (key: string) => update(key, mark => ({ ...mark, forgot: (mark.forgot ?? 0) + 1 }));
export const clearForgotten = (key: string) => update(key, mark => ({ ...mark, forgot: undefined }));
export const toggleSavedAyah = (key: string) => update(key, mark => ({ ...mark, saved: !mark.saved }));

export function subscribeAyahMarks(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => { listeners.delete(listener); window.removeEventListener('storage', listener); };
}

const NONE: AyahMarks = {};
export const serverAyahMarks = () => NONE;

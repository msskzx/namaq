/** Ayat a reader forgot while reading or reciting, with how often, kept in this browser for now. Saved ayat go to the shared bookmarks. */
export type AyahMark = { forgot: number; at: number };
export type AyahMarks = Record<string, AyahMark>;

const KEY = 'ayah-forgot';
const listeners = new Set<() => void>();
let cache: { raw: string | null; marks: AyahMarks } = { raw: null, marks: {} };

export function readAyahMarks(): AyahMarks {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch {}
  if (raw === cache.raw) return cache.marks;
  const marks: AyahMarks = {};
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      for (const [key, value] of Object.entries(parsed)) {
        const mark = value as Partial<AyahMark> | null;
        if (/^\d+:\d+$/.test(key) && mark && Number(mark.forgot) > 0) marks[key] = { forgot: Number(mark.forgot), at: Number(mark.at) || 0 };
      }
    }
  } catch {}
  cache = { raw, marks };
  return marks;
}

function write(marks: AyahMarks) {
  try { localStorage.setItem(KEY, JSON.stringify(marks)); } catch {}
  listeners.forEach(listener => listener());
}

/** Counts one more time this ayah was forgotten. */
export function markForgotten(key: string) {
  const marks = readAyahMarks();
  write({ ...marks, [key]: { forgot: (marks[key]?.forgot ?? 0) + 1, at: Date.now() } });
}

/** The reader knows it now: the ayah leaves the list to review. */
export function clearForgotten(key: string) {
  const rest = { ...readAyahMarks() };
  delete rest[key];
  write(rest);
}

export function subscribeAyahMarks(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => { listeners.delete(listener); window.removeEventListener('storage', listener); };
}

const NONE: AyahMarks = {};
export const serverAyahMarks = () => NONE;

/** Bookmark id and link for one saved ayah. */
export const ayahBookmarkId = (key: string) => `ayah:${key}`;
export const ayahHref = (key: string) => `/quran/read/ayah/${key.replace(':', '/')}`;

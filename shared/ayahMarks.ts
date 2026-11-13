import { keyStore } from './storage';

/** Ayat a reader forgot while reading or reciting, with how often, kept on this device for now. Saved ayat go to the shared bookmarks. */
export type AyahMark = { forgot: number; at: number };
export type AyahMarks = Record<string, AyahMark>;

const NONE: AyahMarks = {};

function parse(raw: string | null): AyahMarks {
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
  return Object.keys(marks).length ? marks : NONE;
}

const store = keyStore('ayah-forgot', parse);

export const readAyahMarks = store.read;
const write = (marks: AyahMarks) => store.write(JSON.stringify(marks));

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

/** The forgotten ayat, the last one forgotten first, as the homepage shows them. */
export const recentlyForgotten = (marks: AyahMarks) =>
  Object.keys(marks).sort((a, b) => marks[b].at - marks[a].at);

export const subscribeAyahMarks = store.subscribe;
export const serverAyahMarks = () => NONE;

/** Bookmark id and link for one saved ayah. */
export const ayahBookmarkId = (key: string) => `ayah:${key}`;
export const ayahHref = (key: string) => `/quran/read/ayah/${key.replace(':', '/')}`;

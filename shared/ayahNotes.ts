import { keyStore } from './storage';

/** A reader's own note on an ayah, kept on this device only. */
export type AyahNote = { text: string; at: number };
export type AyahNotes = Record<string, AyahNote>;

const NONE: AyahNotes = {};

function parse(raw: string | null): AyahNotes {
  const notes: AyahNotes = {};
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      for (const [key, value] of Object.entries(parsed)) {
        const note = value as Partial<AyahNote> | null;
        if (/^\d+:\d+$/.test(key) && note && typeof note.text === 'string' && note.text.trim()) notes[key] = { text: note.text, at: Number(note.at) || 0 };
      }
    }
  } catch {}
  return Object.keys(notes).length ? notes : NONE;
}

const store = keyStore('ayah-notes', parse);

export const readAyahNotes = store.read;
export const subscribeAyahNotes = store.subscribe;
export const serverAyahNotes = () => NONE;

/** Keeps the note; an empty one removes it. */
export function writeAyahNote(key: string, text: string) {
  const notes = { ...readAyahNotes() };
  if (text.trim()) notes[key] = { text, at: Date.now() };
  else delete notes[key];
  store.write(JSON.stringify(notes));
}

/** The notes newest first. */
export const notesByDate = (notes: AyahNotes) => Object.keys(notes).sort((a, b) => notes[b].at - notes[a].at);

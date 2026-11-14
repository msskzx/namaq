// The website side of the colour setting for shared words (shared/quran/wordMatch.ts): kept per device in localStorage
// and applied as <html data-marks>, which src/app/theme.css reads into --mark-exact, --mark-written and --mark-root.
import { isMarkMode, type Likeness, type MarkMode } from '@shared/quran/wordMatch';

const STORAGE = 'word-marks';

export function readMarkMode(): MarkMode {
  try { const value = localStorage.getItem(STORAGE); return isMarkMode(value) ? value : 'kinds'; } catch { return 'kinds'; }
}

export function setMarkMode(mode: MarkMode) {
  try { localStorage.setItem(STORAGE, mode); } catch { /* private mode: still applies for this visit */ }
  document.documentElement.setAttribute('data-marks', mode);
}

/** Runs in <head> before the first paint so a stored choice never flashes the default. */
export const MARK_MODE_SCRIPT = `try{var m=localStorage.getItem('${STORAGE}');if(m)document.documentElement.setAttribute('data-marks',m)}catch(e){}`;

/** The text colour class of each likeness. */
export const MARK_CLASS: Record<Likeness, string> = {
  exact: 'text-[var(--mark-exact)]',
  written: 'text-[var(--mark-written)]',
  root: 'text-[var(--mark-root)]',
};
